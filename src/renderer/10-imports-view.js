function createImportedView() {
    const view = document.createElement("div");
    view.className = "vc-imported-view";
    view.setAttribute("role", "region");
    view.setAttribute("aria-label", t("categoryName"));
    view.innerHTML = `
            <div class="vc-imported-header">
                <div class="vc-imported-back" role="button" tabindex="0" aria-label="${t("back")}">${BACK_ICON}</div>
                <h3 class="vc-imported-title">${t("categoryName")}</h3>
                <span class="vc-imported-count"></span>
                <div class="vc-imported-search">
                    <div class="vc-imported-search-icon">${SEARCH_ICON}</div>
                    <input class="vc-imported-search-input" type="text" role="searchbox"
                        placeholder="${t("searchPlaceholder")}"
                        aria-label="${t("searchPlaceholder")}">
                    <div class="vc-imported-search-clear" role="button" tabindex="0"
                        aria-label="${t("clear")}" data-visible="false">${CLEAR_ICON}</div>
                </div>
            </div>
            <div class="vc-imported-scroll">
                <div class="vc-imported-grid"></div>
                <div class="vc-imported-empty">
                    <span>${t("emptyImports")}</span>
                </div>
            </div>`;

    const back = view.querySelector(".vc-imported-back");
    const close = (event) => {
        event.preventDefault();
        event.stopPropagation();
        finishRestore();
        closeImportedView();
        saveLastView({ type: "root" });
        document.querySelector(SELECTORS.nativeBackButton)?.click();
    };
    addActivationHandler(back, close);

    const searchInput = view.querySelector(".vc-imported-search-input");
    const clearButton = view.querySelector(".vc-imported-search-clear");
    searchInput.value = importedQuery;
    const syncClear = () => {
        clearButton.dataset.visible = searchInput.value ? "true" : "false";
    };
    const runSearch = () => {
        importedQuery = searchInput.value;
        syncClear();
        clearTimeout(importedSearchTimer);
        importedSearchTimer = setTimeout(() => {
            importedSearchTimer = 0;
            renderImportedView(true);
        }, TIMINGS.searchDebounce);
    };
    const renderSearchNow = () => {
        clearTimeout(importedSearchTimer);
        importedSearchTimer = 0;
        renderImportedView(true);
    };
    searchInput.addEventListener("input", runSearch);
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && searchInput.value) {
            event.preventDefault();
            searchInput.value = "";
            importedQuery = "";
            syncClear();
            renderSearchNow();
        }
    });

    const clear = (event) => {
        event.preventDefault();
        event.stopPropagation();
        searchInput.value = "";
        importedQuery = "";
        syncClear();
        renderSearchNow();
        searchInput.focus();
    };
    addActivationHandler(clearButton, clear);
    syncClear();

    return view;
}

