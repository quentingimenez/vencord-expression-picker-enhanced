let maintenanceTimer = 0;

function startMaintenance() {
    if (!maintenanceTimer) {
        maintenanceTimer = setInterval(safeMaintain, TIMINGS.maintain);
    }
}

function start(attempt = 0) {
    if (!document.documentElement) {
        if (attempt < ATTEMPTS.startRetry) {
            setTimeout(() => start(attempt + 1), TIMINGS.startRetry);
        } else {
            console.error(`${LOG_PREFIX} document.documentElement never appeared`);
        }
        return;
    }

    // Start the fallback loop first: even if one of the one-time setup
    // steps below fails, maintenance still runs and retries the UI.
    startMaintenance();
    safeRun("import styles", ensureImportStyle);
    safeRun("resize listener", () => window.addEventListener("resize", scheduleMaintain, { passive: true }));
    safeRun("composer focus listener", () =>
        document.addEventListener(
            "click",
            (event) => {
                safeRun("composer focus", () => {
                    const tile = event.target.closest?.(SELECTORS.rootCards);
                    if (!tile) return;
                    if (event.target.closest?.('[class*="favButton"]')) return;
                    if (!hasFavoritesView(document)) return;
                    focusComposerWhenReady();
                });
            },
            true
        )
    );
    safeMaintain();
    loadImports().catch((error) => console.error(`${LOG_PREFIX} Failed to load imports`, error));
}

if (TEST_HOOK) {
    Object.assign(TEST_HOOK, {
        resize: {
            constants: {
                MIN_WIDTH,
                MIN_HEIGHT,
                MAX_HEIGHT,
                TOP_MARGIN,
                HANDLE_CLASS,
                STYLE_ID,
                VARS_STYLE_ID,
                HEIGHT_VAR
            },
            clamp,
            round,
            loadSavedHeight,
            saveHeight,
            setDiscordWidth,
            applySavedHeight,
            initDrawer,
            markGifMedia,
            markGifMediaIn,
            getSavedHeight: () => savedHeight
        },
        imports: {
            constants: {
                DB_NAME,
                DB_VERSION,
                STORE,
                MAX_INPUT_BYTES,
                MAX_OUTPUT_BYTES,
                MAX_DIMENSION,
                MAX_DURATION,
                FPS,
                MAX_VIDEO_FRAMES,
                MAX_IMAGE_FRAMES,
                ACCEPT,
                LAST_VIEW_COOKIE,
                GRID_GAP,
                DESIRED_TILE_WIDTH,
                MAX_COLUMNS,
                MAX_ROOT_COLUMNS,
                ROOT_TILE_HEIGHT,
                STATIC_CSS,
                IMPORT_CSS
            },
            safeRun,
            isRootCard,
            getNativeRootCardClass,
            messages: MESSAGES,
            fit,
            normalizeLocale,
            detectDiscordLocale,
            getLocale,
            interpolate,
            t,
            normalizeLastView,
            loadLastView,
            saveLastView,
            getNativeFavoriteEntries,
            buildImportFavoriteIndex,
            getFavoriteKeysForRecord,
            getUnfavoriteAction,
            closePicker,
            requestRestore,
            finishRestore,
            tryRestore,
            isCurrentCategory,
            reflowRootGrid,
            renderImportedView,
            layoutImportedTiles,
            maintain,
            safeMaintain,
            seekVideo,
            encodeFrames,
            convertImage,
            convertVideo,
            importFile,
            findDrawer,
            findPanel,
            setImports(value) {
                imports = value;
            },
            getImports: () => imports,
            setOverlay(value) {
                overlay = value;
            },
            getOverlay: () => overlay,
            setDrawer(value) {
                drawer = value;
            }
        }
    });
} else {
    if (!safeRun("start picker observer", startPickerObserver)) {
        document.addEventListener("DOMContentLoaded", () => safeRun("start picker observer", startPickerObserver), {
            once: true
        });
    }
    safeRun("start", start);
}
