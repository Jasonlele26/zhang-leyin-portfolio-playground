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
  const i18n = window.PortfolioI18n;

  let active = false;
  let modelReady = false;
  let frameReady = false;
  let frameTimer = 0;
  let statusCopy = { en: "STANDBY", zh: "待机" };
  let messageCopy = {
    en: "Camera off. Nothing is recorded.",
    zh: "摄像头已关闭，不会录制任何内容。"
  };
  let startCopy = { en: "Start camera", zh: "启动摄像头" };
  let readoutCopy = { en: "SEARCHING", zh: "搜索中", value: 0 };

  function isChinese() {
    return i18n?.language === "zh";
  }

  function pair(english, chinese) {
    return isChinese() ? chinese : english;
  }

  function setConsoleState(value) {
    root.dataset.state = value;
  }

  function setStatus(value) {
    statusCopy = typeof value === "string"
      ? { en: value, zh: window.PortfolioI18n?.translate(value) || value }
      : value;
    if (status) status.textContent = pair(statusCopy.en, statusCopy.zh);
  }

  function setMessage(value) {
    messageCopy = typeof value === "string"
      ? { en: value, zh: window.PortfolioI18n?.translate(value) || value }
      : value;
    if (message) message.textContent = pair(messageCopy.en, messageCopy.zh);
  }

  function setStartLabel(value) {
    startCopy = typeof value === "string"
      ? { en: value, zh: window.PortfolioI18n?.translate(value) || value }
      : value;
    if (startLabel) startLabel.textContent = pair(startCopy.en, startCopy.zh);
  }

  function updateReadout(english, chinese, value) {
    readoutCopy = { en: english, zh: chinese, value };
    labelNodes.forEach((node) => {
      node.textContent = pair(english, chinese);
    });
    if (confidenceMeter) {
      const width = Math.max(0, Math.min(1, value)) * 100;
      confidenceMeter.style.width = `${width}%`;
    }
  }

  function refreshLanguage() {
    if (status) status.textContent = pair(statusCopy.en, statusCopy.zh);
    if (message) message.textContent = pair(messageCopy.en, messageCopy.zh);
    if (startLabel) startLabel.textContent = pair(startCopy.en, startCopy.zh);
    labelNodes.forEach((node) => {
      node.textContent = pair(readoutCopy.en, readoutCopy.zh);
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
    setStatus({ en: "CONNECTING", zh: "连接中" });
    setMessage({
      en: "Initializing Matrix face tracker",
      zh: "正在初始化 Matrix 人脸追踪"
    });
    setStartLabel({ en: "Camera active", zh: "摄像头已启动" });
    stopButton.hidden = false;
    updateReadout("SEARCHING", "搜索中", 0);

    window.clearTimeout(frameTimer);
    frameTimer = window.setTimeout(() => {
      if (!active || modelReady) return;
      setMessage(
        frameReady
          ? {
              en: "Waiting for camera permission or model download",
              zh: "正在等待摄像头权限或模型下载"
            }
          : {
              en: "Loading interactive modules",
              zh: "正在加载互动模块"
            }
      );
    }, 12000);

    frame.onload = () => {
      if (!active) return;
      setConsoleState("active");
      setStatus({ en: "LOADING", zh: "加载中" });
      setMessage({
        en: "Camera connecting / model loading",
        zh: "摄像头连接中 / 模型加载中"
      });
    };

    frame.src = `${frameUrl}?run=${Date.now()}&lang=${i18n?.language || "en"}`;
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
    setStatus({ en: "STANDBY", zh: "待机" });
    setMessage({
      en: "Camera off. Nothing is recorded.",
      zh: "摄像头已关闭，不会录制任何内容。"
    });
    setStartLabel({ en: "Start camera", zh: "启动摄像头" });
    startButton.disabled = false;
    stopButton.hidden = true;
    updateReadout("SEARCHING", "搜索中", 0);
  }

  function showError(text) {
    active = false;
    modelReady = false;
    frameReady = false;
    window.clearTimeout(frameTimer);
    frame.hidden = true;
    frame.src = "about:blank";
    setConsoleState("error");
    setStatus({ en: "UNAVAILABLE", zh: "无法启动" });
    setMessage(
      text
        ? { en: text, zh: "摄像头或模型暂时无法启动，请重试。" }
        : {
            en: "Camera or model could not start.",
            zh: "摄像头或模型无法启动。"
          }
    );
    setStartLabel({ en: "Try again", zh: "重试" });
    startButton.disabled = false;
    stopButton.hidden = true;
    updateReadout("SEARCHING", "搜索中", 0);
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || !active) return;
    const data = event.data || {};

    if (data.type === "teachable:frame-ready") {
      frameReady = true;
      setStatus({ en: "CONNECTING", zh: "连接中" });
      setMessage({
        en: "Requesting camera and loading model",
        zh: "正在请求摄像头并加载模型"
      });
    }

    if (data.type === "teachable:model-ready") {
      modelReady = true;
      window.clearTimeout(frameTimer);
      setStatus({ en: "SCANNING", zh: "扫描中" });
      setMessage({
        en: "FACE MODEL READY / STARTING BIOMETRIC SCAN",
        zh: "人脸模型已就绪 / 开始生物扫描"
      });
    }

    if (data.type === "scan:state") {
      const progress = Number(data.progress) || 0;
      updateReadout(
        `SCANNING ${Math.round(progress * 100)}%`,
        `扫描 ${Math.round(progress * 100)}%`,
        progress
      );
      setStatus({ en: "SCANNING", zh: "扫描中" });
      setMessage(
        data.face
          ? {
              en: "FACE DETECTED / MAPPING GEOMETRY",
              zh: "检测到人脸 / 正在映射几何"
            }
          : {
              en: "SEARCHING FACE / PRELOADING MODEL",
              zh: "正在搜索人脸 / 预加载模型"
            }
      );
    }

    if (data.type === "scan:result") {
      updateReadout(
        data.locked ? "FACE LOCKED" : "FACE SIMULATED",
        data.locked ? "人脸已锁定" : "模拟人脸",
        1
      );
      setStatus({ en: "RESULT READY", zh: "结果已生成" });
      setMessage({
        en: "MATRIX BIO-INTERFACE ACTIVE / NOT RECORDED",
        zh: "MATRIX 生物界面已激活 / 不录制"
      });
    }

    if (data.type === "face:state") {
      const locked = Boolean(data.locked);
      updateReadout(
        locked ? "FACE LOCKED" : "SEARCHING",
        locked ? "人脸已锁定" : "搜索中",
        locked ? 1 : 0
      );
      setStatus(
        locked
          ? { en: "FACE LOCKED", zh: "人脸已锁定" }
          : { en: "SCANNING", zh: "扫描中" }
      );
      setMessage(
        locked
          ? {
              en: "MATRIX BIO-INTERFACE ACTIVE / NOT RECORDED",
              zh: "MATRIX 生物界面已激活 / 不录制"
            }
          : {
              en: "SEARCHING FOR FACE",
              zh: "正在搜索人脸"
            }
      );
    }

    if (data.type === "teachable:error") {
      showError(data.message);
    }

    if (data.type === "teachable:warning") {
      setStatus({ en: "CAMERA LIVE", zh: "摄像头运行中" });
      setMessage({
        en: "Camera live / loading face tracking model",
        zh: "摄像头运行中 / 正在加载人脸追踪模型"
      });
    }
  });

  window.addEventListener("portfolio:language-changed", (event) => {
    refreshLanguage();
    if (active) {
      frame.contentWindow?.postMessage(
        {
          type: "language:set",
          language: event.detail?.language || i18n?.language || "en"
        },
        window.location.origin
      );
    }
  });

  startButton?.addEventListener("click", start);
  stopButton?.addEventListener("click", stop);

  window.addEventListener("pagehide", stop);
})();
