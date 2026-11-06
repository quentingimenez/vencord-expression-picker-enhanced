const STATIC_CSS = `
/* --- Large expression picker ------------------------------------------- */
[class*="expressionPickerPositionLayer"] [class*="positionContainer"] {
    width: calc(100% - 24px) !important;
    height: auto !important;
}

html body [class*="expressionPickerPositionLayer"] [class*="drawerSizingWrapper"] {
    position: relative !important;
    inset-inline-end: auto !important;
    margin-inline-start: auto !important;
    margin-inline-end: 0 !important;

    height: var(${HEIGHT_VAR}, min(80vh, 920px));
    min-height: ${MIN_HEIGHT}px;
    max-height: calc(100vh - ${TOP_MARGIN * 2}px);
}

/* --- Discord's native left-edge width handle: hidden ------------------- */
[class*="expressionPickerPositionLayer"] [class*="resizeHandle"] {
    display: none !important;
}

/* --- GIF tiles: avoid the blue loading state, fade in when ready -------- */
#gif-picker-tab-panel [class*="result_"] {
    background-color: var(--background-mod-subtle) !important;
}

#gif-picker-tab-panel [class*="placeholder_"] {
    background: transparent !important;
}

#gif-picker-tab-panel [class*="gif_"] {
    transition: opacity 0.15s ease;
}

#gif-picker-tab-panel [class*="gif_"]:not(.vc-gif-ready) {
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
.${HANDLE_CLASS}.active,
.${HANDLE_CLASS}:focus-visible {
    opacity: 1;
    background: var(--background-mod-subtle);
    color: var(--interactive-text-hover);
}

.${HANDLE_CLASS}:focus-visible {
    outline: 2px solid var(--focus-primary, var(--brand-500));
    outline-offset: 2px;
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
        return getVencord()?.Settings ?? null;
    } catch {
        return null;
    }
}

/** Returns the persisted height, clamped, or null when none exists. */
function loadSavedHeight() {
    try {
        const api = getApi();
        if (api && Number.isFinite(api.savedHeight)) {
            return clamp(api.savedHeight, MIN_HEIGHT, MAX_HEIGHT);
        }

        const value = getSettings()?.[SETTINGS_KEY];
        const height = Number(value?.height);
        return Number.isFinite(height) ? clamp(height, MIN_HEIGHT, MAX_HEIGHT) : null;
    } catch {
        return null;
    }
}

/** Persists the height through the preload bridge and Vencord settings. */
function saveHeight(height) {
    if (!Number.isFinite(height)) return;
    const value = round(clamp(height, MIN_HEIGHT, MAX_HEIGHT));

    const api = getApi();
    if (api?.saveHeight) {
        try {
            api.saveHeight(value);
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to save height`, error);
        }
    }

    // Keep a copy in Vencord's settings as a fallback.
    try {
        const settings = getSettings();
        if (settings) {
            settings[SETTINGS_KEY] = {
                ...(settings[SETTINGS_KEY] ?? {}),
                height: value
            };
        }
    } catch {
        /* Vencord settings may be read-only or unavailable. */
    }
}

let cachedSettingsSetter = null;

function setDiscordWidth(width) {
    if (!Number.isFinite(width)) return;
    try {
        if (!cachedSettingsSetter) {
            cachedSettingsSetter = findByProps("updatedUnsyncedSettings");
        }
        cachedSettingsSetter?.updatedUnsyncedSettings({ expressionPickerWidth: round(width) });
    } catch {
        // Discord internals changed - retry discovery on the next resize.
        cachedSettingsSetter = null;
    }
}

function ensureStyleTag() {
    return injectStyle(STYLE_ID, STATIC_CSS);
}

function applySavedHeight(height) {
    if (!Number.isFinite(height)) return;
    ensureStyleTag();

    // Use a stylesheet rule instead of an inline style on <html>: Discord
    // rewrites the <html> style attribute during startup, which would
    // otherwise wipe the variable and bring the resize flash back.
    // Set this before the picker exists so its very first paint already
    // uses the remembered height (no visible resize flash).
    injectStyle(VARS_STYLE_ID, `:root { ${HEIGHT_VAR}: ${round(height)}px; }`);
}

