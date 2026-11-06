const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const yieldToUI = () => delay(0);
const revokeObjectUrl = (url) => {
    if (!url) return;
    try {
        URL.revokeObjectURL(url);
    } catch (error) {
        console.warn(`${LOG_PREFIX} Failed to revoke preview URL`, error);
    }
};
const hasExtension = (name, extensions) => extensions.some((extension) => name.endsWith(extension));
const fit = (width, height) => {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return { width: 1, height: 1 };
    }
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale))
    };
};

let dbPromise = null;
let imports = [];
const objectUrls = new Map();

let drawer = null;
let button = null;
let input = null;
let statusEl = null;
let statusTimer = 0;
let busy = false;

let categoryCard = null;
let categoryPreviewId = "";
let importedView = false;
let importedQuery = "";
let importedSearchTimer = 0;
let overlay = null;
let overlayKey = null;
let overlayLayoutWidth = 0;

const LAST_VIEW_COOKIE = "vcPickerLastView";
let lastView = loadLastView();
let pickerWasOpen = false;
let panelWasPresent = false;
let restorePending = false;
let restoreTarget = null;
let restoreDeadline = 0;
let restoringClick = false;
let pickerObserver = null;
let observedDrawer = null;
let resizeObserver = null;
let observedResizeNode = null;
let maintainScheduled = false;

const GRID_GAP = 12;
const DESIRED_TILE_WIDTH = 200;
const MAX_COLUMNS = 8;
const MAX_ROOT_COLUMNS = 6;
const ROOT_TILE_HEIGHT = 110;

const BACK_ICON = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <path fill="currentColor" d="M3.3 11.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L6.42 13H20a1 1 0 1 0 0-2H6.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"/>
        </svg>`;

const UPLOAD_ICON = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v4h14v-4"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

const TRASH_ICON = `
        <svg class="${NATIVE_CLASSES.icon}" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
                d="M9 3a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 1 0 0-2h-3V5a2 2 0 0 0-2-2H9Zm6 3V5a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v1h6ZM8 8v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8H8Zm2 2a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Z"
                clip-rule="evenodd"/>
        </svg>`;

const STAR_ICON = `
        <svg class="${NATIVE_CLASSES.icon}" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M10.81 2.86c.38-1.15 2-1.15 2.38 0l1.89 5.83h6.12c1.2 0 1.71 1.54.73 2.25l-4.95 3.6 1.9 5.82a1.25 1.25 0 0 1-1.93 1.4L12 18.16l-4.95 3.6c-.98.7-2.3-.25-1.92-1.4l1.89-5.82-4.95-3.6a1.25 1.25 0 0 1 .73-2.25h6.12l1.9-5.83Z"/>
        </svg>`;

const SEARCH_ICON = `
        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
                d="M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                clip-rule="evenodd"/>
        </svg>`;

const CLEAR_ICON = `
        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
                d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm4.7-15.7a1 1 0 0 0-1.4 0L12 10.58l-3.3-3.3a1 1 0 0 0-1.4 1.42L10.58 12l-3.3 3.3a1 1 0 1 0 1.42 1.4L12 13.42l3.3 3.3a1 1 0 0 0 1.4-1.42L13.42 12l3.3-3.3a1 1 0 0 0 0-1.4Z"
                clip-rule="evenodd"/>
        </svg>`;

function openDB() {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            if (typeof indexedDB === "undefined") {
                reject(new Error("IndexedDB is not available"));
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE, { keyPath: "id" });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onblocked = () => reject(new Error("IndexedDB upgrade is blocked"));
        }).catch((error) => {
            // Allow a later call to retry after a transient failure.
            dbPromise = null;
            throw error;
        });
    }
    return dbPromise;
}

function requestAsPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAllImports() {
    const db = await openDB();
    const tx = db.transaction(STORE, "readonly");
    return (await requestAsPromise(tx.objectStore(STORE).getAll())) || [];
}

async function runWriteTransaction(operation) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
        tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));

        try {
            operation(tx.objectStore(STORE));
        } catch (error) {
            try {
                tx.abort();
            } catch {
                /* The transaction may already be finished. */
            }
            reject(error);
        }
    });
}

function putImport(record) {
    return runWriteTransaction((store) => store.put(record));
}

function removeImport(id) {
    return runWriteTransaction((store) => store.delete(id));
}

function findDrawer() {
    return document.querySelector(DRAWER_SELECTOR) ?? document.querySelector(SELECTORS.drawer) ?? null;
}

function findPanel() {
    return (
        document.getElementById(SELECTORS.gifPanelId) ??
        document.querySelector('[id^="gif-picker"], [id*="gifPicker"]') ??
        null
    );
}

function scheduleMaintain() {
    if (maintainScheduled) return;
    maintainScheduled = true;
    queueMicrotask(() => {
        maintainScheduled = false;
        safeMaintain();
    });
}

function ensurePickerObserver(drawerNode) {
    if (observedDrawer === drawerNode) return;
    pickerObserver?.disconnect();
    pickerObserver = null;
    observedDrawer = drawerNode;
    if (!drawerNode) return;
    pickerObserver = new MutationObserver((records) => {
        try {
            const hasElementMutation = records.some((record) =>
                [...record.addedNodes, ...record.removedNodes].some((node) => node.nodeType === 1)
            );
            if (!hasElementMutation) return;
            scheduleMaintain();
        } catch (error) {
            console.error(`${LOG_PREFIX} Picker mutation observer failed`, error);
            scheduleMaintain();
        }
    });
    pickerObserver.observe(drawerNode, { childList: true, subtree: true });
    scheduleMaintain();
}

function ensureResizeObserver(node) {
    if (observedResizeNode === node) return;
    resizeObserver?.disconnect();
    resizeObserver = null;
    observedResizeNode = node;
    if (!node || typeof ResizeObserver !== "function") return;
    resizeObserver = new ResizeObserver(() => scheduleMaintain());
    resizeObserver.observe(node);
    scheduleMaintain();
}

function normalizeLastView(value) {
    if (ROOT_VIEWS.has(value)) {
        return { type: value };
    }
    if (value && ROOT_VIEWS.has(value.type)) {
        return { type: value.type };
    }
    if (value && value.type === "category" && typeof value.label === "string" && value.label) {
        return { type: "category", label: value.label };
    }
    return { type: "favorites" };
}

function loadLastView() {
    try {
        const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LAST_VIEW_COOKIE}=([^;]+)`));
        if (match) return normalizeLastView(JSON.parse(decodeURIComponent(match[1])));
    } catch {
        /* ignore */
    }
    return { type: "favorites" };
}

function saveLastView(view) {
    lastView = normalizeLastView(view);
    try {
        document.cookie = `${LAST_VIEW_COOKIE}=${encodeURIComponent(JSON.stringify(lastView))}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
        /* ignore */
    }
}

function requestRestore() {
    restorePending = true;
    restoreTarget = normalizeLastView(lastView);
    restoreDeadline = Date.now() + TIMINGS.restoreWindow;
}

function finishRestore() {
    restorePending = false;
    restoreTarget = null;
}

function clickForRestore(element) {
    if (!element) return;
    restoringClick = true;
    try {
        element.click();
    } finally {
        restoringClick = false;
    }
}

function handleViewTracking(view) {
    if (!restoringClick) finishRestore();
    saveLastView(view);
}
