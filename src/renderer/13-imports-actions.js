async function loadImports() {
    try {
        const records = await getAllImports();
        imports = records
            .filter(
                (record) =>
                    record &&
                    typeof record === "object" &&
                    typeof record.id === "string" &&
                    record.id &&
                    record.blob &&
                    typeof record.blob === "object" &&
                    typeof record.blob.size === "number"
            )
            .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } catch (error) {
        console.error(`${LOG_PREFIX} Failed to load imports`, error);
        imports = [];
    }

    for (const url of objectUrls.values()) revokeObjectUrl(url);
    objectUrls.clear();
    for (const record of imports) {
        try {
            objectUrls.set(record.id, URL.createObjectURL(record.blob));
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to create preview URL`, error);
        }
    }
    categoryPreviewId = "";
    if (overlay) renderImportedView(true);
    updateCategoryCardContent();
}

function closePicker() {
    try {
        const store = getWebpackCommon()?.ExpressionPickerStore;
        if (typeof store?.closeExpressionPicker === "function") {
            store.closeExpressionPicker();
            return true;
        }
    } catch {
        /* Fall back to the legacy action below. */
    }

    try {
        const actions = findByProps("v8", "RQ");
        if (typeof actions?.v8 === "function") {
            actions.v8();
            return true;
        }
    } catch {
        /* Discord internals changed. */
    }
    return false;
}

function focusComposerWhenReady(attempt = 0) {
    if (findDrawer()) {
        if (attempt < ATTEMPTS.composerFocus) {
            setTimeout(() => focusComposerWhenReady(attempt + 1), TIMINGS.composerFocusRetry);
        }
        return;
    }

    const editor = document.querySelector(SELECTORS.slateEditor);
    if (editor?.isConnected) {
        safeRun("focus composer", () => editor.focus());
        if (document.activeElement === editor) return;
    }

    if (attempt < ATTEMPTS.composerFocus) {
        setTimeout(() => focusComposerWhenReady(attempt + 1), TIMINGS.composerFocusRetry);
    }
}

function attachToComposer(record) {
    const common = getWebpackCommon();
    const uploadManager = common?.UploadManager;
    const channelId = common?.SelectedChannelStore?.getChannelId?.();
    if (!uploadManager || !channelId) {
        setStatus(t("attachFailed"), true);
        return;
    }

    try {
        const file = new File([record.blob], record.name, { type: "image/gif" });
        const upload = {
            id: `vc-import-${record.id}`,
            file,
            platform: UPLOAD_PLATFORM_WEB,
            origin: "file_picker"
        };

        const result = uploadManager.addFile({
            file: upload,
            channelId,
            draftType: DRAFT_TYPE_CHANNEL_MESSAGE,
            allowOptimization: false
        });
        // Some Discord builds return a promise; never leave it unhandled.
        if (result && typeof result.catch === "function") {
            result.catch((error) => {
                console.error(`${LOG_PREFIX} Failed to attach GIF`, error);
                setStatus(t("attachFailed"), true);
            });
        }
    } catch (error) {
        console.error(`${LOG_PREFIX} Failed to attach GIF`, error);
        setStatus(t("attachFailed"), true);
        return;
    }

    const closed = closePicker();
    focusComposerWhenReady();
    if (!closed) setStatus(t("attached"));
}

async function deleteRecords(records) {
    const deletedIds = new Set();
    for (const record of records) {
        try {
            await removeImport(record.id);
            deletedIds.add(record.id);
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to delete import`, error);
        }
    }

    if (deletedIds.size === 0) return false;

    for (const id of deletedIds) {
        const url = objectUrls.get(id);
        revokeObjectUrl(url);
        objectUrls.delete(id);
    }
    imports = imports.filter((item) => !deletedIds.has(item.id));
    categoryPreviewId = "";
    renderImportedView(true);
    updateCategoryCardContent();
    return true;
}

/** Imports a batch sequentially so the UI stays responsive between files. */
async function handleFiles(files) {
    if (busy || files.length === 0) return;
    busy = true;
    if (button) button.disabled = true;

    let added = 0;
    let failed = 0;
    try {
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            setStatus(
                t("converting", {
                    current: index + 1,
                    total: files.length,
                    name: file.name
                }),
                false,
                true
            );
            try {
                const record = await importFile(file);
                await putImport(record);
                added++;
            } catch (error) {
                failed++;
                console.error(`${LOG_PREFIX} Import failed`, file.name, error);
                setStatus(
                    t("conversionFailed", {
                        name: file.name,
                        message: error?.message || t("conversionFailedGeneric")
                    }),
                    true
                );
                await delay(TIMINGS.importError);
            }
            await yieldToUI();
        }

        await loadImports();
        if (added > 0) {
            openImportedView();
            setStatus(t("importedCount", { count: added }));
        } else if (failed > 0) {
            setStatus(t("noneImported"), true);
        } else {
            setStatus("");
        }
    } finally {
        busy = false;
        if (button) button.disabled = false;
    }
}