let savedHeight = loadSavedHeight();

function initStyle() {
    ensureStyleTag();
    if (savedHeight) applySavedHeight(savedHeight);
}

if (!TEST_HOOK) {
    if (document.documentElement) {
        initStyle();
    } else if (typeof MutationObserver === "function") {
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

        if (++attempts > ATTEMPTS.styleRetry) clearInterval(styleRetry);
    }, TIMINGS.styleRetry);
}

let gifPanelObserver = null;
let gifPanelEl = null;

function markGifMedia(media) {
    if (!media || media.__vcGifMarked) return;
    if (media.tagName !== "IMG" && media.tagName !== "VIDEO") return;
    media.__vcGifMarked = true;

    let revealTimer = 0;
    const reveal = () => {
        if (media.__vcGifReady) return;
        clearTimeout(revealTimer);
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
    if (!media.__vcGifReady) {
        revealTimer = setTimeout(reveal, TIMINGS.gifReveal);
    }
}

function markGifMediaIn(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.matches?.('[class*="gif_"]')) markGifMedia(root);
    root.querySelectorAll?.('[class*="gif_"]').forEach(markGifMedia);
}

function setupGifObserver() {
    if (gifPanelEl && !gifPanelEl.isConnected) {
        gifPanelObserver?.disconnect();
        gifPanelObserver = null;
        gifPanelEl = null;
    }

    const panel = findPanel();
    if (!panel || panel === gifPanelEl) return;

    gifPanelObserver?.disconnect();
    gifPanelEl = panel;

    gifPanelObserver = new MutationObserver((mutations) => {
        try {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    markGifMediaIn(node);
                }
            }
        } catch (error) {
            console.error(`${LOG_PREFIX} GIF observer failed`, error);
        }
    });
    gifPanelObserver.observe(panel, { childList: true, subtree: true });
    markGifMediaIn(panel);
}

