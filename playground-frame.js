// The model path is deliberately unique. Uploading "model.json" into an
// existing p5 project creates "model-1.json" instead of replacing the old file.
const MODEL_URL = "assets/teachable/phone-model.json";
const METADATA_URL = "assets/teachable/metadata.json";
const BLACK_CONFIDENCE = 0.66;
const WHITE_CONFIDENCE = 0.82;
const MIN_CLASS_MARGIN = 0.24;
const BLACK_STABLE_FRAMES = 1;
const WHITE_STABLE_FRAMES = 2;
const CLASSIFY_DELAY = 150;
const NEUTRAL_AFTER_FRAMES = 3;
const TFJS_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.4/dist/tf.min.js";
const TEACHABLE_URL = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js";

const VISUALS = {
  "black phone": {
    mode: "black",
    name: "BLACK PHONE",
    accent: [192, 254, 4]
  },
  "white phone": {
    mode: "white",
    name: "WHITE PHONE",
    accent: [255, 255, 255]
  }
};

const NEUTRAL_VISUAL = {
  mode: "idle",
  name: "NEUTRAL",
  accent: [115, 115, 115]
};

let model;
let video;
let modelReady = false;
let classifying = false;
let stableLabel = "Neutral";
let candidateLabel = "";
let candidateFrames = 0;
let lowConfidenceFrames = 0;
let confidence = 0;
let rawLabel = "Waiting";
let stateStarted = 0;
const libraryScripts = new Map();

function setup() {
  const canvas = createCanvas(960, 540);
  canvas.parent("sketch");
  pixelDensity(1);
  textFont("monospace");
  stateStarted = millis();
  notifyParent({ type: "teachable:frame-ready" });

  video = createCapture(
    { video: { facingMode: "user" }, audio: false },
    () => setStatus("CAMERA READY / LOADING MODEL")
  );
  video.size(640, 480);
  video.hide();

  boot();
}

async function boot() {
  setStatus("WAITING FOR CAMERA");

  try {
    await waitForVideo(video.elt);
  } catch (error) {
    console.error("Startup error:", error);
    setStatus(`ERROR: ${friendlyError(error)}`);
    notifyParent({
      type: "teachable:error",
      message: friendlyError(error)
    });
    return;
  }

  setStatus("CAMERA READY / LOADING MODEL");
  loadModelWithRetry();
}

async function loadModelWithRetry() {
  if (modelReady) return;

  setStatus("LOADING MODEL");

  try {
    await ensureModelLibraries();
    model = await loadTeachableModel();
    modelReady = true;
    setStatus("MODEL READY");
    notifyParent({ type: "teachable:model-ready" });
    classifyLoop();
  } catch (error) {
    console.error("Model loading error:", error);
    setStatus(`MODEL RETRY: ${friendlyError(error)}`);
    notifyParent({
      type: "teachable:warning",
      message: "Camera live / loading recognition model"
    });
    setTimeout(() => {
      if (!modelReady) loadModelWithRetry();
    }, 3000);
  }
}

function loadLibrary(src) {
  if (libraryScripts.has(src)) return libraryScripts.get(src);

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      libraryScripts.delete(src);
      reject(new Error(`Library failed: ${src}`));
    };
    document.head.append(script);
  });

  libraryScripts.set(src, promise);
  return promise;
}

async function ensureModelLibraries() {
  if (typeof window.tf === "undefined") {
    await loadLibrary(TFJS_URL);
  }
  if (typeof window.tmImage === "undefined") {
    await loadLibrary(TEACHABLE_URL);
  }
  if (!window.tf || !window.tmImage) {
    throw new Error("Teachable Machine library unavailable");
  }
  await window.tf.ready();
}

async function loadTeachableModel() {
  const [modelResponse, metadataResponse] = await Promise.all([
    fetch(MODEL_URL),
    fetch(METADATA_URL)
  ]);

  if (!modelResponse.ok || !metadataResponse.ok) {
    throw new Error(
      `Model files: ${modelResponse.status} / ${metadataResponse.status}`
    );
  }

  const modelJSON = await modelResponse.json();
  const metadata = await metadataResponse.json();
  const weightBuffers = await loadWeightBuffers(modelJSON.weightsManifest);
  const weightSpecs = modelJSON.weightsManifest.flatMap(
    (group) => group.weights
  );
  const weightData = joinArrayBuffers(weightBuffers);

  const layersModel = await window.tf.loadLayersModel({
    load: async () => ({
      modelTopology: modelJSON.modelTopology,
      weightSpecs,
      weightData
    })
  });

  return new window.tmImage.CustomMobileNet(layersModel, metadata);
}

