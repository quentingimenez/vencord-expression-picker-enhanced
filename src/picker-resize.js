/*
 * Vencord - Expression Picker Resize
 *
 * Adds a top-left resize handle to Discord's expression picker
 * (GIF / stickers / emoji) and remembers its height.
 *
 * Width is persisted by Discord itself (expressionPickerWidth).
 * Height is stored in %LOCALAPPDATA%\VencordPickerResize\size.json.
 *
 * Loaded in the renderer main world by a small loader appended to
 * Vencord's preload.js. The loader also exposes VencordPickerResize
 * so the saved height is known before the picker is created (no flash).
 */
(() => {
    "use strict";

    // Allow an empty hostname (preload can run before navigation) but
    // don't run in the Monaco editor window or other remote pages.
    if (location.hostname && !/(^|\.)discord\.com$/i.test(location.hostname)) return;

    const INSTALL_FLAG = "__vcExpressionPickerResizeInstalled";
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    const MIN_WIDTH = 498;
    const MIN_HEIGHT = 320;
    const MAX_HEIGHT = 5000;
    const TOP_MARGIN = 60;
    const HANDLE_CLASS = "vc-picker-resize";
    const STYLE_ID = "vc-picker-resize-style";
    const VARS_STYLE_ID = "vc-picker-resize-vars";
    const HEIGHT_VAR = "--vc-picker-saved-height";

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const round = value => Math.round(value);

    const STATIC_CSS = `
/* --- Large expression picker ------------------------------------------- */
[class*="expressionPickerPositionLayer"] [class*="positionContainer__"] {
    width: calc(100% - 24px) !important;
    height: auto !important;
}

html body [class*="expressionPickerPositionLayer"] [class*="drawerSizingWrapper"] {
    position: relative !important;
    inset-inline-end: auto !important;
    margin-inline-start: auto !important;
    margin-inline-end: 0 !important;

    height: var(${HEIGHT_VAR}, min(80vh, 920px));
    min-height: 320px;
    max-height: calc(100vh - 120px);
}

/* --- Discord's native left-edge width handle: hidden ------------------- */
[class*="expressionPickerPositionLayer"] [class*="resizeHandle__"] {
    display: none !important;
}

/* --- GIF tiles: avoid the blue loading state, fade in when ready -------- */
#gif-picker-tab-panel [class*="result__"] {
    background-color: var(--background-mod-subtle) !important;
}

#gif-picker-tab-panel [class*="placeholder__"] {
    background: transparent !important;
}

#gif-picker-tab-panel [class*="gif__"] {
    transition: opacity 0.15s ease;
}

#gif-picker-tab-panel [class*="gif__"]:not(.vc-gif-ready) {
    opacity: 0;
}

/* --- Minimal top-left resize grip (inside the panel) ------------------- */
.${HANDLE_CLASS} {
    position: absolute;
    top: 4px;
    left: 4px;
    z-index: 20;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 12px;
    height: 12px;
    border-radius: 3px;
    border: none;
    background: transparent;
    box-shadow: none;
    color: var(--interactive-text-default);

    cursor: nwse-resize;
    opacity: 0.35;
    touch-action: none;
    user-select: none;
    transition: opacity 0.15s, background-color 0.15s, color 0.15s;
}

.${HANDLE_CLASS}:hover,
.${HANDLE_CLASS}.active {
    opacity: 1;
    background: var(--background-mod-subtle);
    color: var(--interactive-text-hover);
}

.${HANDLE_CLASS} svg {
    width: 9px;
    height: 9px;
    pointer-events: none;
}
`;

    function getApi() {
        try {
            return window.VencordPickerResize ?? null;
        } catch {
            return null;
        }
    }

    function getSettings() {
        try {
            return window.Vencord?.Settings ?? null;
        } catch {
            return null;
        }
    }

    function loadSavedHeight() {
        const api = getApi();
        if (api && Number.isFinite(api.savedHeight)) {
            return clamp(api.savedHeight, MIN_HEIGHT, MAX_HEIGHT);
        }

        const value = getSettings()?.["vcExpressionPickerSize"];
        const height = Number(value?.height);
        return Number.isFinite(height) ? clamp(height, MIN_HEIGHT, MAX_HEIGHT) : null;
    }

    function saveHeight(height) {
        const value = round(clamp(height, MIN_HEIGHT, MAX_HEIGHT));

        const api = getApi();
        if (api?.saveHeight) {
            try {
                api.saveHeight(value);
            } catch (error) {
                console.error("[PickerResize] Failed to save height", error);
            }
        }

        // Keep a copy in Vencord's settings as a fallback.
        try {
            const settings = getSettings();
            if (settings) {
                settings["vcExpressionPickerSize"] = {
                    ...(settings["vcExpressionPickerSize"] ?? {}),
                    height: value
                };
            }
        } catch { /* ignore */ }
    }

    function setDiscordWidth(width) {
        try {
            const setter = window.Vencord?.Webpack?.findByProps?.("updatedUnsyncedSettings");
            setter?.updatedUnsyncedSettings({ expressionPickerWidth: round(width) });
        } catch {
            // Discord internals changed - width will fall back to its own value.
        }
    }

    function ensureStyleTag() {
        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = STATIC_CSS;
            (document.head || document.documentElement).appendChild(style);
        }
        return style;
    }

    function applySavedHeight(height) {
        if (!Number.isFinite(height)) return;
        ensureStyleTag();

        // Use a stylesheet rule instead of an inline style on <html>: Discord
        // rewrites the <html> style attribute during startup, which would
        // otherwise wipe the variable and bring the resize flash back.
        let vars = document.getElementById(VARS_STYLE_ID);
        if (!vars) {
            vars = document.createElement("style");
            vars.id = VARS_STYLE_ID;
            (document.head || document.documentElement).appendChild(vars);
        }

        // Set this before the picker exists so its very first paint already
        // uses the remembered height (no visible resize flash).
        vars.textContent = `:root { ${HEIGHT_VAR}: ${round(height)}px; }`;
    }

    let savedHeight = loadSavedHeight();

    function initStyle() {
        ensureStyleTag();
        if (savedHeight) applySavedHeight(savedHeight);
    }

    if (document.documentElement) {
        initStyle();
    } else {
        const observer = new MutationObserver(() => {
            if (!document.documentElement) return;
            observer.disconnect();
            initStyle();
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    // Vencord may not be initialised yet when this script starts; retry briefly.
    let attempts = 0;
    const styleRetry = setInterval(() => {
        if (savedHeight) {
            initStyle();
            clearInterval(styleRetry);
            return;
        }

        const height = loadSavedHeight();
        if (height) {
            savedHeight = height;
            initStyle();
            clearInterval(styleRetry);
            return;
        }

        if (++attempts > 20) clearInterval(styleRetry);
    }, 250);

    let gifPanelObserver = null;
    let gifPanelEl = null;

    function markGifMedia(media) {
        if (!media || media.__vcGifMarked) return;
        media.__vcGifMarked = true;

        const reveal = () => {
            if (media.__vcGifReady) return;
            media.__vcGifReady = true;
            media.classList.add("vc-gif-ready");
        };

        if (media.tagName === "IMG") {
            if (media.complete && media.naturalWidth > 0) {
                reveal();
            } else {
                media.addEventListener("load", reveal, { once: true });
                media.addEventListener("error", reveal, { once: true });
            }
        } else if (media.readyState >= 2) {
            reveal();
        } else {
            media.addEventListener("loadeddata", reveal, { once: true });
            media.addEventListener("playing", reveal, { once: true });
            media.addEventListener("canplay", reveal, { once: true });
            media.addEventListener("error", reveal, { once: true });
        }

        // Never leave a tile invisible forever if the media never loads.
        setTimeout(reveal, 10000);
    }

    function markGifMediaIn(root) {
        if (!root || root.nodeType !== 1) return;
        if (root.matches?.('[class*="gif__"]')) markGifMedia(root);
        root.querySelectorAll?.('[class*="gif__"]').forEach(markGifMedia);
    }

    function setupGifObserver() {
        if (gifPanelEl && !gifPanelEl.isConnected) {
            gifPanelObserver?.disconnect();
            gifPanelObserver = null;
            gifPanelEl = null;
        }

        const panel = document.getElementById("gif-picker-tab-panel");
        if (!panel || panel === gifPanelEl) return;

        gifPanelObserver?.disconnect();
        gifPanelEl = panel;

        gifPanelObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    markGifMediaIn(node);
                }
            }
        });
        gifPanelObserver.observe(panel, { childList: true, subtree: true });
        markGifMediaIn(panel);
    }

    function createHandle() {
        const handle = document.createElement("div");
        handle.className = HANDLE_CLASS;
        handle.title = "Redimensionner";
        handle.setAttribute("role", "button");
        handle.setAttribute("aria-label", "Redimensionner la fenêtre");
        handle.innerHTML = `
            <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
                <path d="M3.25 16.75 16.75 3.25M3.25 10.75v6h6M16.75 9.25v-6h-6"
                    fill="none" stroke="currentColor" stroke-width="1.7"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;

        // Keep Discord's "click outside to close" handler from firing.
        handle.addEventListener("mousedown", event => {
            event.preventDefault();
            event.stopPropagation();
        });

        return handle;
    }

    function initDrawer(drawer) {
        if (!drawer || drawer.__vcPickerResize) return;
        drawer.__vcPickerResize = true;

        if (!savedHeight) {
            savedHeight = loadSavedHeight();
        }
        if (savedHeight) {
            applySavedHeight(savedHeight);
            drawer.style.height = `${savedHeight}px`;
        }

        const handle = createHandle();
        drawer.appendChild(handle);
        setupGifObserver();

        let drag = null;

        handle.addEventListener("pointerdown", event => {
            if (event.button !== 0) return;
            event.preventDefault();
            event.stopPropagation();

            const rect = drawer.getBoundingClientRect();
            const parentRect = drawer.parentElement.getBoundingClientRect();

            drag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                startWidth: rect.width,
                startHeight: rect.height,
                maxWidth: parentRect.width,
                maxHeight: Math.max(MIN_HEIGHT, rect.bottom - TOP_MARGIN)
            };

            handle.classList.add("active");
            try {
                handle.setPointerCapture(event.pointerId);
            } catch { /* ignore */ }
        });

        handle.addEventListener("pointermove", event => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            event.preventDefault();

            // The picker is anchored bottom-right: dragging left/up enlarges it.
            const width = clamp(drag.startWidth + (drag.startX - event.clientX), MIN_WIDTH, drag.maxWidth);
            const height = clamp(drag.startHeight + (drag.startY - event.clientY), MIN_HEIGHT, drag.maxHeight);

            drawer.style.width = `${round(width)}px`;
            drawer.style.height = `${round(height)}px`;
        });

        const finishDrag = event => {
            if (!drag || event.pointerId !== drag.pointerId) return;

            drag = null;
            handle.classList.remove("active");
            try {
                handle.releasePointerCapture(event.pointerId);
            } catch { /* ignore */ }

            const rect = drawer.getBoundingClientRect();
            savedHeight = rect.height;

            // Update the CSS variable so the next opening has the right size
            // from its first paint.
            applySavedHeight(rect.height);
            saveHeight(rect.height);
            setDiscordWidth(rect.width);
        };

        handle.addEventListener("pointerup", finishDrag);
        handle.addEventListener("pointercancel", finishDrag);
    }

    function initFromLayer(layer) {
        const drawer = layer.querySelector?.('[class*="drawerSizingWrapper"]');
        if (drawer) {
            initDrawer(drawer);
            return;
        }

        const observer = new MutationObserver(() => {
            const found = layer.querySelector?.('[class*="drawerSizingWrapper"]');
            if (!found) return;
            observer.disconnect();
            initDrawer(found);
        });
        observer.observe(layer, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 2000);
    }

    function startPickerObserver() {
        if (!document.body) return false;

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches?.('[class*="expressionPickerPositionLayer"]')) {
                        initFromLayer(node);
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return true;
    }

    function tick() {
        const drawer = document.querySelector('[class*="expressionPickerPositionLayer"] [class*="drawerSizingWrapper"]');
        if (drawer) initDrawer(drawer);
        setupGifObserver();
    }

    if (!startPickerObserver()) {
        document.addEventListener("DOMContentLoaded", startPickerObserver, { once: true });
    }
    tick();
    setInterval(tick, 300);
})();
