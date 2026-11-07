(() => {
  const STORAGE_KEY = "zhang-leyin-portfolio-editor-v2";
  const IMAGE_DB = "zhang-leyin-portfolio-images-v2";
  const IMAGE_STORE = "overrides";
  const embeddedState = window.__PORTFOLIO_SAVED_EDITS__ || null;
  const editRequested = new URLSearchParams(window.location.search).get("edit") === "1";

  const textSelector = [
    ".brand-word",
    ".header-cta span",
    ".header-meta",
    ".desktop-nav a",
    ".hero-art-top span",
    ".hero-art-bottom span",
    ".micro-label",
    ".hero h1 span",
    ".hero-panel-top > span > span",
    ".hero-panel-top > span:last-child",
    ".panel-kicker",
    ".hero-statement",
    ".button span",
    ".panel-link span",
    ".hero-data dt",
    ".hero-data dd",
    ".ticker-track span",
    ".section-rail span",
    ".section-code",
    ".section-heading h2",
    ".section-lead",
    ".project-index",
    ".project-type",
    ".project-open span",
    ".project-kicker span",
    ".project-summary h3",
    ".project-summary p",
    ".writers-copy h2",
    ".writers-language",
    ".writers-deck",
    ".writers-details p",
    ".writers-status",
    ".writers-visual figcaption span",
    ".writers-screens-note",
    ".frame-label span",
    ".portrait-frame figcaption span",
    ".about-copy h2",
    ".about-body p",
    ".about-facts dt",
    ".about-facts dd",
    ".playground-heading h2",
    ".teachable-cover-copy h3",
    ".teachable-start span",
    ".illustration-meta span",
    ".quote-label span",
    ".quote-inner blockquote",
    ".quote-author",
    ".quote-inner cite",
    ".contact-title-block .section-code",
    ".contact-grid h2",
    ".contact-side > p",
    ".footer-brand strong",
    ".footer-brand p",
    ".footer-links a",
    ".footer-note",
    ".modal-hero-copy > span",
    ".modal-hero h2",
    ".modal-hero p",
    ".modal-meta dt",
    ".modal-meta dd",
    ".project-intro h3",
    ".project-intro > p",
    ".case-text h3",
    ".case-text p",
    ".case-text li",
    ".case-gallery h3",
    ".credits-box summary",
    ".credits-list li",
    ".reflection-copy"
  ].join(",");

  const projects = [
    ["uncivilized", "Uncivilized"],
    ["playtime", "Play Time"],
    ["showman", "Death of the Showman"],
    ["diehard", "Die Hard"]
  ];

  let state = {
    texts: {},
    styles: {}
  };
  let imageOverrides = embeddedState?.images || {};
  let editMode = false;
  let selected = null;
  let dbPromise = null;
  let saveTimer = null;
  let editorRoot = null;
  let statusNode = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadLocalState() {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      stored = null;
    }

    const base = embeddedState
      ? {
          texts: clone(embeddedState.texts || {}),
          styles: clone(embeddedState.styles || {})
        }
      : { texts: {}, styles: {} };

    return {
      texts: { ...base.texts, ...(stored?.texts || {}) },
      styles: { ...base.styles, ...(stored?.styles || {}) }
    };
  }

  function persistState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          texts: state.texts,
          styles: state.styles,
          updatedAt: new Date().toISOString()
        })
      );
      setStatus("Saved locally");
    } catch {
      setStatus("Session only");
    }
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persistState, 180);
  }

  function openImageDb() {
    if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(IMAGE_DB, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IMAGE_STORE)) {
          db.createObjectStore(IMAGE_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return dbPromise;
  }

  async function loadStoredImages() {
    let stored = {};
    try {
      const db = await openImageDb();
      const transaction = db.transaction(IMAGE_STORE, "readonly");
      const store = transaction.objectStore(IMAGE_STORE);
      const keysRequest = store.getAllKeys();
      const valuesRequest = store.getAll();

      const [keys, values] = await Promise.all([
        new Promise((resolve, reject) => {
          keysRequest.onsuccess = () => resolve(keysRequest.result);
          keysRequest.onerror = () => reject(keysRequest.error);
        }),
        new Promise((resolve, reject) => {
          valuesRequest.onsuccess = () => resolve(valuesRequest.result);
          valuesRequest.onerror = () => reject(valuesRequest.error);
        })
      ]);

      stored = Object.fromEntries(
        keys.map((key, index) => [String(key), values[index]])
      );
    } catch {
      try {
        stored = JSON.parse(
          localStorage.getItem(`${STORAGE_KEY}-images`) || "{}"
        );
      } catch {
        stored = {};
      }
    }
    imageOverrides = {
      ...(embeddedState?.images || {}),
      ...stored
    };
  }

  async function saveImageOverride(id, dataUrl) {
    imageOverrides[id] = dataUrl;
    try {
      const db = await openImageDb();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(IMAGE_STORE, "readwrite");
        transaction.objectStore(IMAGE_STORE).put(dataUrl, id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch {
      const fallback = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-images`) || "{}");
      fallback[id] = dataUrl;
      try {
        localStorage.setItem(`${STORAGE_KEY}-images`, JSON.stringify(fallback));
      } catch {
        setStatus("Image held for this session");
      }
    }
  }

  async function removeImageOverride(id) {
    delete imageOverrides[id];
    try {
      const fallback = JSON.parse(
        localStorage.getItem(`${STORAGE_KEY}-images`) || "{}"
      );
      delete fallback[id];
      localStorage.setItem(`${STORAGE_KEY}-images`, JSON.stringify(fallback));
    } catch {
      // A fallback copy may not exist.
    }
    try {
      const db = await openImageDb();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(IMAGE_STORE, "readwrite");
        transaction.objectStore(IMAGE_STORE).delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch {
      // The in-memory reset still applies for this session.
    }
  }

  async function clearStoredImages() {
    imageOverrides = {};
    try {
      localStorage.removeItem(`${STORAGE_KEY}-images`);
    } catch {
      // No local fallback to clear.
    }
    try {
      const db = await openImageDb();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(IMAGE_STORE, "readwrite");
        transaction.objectStore(IMAGE_STORE).clear();
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch {
      // Nothing else to clear.
    }
  }

  function applySavedStyle(element, id) {
    const style = state.styles[id];
    if (!style) return;
    Object.entries(style).forEach(([property, value]) => {
      if (value) element.style[property] = value;
    });
  }

  function registerText(root, namespace) {
    const nodes = [...root.querySelectorAll(textSelector)].filter((element) => {
      if (element.closest("#portfolio-editor-root")) return false;
      if (element.classList.contains("sr-only")) return false;
      if (!element.textContent.trim()) return false;
      return true;
    });

    nodes.forEach((element, index) => {
      if (!element.dataset.editText) {
        element.dataset.editText = `${namespace}:text:${index}`;
        element.dataset.editorOriginalStyle = element.getAttribute("style") || "";
      }

      const id = element.dataset.editText;
      if (Object.prototype.hasOwnProperty.call(state.texts, id)) {
        element.textContent = state.texts[id];
      }
      applySavedStyle(element, id);

      if (editMode) {
        enableTextElement(element);
      }
    });
  }

  function registerImages(root, namespace) {
    const nodes = [...root.querySelectorAll("img")].filter(
      (image) => !image.closest("#portfolio-editor-root")
    );

    nodes.forEach((image, index) => {
      if (!image.dataset.editImage) {
        image.dataset.editImage = `${namespace}:image:${index}`;
        image.dataset.editorOriginalSrc = image.getAttribute("src") || "";
      }

      const override = imageOverrides[image.dataset.editImage];
      if (override) image.src = override;
    });
  }

  function registerContent(root, namespace) {
    if (!root) return;
    registerText(root, namespace);
    registerImages(root, namespace);
  }

  function applyImageOverrides() {
    document.querySelectorAll("img[data-edit-image]").forEach((image) => {
      const override = imageOverrides[image.dataset.editImage];
      if (override) image.src = override;
    });
  }

  function enableTextElement(element) {
    element.setAttribute("contenteditable", "plaintext-only");
    element.setAttribute("spellcheck", "false");
  }

  function disableTextElements() {
    document.querySelectorAll("[data-edit-text]").forEach((element) => {
      element.removeAttribute("contenteditable");
      element.removeAttribute("spellcheck");
      element.classList.remove("editor-selected");
    });
  }

  function setStatus(message) {
    if (statusNode) statusNode.textContent = message;
  }

  function selectText(element) {
    clearSelection();
    selected = {
      kind: "text",
      element,
      id: element.dataset.editText
    };
    element.classList.add("editor-selected");
    element.focus({ preventScroll: true });

    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    showTextInspector(element);
    activateTab("selection");
  }

  function selectImage(image) {
    clearSelection();
    selected = {
      kind: "image",
      element: image,
      id: image.dataset.editImage
    };
    image.classList.add("editor-selected-image");
    showImageInspector(image);
    activateTab("images");
    updateImageList();
  }

  function clearSelection() {
    document
      .querySelectorAll(".editor-selected, .editor-selected-image")
      .forEach((element) => {
        element.classList.remove("editor-selected", "editor-selected-image");
      });
    selected = null;
  }

  function colorToHex(color) {
    if (!color) return "#ffffff";
    if (color.startsWith("#")) return color;
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return "#ffffff";
    return `#${[match[1], match[2], match[3]]
      .map((part) => Number(part).toString(16).padStart(2, "0"))
      .join("")}`;
  }

  function detectFontFamily(value) {
    if (value.includes("Archivo")) return "display";
    if (value.includes("IBM Plex")) return "mono";
    if (value.includes("Georgia")) return "serif";
    if (value.includes("Arial")) return "system";
    return "body";
  }

  function showTextInspector(element) {
    const textPanel = document.querySelector("#editor-text-controls");
    const imagePanel = document.querySelector("#editor-image-controls");
    const imageEmpty = document.querySelector("#editor-image-empty");
    const empty = document.querySelector("#editor-empty");
    const typeLabel = document.querySelector("#editor-selection-type");
    if (!textPanel || !imagePanel || !empty) return;

    empty.hidden = true;
    if (imageEmpty) imageEmpty.hidden = true;
    textPanel.hidden = false;
    imagePanel.hidden = true;
    typeLabel.textContent = `TEXT / ${element.tagName}`;

    const computed = getComputedStyle(element);
    const fontSize = Number.parseFloat(computed.fontSize);
    const lineHeight = Number.parseFloat(computed.lineHeight);
    document.querySelector("#editor-text-value").value = element.textContent;
    document.querySelector("#editor-font-family").value = detectFontFamily(
      computed.fontFamily
    );
    document.querySelector("#editor-font-size").value = Math.round(
      fontSize
    );
    document.querySelector("#editor-font-weight").value = String(
      Math.round(Number(computed.fontWeight) / 100) * 100
    );
    document.querySelector("#editor-line-height").value =
      Number.isFinite(lineHeight) ? Math.round((lineHeight / fontSize) * 100) / 100 : 1.2;
    document.querySelector("#editor-text-color").value = colorToHex(computed.color);
  }

  function showImageInspector(image) {
    const textPanel = document.querySelector("#editor-text-controls");
    const imagePanel = document.querySelector("#editor-image-controls");
    const imageEmpty = document.querySelector("#editor-image-empty");
    const empty = document.querySelector("#editor-empty");
    const typeLabel = document.querySelector("#editor-selection-type");
    if (!imagePanel || !textPanel || !empty) return;

    empty.hidden = true;
    if (imageEmpty) imageEmpty.hidden = true;
    textPanel.hidden = true;
    imagePanel.hidden = false;
    typeLabel.textContent = "IMAGE";
    document.querySelector("#editor-image-preview").src = image.currentSrc || image.src;
    document.querySelector("#editor-image-label").textContent = imageLabel(image);
  }

  function imageLabel(image) {
    if (image.alt && image.alt.trim()) return image.alt.trim();
    const projectTitle =
      image.closest(".project-card")?.querySelector("h3")?.textContent ||
      image.closest(".project-modal-panel")?.querySelector("#project-modal-title")?.textContent;
    const sectionTitle = image
      .closest("section")
      ?.querySelector("h2, h3")
      ?.textContent?.trim();
    const originalSrc =
      image.dataset.editorOriginalSrc || image.getAttribute("src") || "image";
    const filename = originalSrc.split("/").pop()?.split("?")[0] || "image";
    return [projectTitle || sectionTitle || "Image", filename]
      .filter(Boolean)
      .join(" / ");
  }

  function applyTypography() {
    if (!selected || selected.kind !== "text") return;
    const familyMap = {
      display: '"Archivo Black", Impact, sans-serif',
      body: '"Barlow", "Segoe UI", sans-serif',
      mono: '"IBM Plex Mono", monospace',
      system: 'Arial, sans-serif',
      serif: 'Georgia, serif'
    };
    const style = {
      fontFamily: familyMap[document.querySelector("#editor-font-family").value],
      fontSize: `${document.querySelector("#editor-font-size").value}px`,
      fontWeight: document.querySelector("#editor-font-weight").value,
      lineHeight: document.querySelector("#editor-line-height").value,
      color: document.querySelector("#editor-text-color").value
    };

    Object.entries(style).forEach(([property, value]) => {
      selected.element.style[property] = value;
    });
    state.styles[selected.id] = style;
    scheduleSave();
  }

  function updateTextValue(element, value, writeDom = true) {
    state.texts[element.dataset.editText] = value;
    if (writeDom) element.textContent = value;

    const savedStyle = state.styles[element.dataset.editText];
    if (value.includes("\n")) {
      element.style.whiteSpace = "pre-wrap";
      state.styles[element.dataset.editText] = {
        ...(savedStyle || {}),
        whiteSpace: "pre-wrap"
      };
    } else if (savedStyle?.whiteSpace === "pre-wrap") {
      element.style.whiteSpace = "";
      delete savedStyle.whiteSpace;
      if (Object.keys(savedStyle).length === 0) {
        delete state.styles[element.dataset.editText];
      }
    }
  }

  function resetSelectedStyle() {
    if (!selected || selected.kind !== "text") return;
    selected.element.setAttribute(
      "style",
      selected.element.dataset.editorOriginalStyle || ""
    );
    delete state.styles[selected.id];
    scheduleSave();
    showTextInspector(selected.element);
  }

  function resetSelectedImage() {
    if (!selected || selected.kind !== "image") return;
    const original = selected.element.dataset.editorOriginalSrc;
    if (original) selected.element.src = original;
    removeImageOverride(selected.id);
    showImageInspector(selected.element);
    updateImageList();
    setStatus("Original image restored");
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function decodeImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Unsupported image"));
      image.src = dataUrl;
    });
  }

  async function prepareImage(file) {
    const dataUrl = await readFileAsDataUrl(file);
    if (!file.type.startsWith("image/")) {
      throw new Error("Not an image");
    }

    const image = await decodeImage(dataUrl);
    const maxDimension = 2600;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));

    if (scale === 1 && file.size < 1800000) {
      return dataUrl;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.9);
  }

  async function replaceSelectedImage(file) {
    if (!selected || selected.kind !== "image" || !file) return;
    setStatus("Preparing image...");
    try {
      const prepared = await prepareImage(file);
      selected.element.src = prepared;
      await saveImageOverride(selected.id, prepared);
      showImageInspector(selected.element);
      updateImageList();
      setStatus("Image replaced");
    } catch {
      setStatus("Could not load that image");
    }
  }

  function activateTab(name) {
    if (!editorRoot) return;
    editorRoot.querySelectorAll("[data-editor-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.editorTab === name);
    });
    editorRoot.querySelectorAll("[data-editor-pane]").forEach((pane) => {
      pane.hidden = pane.dataset.editorPane !== name;
    });

    if (name === "images") {
      updateImageList();
      const imageControls = document.querySelector("#editor-image-controls");
      const imageEmpty = document.querySelector("#editor-image-empty");
      const hasImage = selected?.kind === "image";
      if (imageControls) imageControls.hidden = !hasImage;
      if (imageEmpty) imageEmpty.hidden = hasImage;
    }
  }

  function updateImageList() {
    const list = document.querySelector("#editor-image-list");
    if (!list) return;
    list.replaceChildren();
    const images = [...document.querySelectorAll("img[data-edit-image]")].filter(
      (image) => !image.closest("#portfolio-editor-root")
    );

    images.forEach((image) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "editor-image-item";
      button.dataset.imageId = image.dataset.editImage;

      const thumb = document.createElement("img");
      thumb.src = image.currentSrc || image.src;
      thumb.alt = "";

      const label = document.createElement("span");
      label.textContent = imageLabel(image);

      button.append(thumb, label);
      button.addEventListener("click", () => {
        selectImage(image);
        image.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      list.append(button);
    });
    const count = document.querySelector("#editor-image-count");
    if (count) count.textContent = String(images.length).padStart(2, "0");
  }

  function createEditor() {
    editorRoot = document.createElement("aside");
    editorRoot.id = "portfolio-editor-root";
    editorRoot.setAttribute("aria-label", "Portfolio editor");
    editorRoot.innerHTML = `
      <header class="editor-header">
        <div>
          <span class="editor-title">Portfolio editor</span>
          <span class="editor-mode-label"><i></i>Live edit</span>
        </div>
        <button class="editor-close" type="button" aria-label="Close editor">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 5 14 14M19 5 5 19"/></svg>
        </button>
      </header>
      <nav class="editor-tabs" aria-label="Editor sections">
        <button type="button" data-editor-tab="selection" class="is-active">Text</button>
        <button type="button" data-editor-tab="images">Images</button>
        <button type="button" data-editor-tab="files">Save</button>
      </nav>
      <div class="editor-scroll">
        <section class="editor-pane" data-editor-pane="selection">
          <div class="editor-pane-heading">
            <span>Selection</span>
            <span id="editor-selection-type">NONE</span>
          </div>
          <p class="editor-help" id="editor-empty">Select text or an image in the page.</p>

          <div class="editor-controls" id="editor-text-controls" hidden>
            <label class="editor-field">
              <span>Text</span>
              <textarea id="editor-text-value" rows="5"></textarea>
            </label>
            <label class="editor-field">
              <span>Font family</span>
              <select id="editor-font-family">
                <option value="display">Archivo Black / Display</option>
                <option value="body">Barlow / Body</option>
                <option value="mono">IBM Plex Mono / Technical</option>
                <option value="system">Arial / System</option>
                <option value="serif">Georgia / Serif</option>
              </select>
            </label>
            <div class="editor-field-row">
              <label class="editor-field">
                <span>Size / px</span>
                <input id="editor-font-size" type="number" min="7" max="240" step="1">
              </label>
              <label class="editor-field">
                <span>Weight</span>
                <select id="editor-font-weight">
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                </select>
              </label>
            </div>
            <div class="editor-field-row">
              <label class="editor-field">
                <span>Line height</span>
                <input id="editor-line-height" type="number" min="0.7" max="2.4" step="0.05">
              </label>
              <label class="editor-field">
                <span>Color</span>
                <input id="editor-text-color" type="color">
              </label>
            </div>
            <button class="editor-action subtle" type="button" id="editor-reset-style">
              Reset selected style
            </button>
          </div>

          <div class="editor-case-studies">
            <div class="editor-pane-heading">
              <span>Case studies</span>
              <span>04</span>
            </div>
            <div class="editor-project-grid">
              ${projects
                .map(
                  ([id, title]) =>
                    `<button type="button" data-open-project="${id}"><span>${title}</span><b>+</b></button>`
                )
                .join("")}
            </div>
          </div>
        </section>

        <section class="editor-pane" data-editor-pane="images" hidden>
          <div class="editor-pane-heading">
            <span>Page images</span>
            <span id="editor-image-count"></span>
          </div>
          <div class="editor-controls" id="editor-image-controls" hidden>
            <div class="editor-image-preview" id="editor-image-dropzone">
              <img id="editor-image-preview" alt="">
              <span>Drop image here</span>
            </div>
            <p class="editor-image-label" id="editor-image-label"></p>
            <label class="editor-action primary" for="editor-image-input">
              Upload replacement image
            </label>
            <button class="editor-action subtle" type="button" id="editor-reset-image">
              Restore original
            </button>
          </div>
          <p class="editor-help" id="editor-image-empty">
            Select an image in the page or from the list below.
          </p>
          <div class="editor-image-list" id="editor-image-list"></div>
        </section>

        <section class="editor-pane" data-editor-pane="files" hidden>
          <div class="editor-pane-heading">
            <span>Output</span>
            <span>LOCAL</span>
          </div>
          <p class="editor-note">
            Text, typography and images are saved in this browser. Export a copy before
            switching devices or clearing browser data.
          </p>
          <div class="editor-stack">
            <button class="editor-action primary" type="button" id="editor-save-html">
              Save edited HTML
            </button>
            <button class="editor-action" type="button" id="editor-export-json">
              Export edits
            </button>
            <button class="editor-action" type="button" id="editor-import-json">
              Import edits
            </button>
            <button class="editor-action danger" type="button" id="editor-reset-all">
              Reset all edits
            </button>
          </div>
          <input id="editor-import-input" type="file" accept="application/json,.json" hidden>
        </section>
      </div>
      <footer class="editor-footer">
        <span class="editor-status" id="editor-status">Ready</span>
        <button type="button" class="editor-exit">Exit edit mode</button>
      </footer>
      <input id="editor-image-input" type="file" accept="image/*" hidden>
    `;

    document.body.append(editorRoot);
    statusNode = editorRoot.querySelector("#editor-status");

    editorRoot.querySelector(".editor-close").addEventListener("click", closeEditor);
    editorRoot.querySelector(".editor-exit").addEventListener("click", closeEditor);
    editorRoot.querySelectorAll("[data-editor-tab]").forEach((button) => {
      button.addEventListener("click", () => activateTab(button.dataset.editorTab));
    });

    document
      .querySelector("#editor-text-value")
      .addEventListener("input", (event) => {
        if (!selected || selected.kind !== "text") return;
        updateTextValue(selected.element, event.target.value);
        scheduleSave();
      });

    [
      "#editor-font-family",
      "#editor-font-size",
      "#editor-font-weight",
      "#editor-line-height",
      "#editor-text-color"
    ].forEach((selector) => {
      document.querySelector(selector).addEventListener("input", applyTypography);
      document.querySelector(selector).addEventListener("change", applyTypography);
    });

    document
      .querySelector("#editor-reset-style")
      .addEventListener("click", resetSelectedStyle);
    document
      .querySelector("#editor-reset-image")
      .addEventListener("click", resetSelectedImage);

    const imageInput = document.querySelector("#editor-image-input");
    imageInput.addEventListener("change", async () => {
      await replaceSelectedImage(imageInput.files?.[0]);
      imageInput.value = "";
    });

    const dropzone = document.querySelector("#editor-image-dropzone");
    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragging");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("is-dragging");
    });
    dropzone.addEventListener("drop", async (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragging");
      await replaceSelectedImage(event.dataTransfer?.files?.[0]);
    });

    editorRoot.querySelectorAll("[data-open-project]").forEach((button) => {
      button.addEventListener("click", () => {
        if (typeof window.openPortfolioProject === "function") {
          window.openPortfolioProject(button.dataset.openProject);
        }
      });
    });

    document
      .querySelector("#editor-save-html")
      .addEventListener("click", saveEditedHtml);
    document
      .querySelector("#editor-export-json")
      .addEventListener("click", exportEdits);
    document
      .querySelector("#editor-import-json")
      .addEventListener("click", () =>
        document.querySelector("#editor-import-input").click()
      );
    document
      .querySelector("#editor-import-input")
      .addEventListener("change", importEdits);
    document
      .querySelector("#editor-reset-all")
      .addEventListener("click", resetAllEdits);
  }

  function openEditor() {
    if (editMode) return;
    editMode = true;
    document.body.classList.add("editor-mode");
    document.documentElement.classList.add("editor-desktop");
    if (!editorRoot) createEditor();
    registerContent(document.body, "page");
    document.querySelectorAll("[data-edit-text]").forEach(enableTextElement);
    updateImageList();
    activateTab("selection");
    setStatus("Select text or an image");
  }

  function closeEditor() {
    editMode = false;
    document.body.classList.remove("editor-mode");
    document.documentElement.classList.remove("editor-desktop");
    disableTextElements();
    clearSelection();
    editorRoot?.remove();
    editorRoot = null;
    statusNode = null;

    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    try {
      history.replaceState(null, "", url);
    } catch {
      // The editor can still be closed if the URL cannot be rewritten.
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function buildSavedHtml() {
    const clone = document.documentElement.cloneNode(true);
    clone.classList.remove("editor-desktop");
    clone.querySelectorAll("#portfolio-editor-root").forEach((element) => element.remove());
    clone.querySelectorAll("#portfolio-saved-edits").forEach((element) => element.remove());
    clone.querySelectorAll("base").forEach((element) => element.remove());
    clone
      .querySelectorAll(".editor-selected, .editor-selected-image")
      .forEach((element) => {
        element.classList.remove("editor-selected", "editor-selected-image");
      });
    clone.querySelectorAll("[contenteditable]").forEach((element) => {
      element.removeAttribute("contenteditable");
      element.removeAttribute("spellcheck");
    });
    clone.querySelector("body")?.classList.remove("editor-mode", "modal-open", "menu-open");
    clone.querySelector("#project-modal")?.classList.remove("is-open");
    clone.querySelector("#project-modal")?.setAttribute("aria-hidden", "true");

    const savedPayload = JSON.stringify({
      texts: state.texts,
      styles: state.styles,
      images: imageOverrides
    }).replace(/</g, "\\u003c");
    const script = document.createElement("script");
    script.id = "portfolio-saved-edits";
    script.textContent = `window.__PORTFOLIO_SAVED_EDITS__ = ${savedPayload};`;
    const base = document.createElement("base");
    base.href = new URL(".", window.location.href).href;
    clone.querySelector("head")?.prepend(base);
    clone.querySelector("head")?.append(script);

    return `<!doctype html>\n${clone.outerHTML}`;
  }

  async function saveEditedHtml() {
    const html = buildSavedHtml();
    const blob = new Blob([html], { type: "text/html" });
    setStatus("Preparing HTML...");

    if ("showSaveFilePicker" in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "index-edited.html",
          types: [
            {
              description: "HTML document",
              accept: { "text/html": [".html"] }
            }
          ]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        setStatus("HTML saved");
        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          setStatus("Save cancelled");
          return;
        }
      }
    }

    downloadBlob(blob, "index-edited.html");
    setStatus("HTML downloaded");
  }

  function exportEdits() {
    const payload = JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        texts: state.texts,
        styles: state.styles,
        images: imageOverrides
      },
      null,
      2
    );
    downloadBlob(
      new Blob([payload], { type: "application/json" }),
      "portfolio-edits.json"
    );
    setStatus("Edits exported");
  }

  async function importEdits(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const payload = JSON.parse(await file.text());
      state.texts = payload.texts || {};
      state.styles = payload.styles || {};
      imageOverrides = payload.images || {};
      persistState();

      await clearStoredImages();
      imageOverrides = payload.images || {};
      for (const [id, dataUrl] of Object.entries(imageOverrides)) {
        await saveImageOverride(id, dataUrl);
      }
      setStatus("Edits imported");
      window.setTimeout(() => window.location.reload(), 300);
    } catch {
      setStatus("Import failed");
    }
  }

  async function resetAllEdits() {
    const confirmed = window.confirm(
      "Reset all text, typography and image changes saved in this browser?"
    );
    if (!confirmed) return;

    state = { texts: {}, styles: {} };
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}-images`);
    } catch {
      // No local storage to clear.
    }
    await clearStoredImages();
    setStatus("All edits cleared");
    window.setTimeout(() => window.location.reload(), 250);
  }

  function init() {
    state = loadLocalState();
    registerContent(document.body, "page");

    window.addEventListener("portfolio:project-rendered", (event) => {
      const { projectId, root } = event.detail || {};
      if (!projectId || !root) return;
      registerContent(root, `project:${projectId}`);
      if (editMode) updateImageList();
    });

    if (editRequested) openEditor();

    loadStoredImages().then(() => {
      applyImageOverrides();
      if (editMode) updateImageList();
    });
  }

  document.addEventListener(
    "click",
    (event) => {
      if (!editMode) return;
      const textElement = event.target.closest("[data-edit-text]");
      if (textElement) {
        event.preventDefault();
        event.stopPropagation();
        selectText(textElement);
        return;
      }

      const image = event.target.closest("img[data-edit-image]");
      if (image) {
        event.preventDefault();
        event.stopPropagation();
        selectImage(image);
      }
    },
    true
  );

  document.addEventListener("input", (event) => {
    if (!editMode) return;
    const textElement = event.target.closest?.("[data-edit-text]");
    if (!textElement) return;
    updateTextValue(textElement, textElement.textContent, false);
    const textValue = document.querySelector("#editor-text-value");
    if (selected?.element === textElement && textValue) {
      textValue.value = textElement.textContent;
    }
    scheduleSave();
  });

  document.addEventListener("keydown", (event) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "e"
    ) {
      event.preventDefault();
      openEditor();
      return;
    }

    if (
      event.key === "Escape" &&
      editMode &&
      !document.querySelector("#project-modal.is-open") &&
      !document.querySelector("#lightbox[open]")
    ) {
      closeEditor();
    }
  });

  init();
})();