async function loadWeightBuffers(manifest) {
  const paths = manifest.flatMap((group) => group.paths);
  const modelDirectory = new URL(".", new URL(MODEL_URL, window.location.href));
  const responses = await Promise.all(
    paths.map((path) => fetch(new URL(path, modelDirectory)))
  );

  responses.forEach((response) => {
    if (!response.ok) {
      throw new Error(`Weights file: ${response.status}`);
    }
  });

  return Promise.all(responses.map((response) => response.arrayBuffer()));
}

function joinArrayBuffers(buffers) {
  if (buffers.length === 1) return buffers[0];

  const totalLength = buffers.reduce(
    (sum, buffer) => sum + buffer.byteLength,
    0
  );
  const result = new Uint8Array(totalLength);
  let offset = 0;

  buffers.forEach((buffer) => {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  });

  return result.buffer;
}

function waitForVideo(element) {
  return new Promise((resolve, reject) => {
    const started = Date.now();

    function check() {
      if (element.readyState >= 2 && element.videoWidth > 0) {
        resolve();
        return;
      }

      if (Date.now() - started > 30000) {
        reject(new Error("Camera did not start"));
        return;
      }

      setTimeout(check, 100);
    }

    check();
  });
}

async function classifyLoop() {
  if (!modelReady || classifying) return;
  classifying = true;

  try {
    const predictions = await model.predict(video.elt);
    handlePredictions(predictions);
  } catch (error) {
    console.error("Classification error:", error);
    setStatus(`CLASSIFY ERROR: ${friendlyError(error)}`);
    notifyParent({
      type: "teachable:warning",
      message: "Recognition paused / retrying"
    });
  } finally {
    classifying = false;
    setTimeout(classifyLoop, CLASSIFY_DELAY);
  }
}

function handlePredictions(predictions) {
  if (!Array.isArray(predictions) || predictions.length === 0) return;

  const ranked = [...predictions].sort(
    (first, second) => second.probability - first.probability
  );
  const best = ranked[0];
  const runnerUp = ranked[1] || { probability: 0 };

  rawLabel = best.className;
  confidence = best.probability;
  const label = normalizeLabel(best.className);
  const margin = best.probability - runnerUp.probability;
  const requiredConfidence = label === "white phone"
    ? WHITE_CONFIDENCE
    : label === "black phone"
      ? BLACK_CONFIDENCE
      : 1;
  const requiredFrames = label === "white phone"
    ? WHITE_STABLE_FRAMES
    : BLACK_STABLE_FRAMES;
  const accepted = (
    confidence >= requiredConfidence &&
    margin >= MIN_CLASS_MARGIN
  );

  if (accepted) {
    lowConfidenceFrames = 0;

    if (label === candidateLabel) {
      candidateFrames += 1;
    } else {
      candidateLabel = label;
      candidateFrames = 1;
    }

    if (candidateFrames >= requiredFrames && label !== stableLabel) {
      stableLabel = label;
      stateStarted = millis();
    }
  } else {
    candidateFrames = 0;
    lowConfidenceFrames += 1;

    if (
      lowConfidenceFrames >= NEUTRAL_AFTER_FRAMES &&
      stableLabel !== "Neutral"
    ) {
      stableLabel = "Neutral";
      stateStarted = millis();
    }
  }

  const visual = visualState(stableLabel);
  setStatus(
    `RAW ${rawLabel.toUpperCase()} ${Math.round(confidence * 100)}% / ` +
    `MARGIN ${Math.round(margin * 100)}% / ${visual.name}`
  );
  notifyParent({
    type: "teachable:state",
    state: visual.mode === "idle" ? "neutral" : visual.mode,
    label: visual.name,
    confidence
  });
}

function draw() {
  background(12);
  drawVideo();

  const visual = visualState(stableLabel);

  if (visual.mode === "black") {
    drawBlackPhoneMode(visual);
  } else if (visual.mode === "white") {
    drawWhitePhoneMode(visual);
  } else {
    drawNeutralMode(visual);
  }

  drawInterface(visual);
}

