const VISION_MODULE_URL = "assets/mediapipe/vision_bundle.mjs";
const FACE_MODEL_URL = "assets/mediapipe/face_landmarker.task";
const WASM_ROOT = "assets/mediapipe/wasm";
const MATRIX_GREEN = [84, 255, 112];
const EFFECT_DELAY = 3000;
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
];
const GLYPHS = "01{}[]<>/\\|+-=:_;XYZ01";

let video;
let faceLandmarker;
let faceLandmarks = null;
let faceLocked = false;
let faceTrackerReady = false;
let lastVideoTime = -1;
let lastDetectionTime = 0;
let lastFaceNotice = 0;
let trackerRetryTimer = 0;
let stateStarted = 0;
let effectStartAt = 0;
let effectActive = false;

function setup() {
  const canvas = createCanvas(960, 540);
  canvas.parent("sketch");
  pixelDensity(1);
  textFont("monospace");
  stateStarted = millis();
  notifyParent({ type: "teachable:frame-ready" });

  video = createCapture(
    {
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    },
    () => setStatus("CAMERA READY / LOADING FACE MODEL")
  );
  video.size(960, 540);
  video.hide();

  boot();
}

async function boot() {
  setStatus("WAITING FOR CAMERA");

  try {
    await waitForVideo(video.elt);
  } catch (error) {
    console.error("Camera startup error:", error);
    setStatus(`CAMERA ERROR: ${friendlyError(error)}`);
    notifyParent({
      type: "teachable:error",
      message: friendlyError(error)
    });
    return;
  }

  setStatus("CAMERA READY / LOADING FACE MODEL");
  effectStartAt = performance.now() + EFFECT_DELAY;
  loadFaceTrackerWithRetry();
}

async function loadFaceTrackerWithRetry() {
  if (faceTrackerReady) return;
  window.clearTimeout(trackerRetryTimer);
  setStatus("LOADING FACE MODEL");

  try {
    const vision = await import(
      new URL(VISION_MODULE_URL, window.location.href).href
    );
    const fileset = await vision.FilesetResolver.forVisionTasks(WASM_ROOT);
    const options = {
      baseOptions: {
        modelAssetPath: FACE_MODEL_URL,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false
    };

    try {
      faceLandmarker = await vision.FaceLandmarker.createFromOptions(
        fileset,
        options
      );
    } catch (gpuError) {
      console.warn("GPU face tracker failed, retrying on CPU.", gpuError);
      faceLandmarker = await vision.FaceLandmarker.createFromOptions(
        fileset,
        {
          ...options,
          baseOptions: {
            ...options.baseOptions,
            delegate: "CPU"
          }
        }
      );
    }

    faceTrackerReady = true;
    setStatus("FACE MODEL READY");
    notifyParent({ type: "teachable:model-ready" });
  } catch (error) {
    console.error("Face model loading error:", error);
    setStatus(`FACE MODEL RETRY: ${friendlyError(error)}`);
    notifyParent({
      type: "teachable:warning",
      message: `Camera live / face model: ${friendlyError(error)}`
    });
    trackerRetryTimer = window.setTimeout(loadFaceTrackerWithRetry, 3000);
  }
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

function draw() {
  background(4);
  drawVideo();
  detectFace();

  if (!effectActive && performance.now() >= effectStartAt) {
    effectActive = true;
  }

  if (!effectActive) {
    drawCountdownField();
    drawInterface();
    return;
  }

  drawSignalField();

  if (faceLandmarks && faceLandmarks.length) {
    drawMatrixFace(faceLandmarks);
  } else {
    drawFallbackFaceField();
    drawSearchMode();
  }

  drawInterface();
}

function drawCountdownField() {
  noStroke();
  fill(0, 88);
  rect(0, 0, width, height);

  const size = 130 + sin(frameCount * 0.035) * 8;
  noFill();
  stroke(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 120);
  strokeWeight(1);
  rect(width / 2 - size / 2, height / 2 - size / 2, size, size);
  line(width / 2 - size, height / 2, width / 2 + size, height / 2);
  line(width / 2, height / 2 - size, width / 2, height / 2 + size);
}

function drawVideo() {
  if (!video || !video.elt || !video.elt.videoWidth) return;
  const rect = getVideoRect();

  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, rect.x, rect.y, rect.w, rect.h);
  pop();
}

function getVideoRect() {
  const sourceWidth = video?.elt?.videoWidth || 4;
  const sourceHeight = video?.elt?.videoHeight || 3;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const w = sourceWidth * scale;
  const h = sourceHeight * scale;

  return {
    x: (width - w) / 2,
    y: (height - h) / 2,
    w,
    h
  };
}

function projectLandmark(landmark) {
  const rect = getVideoRect();
  return {
    x: width - (rect.x + landmark.x * rect.w),
    y: rect.y + landmark.y * rect.h
  };
}

function detectFace() {
  if (!faceTrackerReady || !faceLandmarker || !video?.elt?.videoWidth) {
    return;
  }

  const now = performance.now();
  if (now - lastDetectionTime < 55) return;
  if (video.elt.currentTime === lastVideoTime) return;

  lastDetectionTime = now;
  lastVideoTime = video.elt.currentTime;

  try {
    const result = faceLandmarker.detectForVideo(video.elt, now);
    faceLandmarks = result.faceLandmarks?.[0] || null;
    const nextLocked = Boolean(faceLandmarks?.length);

    if (nextLocked !== faceLocked || now - lastFaceNotice > 500) {
      faceLocked = nextLocked;
      lastFaceNotice = now;
      notifyParent({
        type: "face:state",
        locked: faceLocked
      });
    }
  } catch (error) {
    console.error("Face tracking error:", error);
    faceLandmarks = null;
    notifyParent({
      type: "teachable:warning",
      message: "Face tracking paused / retrying"
    });
  }
}

function drawSignalField() {
  noStroke();
  fill(0, faceLocked ? 58 : 104);
  rect(0, 0, width, height);

  stroke(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 28);
  strokeWeight(1);
  for (let y = (frameCount * 2) % 8; y < height; y += 8) {
    line(0, y, width, y);
  }

  noFill();
  stroke(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 18);
  for (let x = 0; x < width; x += 48) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 48) {
    line(0, y, width, y);
  }
}

