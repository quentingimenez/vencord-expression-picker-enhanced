const MIN_WIDTH = 498;
const MIN_HEIGHT = 320;
const MAX_HEIGHT = 5000;
const TOP_MARGIN = 60;
const HANDLE_CLASS = "vc-picker-resize";
const STYLE_ID = "vc-picker-resize-style";
const VARS_STYLE_ID = "vc-picker-resize-vars";
const IMPORT_STYLE_ID = "vc-picker-import-style";
const HEIGHT_VAR = "--vc-picker-saved-height";
const SETTINGS_KEY = "vcExpressionPickerSize";

/** All UI/delivery timings in one place, in milliseconds. */
const TIMINGS = Object.freeze({
    maintain: 250,
    styleRetry: 250,
    gifReveal: 10000,
    layerLookup: 2000,
    status: 3500,
    favoriteRefresh: 350,
    importError: 1300,
    restoreWindow: 5000,
    videoMetadata: 15000,
    videoSeek: 7000,
    composerFocusRetry: 50,
    searchDebounce: 120,
    startRetry: 50
});

const ATTEMPTS = Object.freeze({
    styleRetry: 20,
    composerFocus: 12,
    startRetry: 100
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const round = (value) => Math.round(value);

const LOG_PREFIX = "[ExpressionPickerEnhanced]";

/** Selectors for Discord internals. Keep every hashed class in one place. */
const SELECTORS = Object.freeze({
    pickerLayer: '[class*="expressionPickerPositionLayer"]',
    drawer: '[class*="drawerSizingWrapper"]',
    gifPanelId: "gif-picker-tab-panel",
    // Prefer stable class prefixes over full hashed names: Discord changes
    // the hash suffix regularly but keeps the component prefix.
    nativeBackButton: '[class*="backButton_"]',
    favoritesHeader: '[class*="favoritesHeader"]',
    rootCards: '[role="button"][class*="result_"]',
    rootCardClass: "result__2dc39",
    categoryLabel: '[class*="categoryText"], [class*="categoryName"], [class*="categoryLabel"]',
    searchInput: 'input[role="searchbox"]',
    clearButton: '[class*="clearButton"]',
    slateEditor: '[data-slate-editor="true"]'
});
const DRAWER_SELECTOR = `${SELECTORS.pickerLayer} ${SELECTORS.drawer}`;
const ROOT_CARD_CLASS_PREFIX = "result_";

/**
 * Native Discord classes used only as styling hooks for injected controls.
 * Custom CSS keeps the controls usable if one of these hashes changes; this
 * object gives maintainers a single place to update the native polish.
 */
const NATIVE_CLASSES = Object.freeze({
    icon: "icon__43deb",
    favoriteButton: "favButton__2dc39",
    gifFavoriteButton: "gifFavoriteButton__43deb",
    selected: "selected__43deb",
    categoryText: "categoryText_d02962",
    categoryName: "categoryName_d02962"
});

const ROOT_VIEWS = new Set(["root", "favorites", "imports"]);

function getVencord() {
    try {
        return window.Vencord ?? null;
    } catch {
        return null;
    }
}

function getWebpack() {
    return getVencord()?.Webpack ?? null;
}

function getWebpackCommon() {
    return getWebpack()?.Common ?? null;
}

/**
 * Resolves a Discord module defensively. Discord's internals change
 * between releases, so every call site must tolerate a missing module.
 */
function findByProps(...properties) {
    try {
        return getWebpack()?.findByProps?.(...properties) ?? null;
    } catch {
        return null;
    }
}

/**
 * Runs one integration step in isolation. A broken selector or an internal
 * Discord change must never prevent the other features from running.
 */
function safeRun(label, operation) {
    try {
        return operation();
    } catch (error) {
        console.error(`${LOG_PREFIX} ${label} failed`, error);
        return undefined;
    }
}

function getClassNames(element) {
    const value = typeof element?.className === "string" ? element.className : element?.getAttribute?.("class") || "";
    return String(value).split(/\s+/).filter(Boolean);
}

function isRootCard(element) {
    return getClassNames(element).some((name) => name.startsWith(ROOT_CARD_CLASS_PREFIX));
}

function getNativeRootCardClass(element) {
    return getClassNames(element).find((name) => name.startsWith(ROOT_CARD_CLASS_PREFIX)) ?? SELECTORS.rootCardClass;
}

/** Returns a normalized pathname for a Discord media URL, or null. */
function toPathname(src) {
    try {
        return new URL(src, location.href).pathname.toLowerCase();
    } catch {
        return null;
    }
}

function hasFavoritesView(root) {
    return !!root?.querySelector?.(SELECTORS.favoritesHeader);
}

function injectStyle(id, css) {
    const head = document.head || document.documentElement;
    if (!head) return null;

    let style = document.getElementById(id);
    if (!style) {
        style = document.createElement("style");
        style.id = id;
        head.appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
    return style;
}

/** Keyboard support for non-button elements with role="button". */
function addActivationHandler(element, handler) {
    const activate = (event) => {
        try {
            handler(event);
        } catch (error) {
            console.error(`${LOG_PREFIX} Activation handler failed`, error);
        }
    };

    element.addEventListener("click", activate);
    element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") activate(event);
    });
}

function createIconAction({ className, label, icon, pressed, onActivate }) {
    const element = document.createElement("div");
    element.className = className;
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("aria-label", label);
    if (pressed != null) element.setAttribute("aria-pressed", String(pressed));
    element.innerHTML = icon;
    addActivationHandler(element, onActivate);
    return element;
}