function drawVideo() {
  if (!video || !video.elt || !video.elt.videoWidth) return;

  const videoAspect = video.elt.videoWidth / video.elt.videoHeight;
  const canvasAspect = width / height;
  let drawWidth = width;
  let drawHeight = height;

  if (videoAspect > canvasAspect) {
    drawWidth = height * videoAspect;
  } else {
    drawHeight = width / videoAspect;
  }

  push();
  translate(width, 0);
  scale(-1, 1);
  image(
    video,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight
  );
  pop();
}

function drawBlackPhoneMode(visual) {
  const accent = visual.accent;

  noStroke();
  fill(242, 32, 10, 112);
  rect(0, 0, width, height);

  blendMode(SCREEN);
  fill(accent[0], accent[1], accent[2], 66);
  rect(0, 0, width, height);
  blendMode(BLEND);

  stroke(accent[0], accent[1], accent[2], 190);
  strokeWeight(frameCount % 6 < 2 ? 3 : 1);
  for (let y = (frameCount * 5) % 7; y < height; y += 7) {
    line(0, y, width, y);
  }

  noStroke();
  for (let i = 0; i < 30; i += 1) {
    const speed = 5 + (i % 7);
    const x = (frameCount * speed + i * 83) % (width + 320) - 160;
    const y = (i * 43 + frameCount * (1 + (i % 3))) % height;
    const w = 38 + ((i * 31 + frameCount * 3) % 260);
    const h = 4 + (i % 5) * 6;
    fill(
      i % 3 === 0
        ? color(255, 255, 255, 105)
        : color(accent[0], accent[1], accent[2], 145)
    );
    rect(x, y, w, h);
  }

  if (frameCount % 7 < 2) {
    noStroke();
    fill(255, 255, 255, 82);
    rect(0, random(height), width, random(3, 22));
  }

  blendMode(DIFFERENCE);
  noStroke();
  fill(255, 255, 255, frameCount % 22 < 3 ? 118 : 24);
  rect(0, (frameCount * 29) % height, width, random(12, 54));
  blendMode(BLEND);

  drawGlitchFrame(accent, 18 + (frameCount % 12));
}

function drawWhitePhoneMode(visual) {
  noStroke();
  fill(255, 255, 255, 148);
  rect(0, 0, width, height);

  stroke(255, 255, 255, 205);
  strokeWeight(frameCount % 10 < 3 ? 3 : 1);
  for (let y = (frameCount * 3) % 9; y < height; y += 9) {
    line(0, y, width, y);
  }

  noFill();
  stroke(255);
  strokeWeight(3);
  for (let i = 0; i < 3; i += 1) {
    const pulse = (
      108 +
      sin((millis() - stateStarted) / 320 - i * 0.7) * 28 +
      i * 54
    );
    rect(width / 2 - pulse / 2, height / 2 - pulse / 2, pulse, pulse);
  }

  noStroke();
  fill(255, 255, 255, 225);
  rect(0, (frameCount * 9) % height, width, frameCount % 8 < 2 ? 10 : 3);

  for (let i = 0; i < 9; i += 1) {
    const x = (frameCount * (3 + i * 0.4) + i * 127) % width;
    const y = (i * 71 + frameCount * 2) % height;
    fill(255, 100 + (i % 3) * 45);
    rect(x, y, random(30, 130), random(2, 8));
  }

  blendMode(DIFFERENCE);
  fill(255, frameCount % 18 < 2 ? 220 : 40);
  rect(0, 0, width, height);
  blendMode(BLEND);

  drawCorner(visual.accent);
  drawGlitchFrame(visual.accent, 12 + (frameCount % 8));
}

function drawNeutralMode(visual) {
  noStroke();
  fill(0, 0, 0, 126);
  rect(0, 0, width, height);

  stroke(visual.accent[0], 80);
  strokeWeight(1);
  for (let x = 0; x < width; x += 32) {
    for (let y = 0; y < height; y += 32) {
      point(x, y);
    }
  }

  noFill();
  stroke(255, 35);
  strokeWeight(1);
  const size = 90 + sin(frameCount * 0.04) * 12;
  rect(width / 2 - size / 2, height / 2 - size / 2, size, size);
}