function drawMatrixFace(landmarks) {
  const points = landmarks.map(projectLandmark);
  const oval = FACE_OVAL.map((index) => points[index]).filter(Boolean);
  if (oval.length < 4) return;

  drawMatrixMask(oval, points);
}

function drawFallbackFaceField() {
  const centerX = width / 2;
  const centerY = height * 0.44;
  const radiusX = width * 0.18;
  const radiusY = height * 0.34;
  const oval = [];

  for (let index = 0; index < 36; index += 1) {
    const angle = (TWO_PI * index) / 36;
    oval.push({
      x: centerX + cos(angle) * radiusX,
      y: centerY + sin(angle) * radiusY
    });
  }

  drawMatrixMask(oval, null, true);
}

function drawMatrixMask(oval, meshPoints, fallback = false) {
  const facePath = new Path2D();
  facePath.moveTo(oval[0].x, oval[0].y);
  for (let index = 1; index < oval.length; index += 1) {
    facePath.lineTo(oval[index].x, oval[index].y);
  }
  facePath.closePath();

  const bounds = faceBounds(oval);
  const ctx = drawingContext;

  ctx.save();
  ctx.clip(facePath);
  ctx.fillStyle = fallback
    ? "rgba(0, 17, 5, 0.22)"
    : "rgba(0, 17, 5, 0.38)";
  ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
  drawCodeRain(ctx, bounds);
  drawFaceScanlines(ctx, bounds);
  ctx.restore();

  if (meshPoints) {
    drawFaceMesh(meshPoints);
  }
  drawFaceOutline(oval);

  const scanY = bounds.y + ((millis() * 0.08) % bounds.h);
  stroke(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 150);
  strokeWeight(1);
  line(bounds.x, scanY, bounds.x + bounds.w, scanY);

  drawTargetCorners(bounds);
}

function faceBounds(points) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  return {
    x: minX,
    y: minY,
    w: Math.max(1, maxX - minX),
    h: Math.max(1, maxY - minY)
  };
}

