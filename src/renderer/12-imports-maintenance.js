/** Single entry point for all DOM/resize/timer-driven UI synchronization. */
function maintain() {
    if (!document.getElementById(IMPORT_STYLE_ID)) {
        safeRun("import styles", ensureImportStyle);
    }

    const currentDrawer = findDrawer();
    const panel = findPanel();
    const isOpen = !!currentDrawer?.isConnected;

    if (isOpen && !pickerWasOpen) requestRestore();
    pickerWasOpen = isOpen;

    const panelPresent = isOpen && !!panel;
    if (isOpen && panelPresent && !panelWasPresent) requestRestore();
    panelWasPresent = panelPresent;

    if (currentDrawer !== drawer) {
        drawer = currentDrawer;
        button = drawer?.querySelector(".vc-gif-import") ?? null;
        statusEl = drawer?.querySelector(".vc-import-status") ?? null;
    }

    safeRun("picker observer", () => ensurePickerObserver(currentDrawer?.isConnected ? currentDrawer : null));
    safeRun("resize observer", () => ensureResizeObserver(currentDrawer?.isConnected ? currentDrawer : null));

    if (!drawer?.isConnected) {
        drawer = null;
        button = null;
        statusEl = null;
        safeRun("restore cleanup", finishRestore);
        safeRun("imports cleanup", closeImportedView);
        safeRun("category cleanup", removeCategoryCard);
        return;
    }

    // Replaces the legacy 300 ms resize poll: maintain() already runs on
    // every relevant DOM/resize mutation and periodically as a fallback.
    safeRun("resize grip", () => initDrawer(currentDrawer));
    safeRun("GIF observer", setupGifObserver);

    safeRun("file input", ensureInput);
    safeRun("import button", () => {
        const btn = ensureButton();
        btn.style.display = panel ? "flex" : "none";
        btn.disabled = busy;
    });

    if (!panel) {
        safeRun("imports cleanup", closeImportedView);
        safeRun("category cleanup", removeCategoryCard);
        safeRun("status cleanup", () => {
            statusEl?.remove();
            statusEl = null;
        });
        return;
    }

    safeRun("category card", () => maintainCategoryCard(panel));
    safeRun("view tracking", () => trackNativeBackButton(panel));
    safeRun("view restore", () => tryRestore(panel));
    safeRun("imports view", () => maintainImportedView(panel));

    if (importedView) {
        safeRun("native delete cleanup", () =>
            panel.querySelectorAll(".vc-native-delete").forEach((button) => button.remove())
        );
    } else {
        safeRun("native delete buttons", () => maintainNativeDeleteButtons(panel));
    }
}

/** Prevents a transient Discord DOM change from breaking the UI loop. */
function safeMaintain() {
    try {
        maintain();
    } catch (error) {
        console.error(`${LOG_PREFIX} Maintenance failed`, error);
    }
}