function drawGlitchFrame(accent, count) {
  noFill();
  strokeWeight(2);

  for (let i = 0; i < count; i += 1) {
    const x = random(width);
    const y = random(height);
    const w = random(24, 190);
    const h = random(2, 12);
    stroke(
      i % 2 === 0 ? accent[0] : 255,
      i % 2 === 0 ? accent[1] : 255,
      i % 2 === 0 ? accent[2] : 255,
      random(80, 220)
    );
    rect(x, y, w, h);
  }
}

function drawInterface(visual) {
  const accent = color(
    visual.accent[0],
    visual.accent[1],
    visual.accent[2]
  );

  noStroke();
  fill(0, 220);
  rect(24, height - 136, 352, 108);
  stroke(accent);
  strokeWeight(1);
  noFill();
  rect(24, height - 136, 352, 108);

  noStroke();
  fill(accent);
  textSize(10);
  textAlign(LEFT, TOP);
  text("OBJECT-CONTROLLED STATE", 40, height - 112);

  textSize(visual.name.length > 11 ? 26 : 34);
  text(visual.name, 40, height - 82);

  textSize(9);
  fill(255, 180);
  text(`RAW ${rawLabel.toUpperCase()} / ${Math.round(confidence * 100)}%`, 40, height - 40);

  drawConfidence(accent);
  drawReticle(accent);
  drawCorner(visual.accent);

  fill(255);
  noStroke();
  textAlign(RIGHT, TOP);
  textSize(10);
  text(visual.name, width - 24, 24);
  textSize(9);
  fill(255, 180);
  text("B / W / N TO TEST", width - 24, 42);
  textAlign(LEFT, TOP);
}

function drawConfidence(accent) {
  const x = width - 184;
  const y = height - 44;
  const w = 160;

  noFill();
  stroke(255, 100);
  strokeWeight(1);
  rect(x, y, w, 8);

  noStroke();
  fill(accent);
  rect(x + 1, y + 1, (w - 2) * confidence, 6);
}

function drawReticle(accent) {
  push();
  translate(width / 2, height / 2);
  noFill();
  stroke(accent);
  strokeWeight(1);
  rect(-54, -54, 108, 108);
  line(-78, 0, -62, 0);
  line(62, 0, 78, 0);
  line(0, -78, 0, -62);
  line(0, 62, 0, 78);
  pop();
}

function drawCorner(accent) {
  const size = 22;
  const pad = 12;

  stroke(accent[0], accent[1], accent[2] || 255, 210);
  strokeWeight(2);
  noFill();

  line(pad, pad, pad + size, pad);
  line(pad, pad, pad, pad + size);
  line(width - pad, pad, width - pad - size, pad);
  line(width - pad, pad, width - pad, pad + size);
  line(pad, height - pad, pad + size, height - pad);
  line(pad, height - pad, pad, height - pad - size);
  line(width - pad, height - pad, width - pad - size, height - pad);
  line(width - pad, height - pad, width - pad, height - pad - size);
}

function keyPressed() {
  const keyName = key.toLowerCase();

  if (keyName === "b") {
    setManualState("black phone");
  } else if (keyName === "w") {
    setManualState("white phone");
  } else if (keyName === "n") {
    setManualState("neutral");
  }
}

function setManualState(label) {
  const visual = visualState(label);
  stableLabel = label;
  confidence = 1;
  rawLabel = label === "neutral" ? "Manual neutral" : label;
  stateStarted = millis();
  setStatus(`MANUAL TEST / ${visual.name}`);
  notifyParent({
    type: "teachable:state",
    state: visual.mode === "idle" ? "neutral" : visual.mode,
    label: visual.name,
    confidence
  });
}

function normalizeLabel(label) {
  return String(label || "").trim().toLowerCase();
}

function visualState(label) {
  return VISUALS[normalizeLabel(label)] || NEUTRAL_VISUAL;
}

function setStatus(message) {
  const element = document.querySelector("#model-status");
  if (element) element.textContent = message;
}

function friendlyError(error) {
  const message = error && error.message ? error.message : String(error);
  return message.length > 54 ? `${message.slice(0, 51)}...` : message;
}

function notifyParent(payload) {
  if (window.parent !== window) {
    window.parent.postMessage(payload, window.location.origin);
  }
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.type !== "teachable:set-state") return;

  if (event.data.state === "black") setManualState("black phone");
  if (event.data.state === "white") setManualState("white phone");
  if (event.data.state === "neutral") setManualState("neutral");
});
