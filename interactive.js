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
  const testButtons = [...root.querySelectorAll("[data-teachable-test]")];
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

  function setActiveState(state) {
    testButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.teachableTest === state
      );
    });
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
    setMessage("Loading the original p5 visual system");
    setStartLabel("Camera active");
    stopButton.hidden = false;
    updateReadout("NEUTRAL", 0);
    setActiveState("neutral");

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
    updateReadout("NEUTRAL", 0);
    setActiveState("");
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
    updateReadout("NEUTRAL", 0);
    setActiveState("");
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
      setStatus("LIVE");
      setMessage("LIVE CLASSIFICATION / NOT RECORDED");
    }

    if (data.type === "teachable:state") {
      const state = data.state || "neutral";
      const label = data.label || state.toUpperCase();
      const confidence = Number(data.confidence) || 0;
      updateReadout(label, confidence);
      setActiveState(state);
      setStatus("LIVE");
    }

    if (data.type === "teachable:error") {
      showError(data.message);
    }

    if (data.type === "teachable:warning") {
      setMessage(data.message || "Recognition paused / retrying");
    }
  });

  startButton?.addEventListener("click", start);
  stopButton?.addEventListener("click", stop);

  testButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!active || !modelReady) return;
      frame.contentWindow?.postMessage(
        {
          type: "teachable:set-state",
          state: button.dataset.teachableTest
        },
        window.location.origin
      );
    });
  });

  window.addEventListener("pagehide", stop);
})();
