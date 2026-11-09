(() => {
  const root = document.querySelector("[data-teachable-console]");
  if (!root) return;

  const frame = root.querySelector("[data-teachable-frame]");
  const startButton = root.querySelector("[data-teachable-start]");
  const startLabel = startButton?.querySelector("span");
  const stopButton = root.querySelector("[data-teachable-stop]");
  const message = root.querySelector("[data-teachable-message]");
  const status = root.querySelector("[data-teachable-status]");
  const confidenceMeter = root.querySelector("[data-teachable-meter]");
  const labelNodes = root.querySelectorAll("[data-teachable-label]");
  const frameUrl = "playground-frame.html";

  let active = false;
  let modelReady = false;
  let frameReady = false;
  let frameTimer = 0;

  function setConsoleState(value) {
    root.dataset.state = value;
  }

  function setStatus(value) {
    if (status) status.textContent = value;
  }

  function setMessage(value) {
    if (message) message.textContent = value;
  }

  function setStartLabel(value) {
    if (startLabel) startLabel.textContent = value;
  }

  function updateReadout(label, value) {
    labelNodes.forEach((node) => {
      node.textContent = label;
    });
    if (confidenceMeter) {
      const width = Math.max(0, Math.min(1, value)) * 100;
      confidenceMeter.style.width = `${width}%`;
    }
  }

  function start() {
    if (active || document.body.classList.contains("editor-mode")) return;

    active = true;
    modelReady = false;
    frameReady = false;
    startButton.disabled = true;
    frame.hidden = false;
    setConsoleState("loading");
    setStatus("CONNECTING");
    setMessage("Initializing Matrix face tracker");
    setStartLabel("Camera active");
    stopButton.hidden = false;
    updateReadout("SEARCHING", 0);

    window.clearTimeout(frameTimer);
    frameTimer = window.setTimeout(() => {
      if (!active || modelReady) return;
      setMessage(
        frameReady
          ? "Waiting for camera permission or model download"
          : "Loading interactive modules"
      );
    }, 12000);

    frame.onload = () => {
      if (!active) return;
      setConsoleState("active");
      setStatus("LOADING");
      setMessage("Camera connecting / model loading");
    };

    frame.src = `${frameUrl}?run=${Date.now()}`;
  }

  function stop() {
    if (!active) return;

    active = false;
    modelReady = false;
    frameReady = false;
    window.clearTimeout(frameTimer);
    frame.onload = null;
    frame.hidden = true;
    frame.src = "about:blank";
    setConsoleState("idle");
    setStatus("STANDBY");
    setMessage("Camera off. Nothing is recorded.");
    setStartLabel("Start camera");
    startButton.disabled = false;
    stopButton.hidden = true;
    updateReadout("SEARCHING", 0);
  }

  function showError(text) {
    active = false;
    modelReady = false;
    frameReady = false;
    window.clearTimeout(frameTimer);
    frame.hidden = true;
    frame.src = "about:blank";
    setConsoleState("error");
    setStatus("UNAVAILABLE");
    setMessage(text || "Camera or model could not start.");
    setStartLabel("Try again");
    startButton.disabled = false;
    stopButton.hidden = true;
    updateReadout("SEARCHING", 0);
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || !active) return;
    const data = event.data || {};

    if (data.type === "teachable:frame-ready") {
      frameReady = true;
      setStatus("CONNECTING");
      setMessage("Requesting camera and loading model");
    }

    if (data.type === "teachable:model-ready") {
      modelReady = true;
      window.clearTimeout(frameTimer);
      setStatus("SCANNING");
      setMessage("FACE MODEL READY / STARTING BIOMETRIC SCAN");
    }

    if (data.type === "scan:state") {
      const progress = Number(data.progress) || 0;
      updateReadout(`SCANNING ${Math.round(progress * 100)}%`, progress);
      setStatus("SCANNING");
      setMessage(
        data.face
          ? "FACE DETECTED / MAPPING GEOMETRY"
          : "SEARCHING FACE / PRELOADING MODEL"
      );
    }

    if (data.type === "scan:result") {
      updateReadout(data.locked ? "FACE LOCKED" : "FACE SIMULATED", 1);
      setStatus("RESULT READY");
      setMessage("MATRIX BIO-INTERFACE ACTIVE / NOT RECORDED");
    }

    if (data.type === "face:state") {
      const locked = Boolean(data.locked);
      updateReadout(locked ? "FACE LOCKED" : "SEARCHING", locked ? 1 : 0);
      setStatus(locked ? "FACE LOCKED" : "SCANNING");
      setMessage(
        locked
          ? "MATRIX BIO-INTERFACE ACTIVE / NOT RECORDED"
          : "SEARCHING FOR FACE"
      );
    }

    if (data.type === "teachable:error") {
      showError(data.message);
    }

    if (data.type === "teachable:warning") {
      setStatus("CAMERA LIVE");
      setMessage(data.message || "Recognition paused / retrying");
    }
  });

  startButton?.addEventListener("click", start);
  stopButton?.addEventListener("click", stop);

  window.addEventListener("pagehide", stop);
})();