/** Renders the imported category, reusing the DOM when nothing changed. */
function renderImportedView(force = false) {
    if (!overlay?.isConnected) return;

    const grid = overlay.querySelector(".vc-imported-grid");
    const empty = overlay.querySelector(".vc-imported-empty");
    const count = overlay.querySelector(".vc-imported-count");
    if (!grid || !empty || !count) return;

    const { byRecordId: favoriteKeysById } = buildImportFavoriteIndex();
    const key = imports
        .filter((record) => record && typeof record === "object")
        .map((record) => `${record.id ?? ""}:${favoriteKeysById.has(record.id) ? "1" : "0"}`)
        .join("|");
    if (!force && key === overlayKey) return;
    overlayKey = key;

    const query = importedQuery.trim().toLowerCase();
    const visibleImports = imports
        .filter((record) => record && typeof record === "object")
        .filter((record) =>
            query
                ? String(record.name || "")
                      .toLowerCase()
                      .includes(query)
                : true
        );

    if (imports.length === 0) {
        count.textContent = "";
    } else if (query) {
        count.textContent = t("countResults", { count: visibleImports.length });
    } else {
        count.textContent = t("countGifs", { count: imports.length });
    }

    const emptyLabel = empty.querySelector("span");
    if (emptyLabel) {
        emptyLabel.textContent = query ? t("noResults", { query: importedQuery.trim() }) : t("emptyImports");
    }
    empty.style.display = visibleImports.length === 0 ? "flex" : "none";
    grid.textContent = "";

    if (!query) {
        const addTile = document.createElement("button");
        addTile.type = "button";
        addTile.className = "vc-imported-tile vc-imported-add";
        addTile.dataset.aspect = "1";
        addTile.setAttribute("aria-label", t("importButton"));
        addTile.innerHTML = `
                <span class="vc-imported-add-icon">${UPLOAD_ICON}</span>
                <span class="vc-imported-add-label">${t("importTile")}</span>`;
        addTile.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!busy) input?.click();
        });
        grid.appendChild(addTile);
    }

    for (const record of visibleImports) {
        const tile = document.createElement("div");
        tile.className = "vc-imported-tile";
        tile.dataset.aspect = record.width && record.height ? String(record.height / record.width) : "1";

        const attach = document.createElement("button");
        attach.type = "button";
        attach.className = "vc-imported-attach";
        attach.setAttribute("aria-label", t("addToMessage", { name: record.name }));

        const image = document.createElement("img");
        image.src = objectUrls.get(record.id) || "";
        image.alt = "";
        image.loading = "lazy";
        image.draggable = false;
        attach.appendChild(image);
        attach.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            attachToComposer(record);
        });

        const favoriteKeys = favoriteKeysById.get(record.id);
        const isFavorite = !!favoriteKeys?.size;

        const favorite = createIconAction({
            className: `${NATIVE_CLASSES.favoriteButton} ${NATIVE_CLASSES.gifFavoriteButton} vc-imported-favorite${
                isFavorite ? ` ${NATIVE_CLASSES.selected}` : ""
            }`,
            label: isFavorite ? t("removeFavorite") : t("addFavorite"),
            icon: STAR_ICON,
            pressed: isFavorite,
            onActivate(event) {
                event.preventDefault();
                event.stopPropagation();
                const keys = getFavoriteKeysForRecord(record);
                if (keys.length === 0) {
                    setStatus(t("favoriteNeedsSend"));
                    return;
                }

                const unfavorite = getUnfavoriteAction();
                if (!unfavorite) {
                    setStatus(t("favoriteFailed"), true);
                    return;
                }

                for (const key of keys) {
                    try {
                        unfavorite(key);
                    } catch (error) {
                        console.error(`${LOG_PREFIX} Failed to remove favorite`, error);
                    }
                }
                setStatus(t("favoriteRemoved"));
                setTimeout(() => renderImportedView(true), TIMINGS.favoriteRefresh);
            }
        });

        const remove = createIconAction({
            className: `${NATIVE_CLASSES.favoriteButton} ${NATIVE_CLASSES.gifFavoriteButton} vc-imported-delete`,
            label: t("deleteImport", { name: record.name }),
            icon: TRASH_ICON,
            onActivate(event) {
                event.preventDefault();
                event.stopPropagation();
                deleteImportedCompletely([record], getFavoriteKeysForRecord(record)).catch((error) => {
                    console.error(`${LOG_PREFIX} Delete failed`, error);
                    setStatus(t("deleteFailed"), true);
                });
            }
        });

        tile.append(attach, favorite, remove);
        grid.appendChild(tile);
    }

    layoutImportedTiles(true);
}

/** Lays out imported tiles in a balanced masonry grid. */
function layoutImportedTiles(force = false) {
    if (!overlay?.isConnected) return;
    const grid = overlay.querySelector(".vc-imported-grid");
    if (!grid) return;
    const tiles = [...grid.children];

    const containerWidth = overlay.clientWidth;
    if (!Number.isFinite(containerWidth) || containerWidth <= 0) return;

    if (tiles.length === 0) {
        grid.style.width = `${containerWidth}px`;
        grid.style.height = "0px";
        return;
    }
    if (!force && containerWidth === overlayLayoutWidth) return;
    overlayLayoutWidth = containerWidth;

    const columns = clamp(Math.floor(containerWidth / DESIRED_TILE_WIDTH), 1, MAX_COLUMNS);
    const tileWidth = Math.max(1, (containerWidth - GRID_GAP * 2 - (columns - 1) * GRID_GAP) / columns);
    const heights = new Array(columns).fill(0);

    for (const tile of tiles) {
        let column = 0;
        for (let index = 1; index < columns; index++) {
            if (heights[index] < heights[column]) column = index;
        }

        const ratio = parseFloat(tile.dataset.aspect) || 1;
        const height = Math.round(tileWidth * ratio * 1000) / 1000;
        tile.style.position = "absolute";
        tile.style.left = `${GRID_GAP + column * (tileWidth + GRID_GAP)}px`;
        tile.style.top = `${heights[column]}px`;
        tile.style.width = `${tileWidth}px`;
        tile.style.height = `${height}px`;
        heights[column] += height + GRID_GAP;
    }

    grid.style.width = `${containerWidth}px`;
    grid.style.height = `${Math.max(0, Math.max(...heights) - GRID_GAP)}px`;
}

function openImportedView() {
    const panel = findPanel();
    if (!panel) return;
    finishRestore();
    saveLastView({ type: "imports" });
    importedView = true;
    maintainImportedView(panel);
    requestAnimationFrame(() => {
        safeRun("focus import search", () => overlay?.querySelector(".vc-imported-search-input")?.focus());
    });
}

function closeImportedView() {
    importedView = false;
    importedQuery = "";
    clearTimeout(importedSearchTimer);
    importedSearchTimer = 0;
    overlay?.remove();
    overlay = null;
    overlayKey = null;
    overlayLayoutWidth = 0;
}

function maintainImportedView(panel) {
    if (!importedView || !panel) {
        closeImportedView();
        return;
    }

    if (!overlay || !overlay.isConnected || overlay.parentElement !== panel) {
        overlay?.remove();
        overlay = createImportedView();
        panel.appendChild(overlay);
        overlayKey = null;
        overlayLayoutWidth = 0;
    }

    renderImportedView(false);
    layoutImportedTiles();
}