function drawCodeRain(ctx, bounds) {
  const glyphSize = Math.max(8, Math.round(bounds.w / 24));
  const gapX = Math.max(8, Math.round(glyphSize * 1.2));
  const gapY = Math.max(10, Math.round(glyphSize * 1.45));
  const tick = Math.floor(millis() / 85);

  ctx.save();
  ctx.font = `${glyphSize}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (let column = 0; column < Math.ceil(bounds.w / gapX); column += 1) {
    const x = bounds.x + column * gapX;
    const offset = (
      (millis() * (0.025 + (column % 5) * 0.008) + column * 53) %
      (bounds.h + gapY * 4)
    );

    for (let row = -4; row < Math.ceil(bounds.h / gapY) + 4; row += 1) {
      const y = bounds.y + row * gapY + offset;
      const glyphIndex = Math.abs(
        (column * 17 + row * 31 + tick + ((column * row) % 11)) % GLYPHS.length
      );
      const hot = (column + row + tick) % 17 === 0;
      const alpha = hot ? 235 : 90 + ((column * 13 + row * 29) % 110);

      ctx.fillStyle = hot
        ? `rgba(225, 255, 230, ${alpha / 255})`
        : `rgba(84, 255, 112, ${alpha / 255})`;
      ctx.shadowColor = "rgba(84,255,112,0.8)";
      ctx.shadowBlur = hot ? 10 : 3;
      ctx.fillText(GLYPHS[glyphIndex], x, y);
    }
  }

  ctx.restore();
}

function drawFaceScanlines(ctx, bounds) {
  ctx.save();
  ctx.strokeStyle = "rgba(120,255,150,0.28)";
  ctx.lineWidth = 1;
  const offset = (millis() * 0.07) % 7;

  for (let y = bounds.y + offset; y < bounds.y + bounds.h; y += 7) {
    ctx.beginPath();
    ctx.moveTo(bounds.x, y);
    ctx.lineTo(bounds.x + bounds.w, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawFaceMesh(points) {
  noFill();
  strokeWeight(1);

  for (let index = 0; index < points.length; index += 7) {
    const point = points[index];
    if (!point) continue;

    for (const offset of [1, 2, 7]) {
      const target = points[index + offset];
      if (!target) continue;
      const distance = dist(point.x, point.y, target.x, target.y);
      if (distance > 24) continue;
      stroke(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 35);
      line(point.x, point.y, target.x, target.y);
    }

    noStroke();
    fill(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 125);
    rect(point.x - 1, point.y - 1, 2.5, 2.5);
    noFill();
  }
}

function drawFaceOutline(points) {
  drawingContext.save();
  drawingContext.strokeStyle = "rgba(84,255,112,0.95)";
  drawingContext.lineWidth = 2;
  drawingContext.shadowColor = "rgba(84,255,112,0.9)";
  drawingContext.shadowBlur = 18;
  drawingContext.beginPath();
  drawingContext.moveTo(points[0].x, points[0].y);

  for (let index = 1; index < points.length; index += 1) {
    drawingContext.lineTo(points[index].x, points[index].y);
  }

  drawingContext.closePath();
  drawingContext.stroke();
  drawingContext.restore();
}

function drawTargetCorners(bounds) {
  const size = Math.min(22, bounds.w * 0.12);
  stroke(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 210);
  strokeWeight(2);
  line(bounds.x, bounds.y, bounds.x + size, bounds.y);
  line(bounds.x, bounds.y, bounds.x, bounds.y + size);
  line(bounds.x + bounds.w, bounds.y, bounds.x + bounds.w - size, bounds.y);
  line(bounds.x + bounds.w, bounds.y, bounds.x + bounds.w, bounds.y + size);
}

function drawSearchMode() {
  const centerX = width / 2;
  const centerY = height / 2;
  const size = 150 + sin((millis() - stateStarted) / 480) * 14;

  noFill();
  stroke(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 150);
  strokeWeight(1);
  rect(centerX - size / 2, centerY - size / 2, size, size);
  line(centerX - size, centerY, centerX + size, centerY);
  line(centerX, centerY - size, centerX, centerY + size);

  noStroke();
  fill(MATRIX_GREEN[0], MATRIX_GREEN[1], MATRIX_GREEN[2], 190);
  textAlign(CENTER, CENTER);
  textSize(10);
  text(
    faceTrackerReady ? "SEARCHING FACE" : "LOADING FACE MODEL",
    centerX,
    centerY + size / 2 + 24
  );
  textAlign(LEFT, BASELINE);
}

function drawInterface() {
  const accent = color(
    MATRIX_GREEN[0],
    MATRIX_GREEN[1],
    MATRIX_GREEN[2]
  );

  noStroke();
  fill(0, 220);
  rect(24, height - 124, 330, 96);
  stroke(accent);
  strokeWeight(1);
  noFill();
  rect(24, height - 124, 330, 96);

  noStroke();
  fill(accent);
  textSize(10);
  textAlign(LEFT, TOP);
  text("BIO-INTERFACE / MATRIX FACE FIELD", 40, height - 100);
  textSize(effectActive && faceLocked ? 30 : 24);
  text(
    effectActive
      ? faceLocked
        ? "FACE LOCKED"
        : "SCANNING"
      : `STARTING IN ${Math.max(1, Math.ceil((effectStartAt - performance.now()) / 1000))}`,
    40,
    height - 70
  );

  fill(255, 175);
  textSize(9);
  text(
    effectActive
      ? faceLocked
        ? "478 LANDMARKS / LIVE"
        : "AWAITING FACE"
      : "FACE TRACKER PRELOADING",
    40,
    height - 40
  );

  fill(255);
  textAlign(RIGHT, TOP);
  textSize(10);
  text(
    effectActive
      ? faceLocked
        ? "SIGNAL ACQUIRED"
        : "NO SIGNAL"
      : "STANDBY",
    width - 24,
    24
  );
  textSize(9);
  fill(255, 165);
  text("CAMERA / NOT RECORDED", width - 24, 42);
  textAlign(LEFT, TOP);

  drawCorner(accent);
}

function drawCorner(accent) {
  const size = 24;
  const pad = 12;

  stroke(accent);
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