function createHandle() {
    const handle = document.createElement("div");
    handle.className = HANDLE_CLASS;
    handle.title = t("resizeHandle");
    handle.setAttribute("role", "button");
    handle.setAttribute("tabindex", "0");
    handle.setAttribute("aria-label", t("resizeHandleLabel"));
    handle.innerHTML = `
            <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
                <path d="M3.25 3.25 16.75 16.75M3.25 9.25v-6h6M16.75 10.75v6h-6"
                    fill="none" stroke="currentColor" stroke-width="1.7"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;

    // Keep Discord's "click outside to close" handler from firing.
    handle.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();
    });

    return handle;
}

/** Adds the resize grip to a picker drawer once and restores its height. */
function initDrawer(drawer) {
    if (!drawer) return;

    // A previous attempt may have been interrupted after the grip was
    // inserted; never append a second one, but replace a half-built grip.
    // The flag alone is not enough: Discord can remove the grip while
    // keeping the drawer element, and the grip must be recreated then.
    const existingHandle = drawer.querySelector?.(`.${HANDLE_CLASS}`);
    if (existingHandle?.__vcReady) {
        drawer.__vcPickerResize = true;
        return;
    }
    if (existingHandle) existingHandle.remove();

    if (!savedHeight) {
        savedHeight = loadSavedHeight();
    }
    if (savedHeight) {
        safeRun("restore saved height", () => {
            applySavedHeight(savedHeight);
            drawer.style.height = `${savedHeight}px`;
        });
    }

    const handle = createHandle();
    drawer.appendChild(handle);
    safeRun("GIF observer", setupGifObserver);

    let drag = null;

    const getSizeBounds = () => {
        const rect = drawer.getBoundingClientRect();
        const parentRect = drawer.parentElement?.getBoundingClientRect() ?? rect;
        return {
            rect,
            maxWidth: Math.max(MIN_WIDTH, parentRect.width),
            maxHeight: Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, rect.bottom - TOP_MARGIN))
        };
    };

    const applyDrawerSize = (width, height) => {
        drawer.style.width = `${round(width)}px`;
        drawer.style.height = `${round(height)}px`;
    };

    const persistSize = (width, height) => {
        savedHeight = round(height);
        // Update the CSS variable so the next opening has the right size
        // from its first paint.
        applySavedHeight(savedHeight);
        saveHeight(savedHeight);
        setDiscordWidth(width);
    };

    handle.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();

        const { rect, maxWidth, maxHeight } = getSizeBounds();

        drag = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startWidth: rect.width,
            startHeight: rect.height,
            maxWidth,
            maxHeight
        };

        handle.classList.add("active");
        try {
            handle.setPointerCapture(event.pointerId);
        } catch {
            /* ignore */
        }
    });

    handle.addEventListener("pointermove", (event) => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        event.preventDefault();

        // The picker is anchored bottom-right: dragging left/up enlarges it.
        const width = clamp(drag.startWidth + (drag.startX - event.clientX), MIN_WIDTH, drag.maxWidth);
        const height = clamp(drag.startHeight + (drag.startY - event.clientY), MIN_HEIGHT, drag.maxHeight);

        applyDrawerSize(width, height);
    });

    const finishDrag = (event) => {
        if (!drag || event.pointerId !== drag.pointerId) return;

        drag = null;
        handle.classList.remove("active");
        try {
            handle.releasePointerCapture(event.pointerId);
        } catch {
            /* ignore */
        }

        if (!drawer.isConnected) return;

        const rect = drawer.getBoundingClientRect();
        persistSize(rect.width, rect.height);
    };

    handle.addEventListener("pointerup", finishDrag);
    handle.addEventListener("pointercancel", finishDrag);

    // Arrow keys provide the same resize affordance without a pointer.
    handle.addEventListener("keydown", (event) => {
        const step = event.shiftKey ? 32 : 8;
        let deltaWidth = 0;
        let deltaHeight = 0;
        if (event.key === "ArrowLeft") deltaWidth = step;
        else if (event.key === "ArrowRight") deltaWidth = -step;
        else if (event.key === "ArrowUp") deltaHeight = step;
        else if (event.key === "ArrowDown") deltaHeight = -step;
        else return;

        event.preventDefault();
        if (!drawer.isConnected) return;
        const { rect, maxWidth, maxHeight } = getSizeBounds();
        const width = clamp(rect.width + deltaWidth, MIN_WIDTH, maxWidth);
        const height = clamp(rect.height + deltaHeight, MIN_HEIGHT, maxHeight);
        applyDrawerSize(width, height);
        persistSize(width, height);
    });

    handle.__vcReady = true;
    drawer.__vcPickerResize = true;
}

function initFromLayer(layer) {
    const drawer = layer.querySelector?.(SELECTORS.drawer);
    if (drawer) {
        safeRun("initialize drawer", () => initDrawer(drawer));
        return;
    }

    const observer = new MutationObserver(() => {
        safeRun("find drawer", () => {
            const found = layer.querySelector?.(SELECTORS.drawer);
            if (!found) return;
            clearTimeout(timeout);
            observer.disconnect();
            initDrawer(found);
        });
    });
    const timeout = setTimeout(() => observer.disconnect(), TIMINGS.layerLookup);
    observer.observe(layer, { childList: true, subtree: true });
}

function startPickerObserver() {
    if (!document.body || typeof MutationObserver !== "function") return false;

    const observer = new MutationObserver((mutations) => {
        try {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches?.(SELECTORS.pickerLayer)) initFromLayer(node);
                    node.querySelectorAll?.(SELECTORS.pickerLayer).forEach(initFromLayer);
                }
            }
        } catch (error) {
            console.error(`${LOG_PREFIX} Picker observer failed`, error);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return true;
}
