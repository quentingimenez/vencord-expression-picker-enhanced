/** Returns true when the current category header already matches the target label. */
function isCurrentCategory(panel, label) {
    return [...panel.querySelectorAll(SELECTORS.categoryLabel)].some((element) => {
        const text = element.textContent?.trim();
        const matches = text === label || element.getAttribute?.("aria-label") === label;
        if (!matches) return false;
        // A category card left in a hidden root grid is not the current view.
        return !element.closest?.(SELECTORS.rootCards);
    });
}

function tryRestore(panel) {
    if (!restorePending) return;
    if (Date.now() > restoreDeadline) {
        finishRestore();
        return;
    }
    if (!panel) return;

    const target = restoreTarget || lastView;
    const backButton = panel.querySelector(SELECTORS.nativeBackButton);
    const hasBack = !!backButton;
    const favoritesView = hasFavoritesView(panel);
    const searchValue = panel.querySelector(SELECTORS.searchInput)?.value?.trim() || "";
    const favoritesCard = findRootGrid(panel)?.favoritesCard;

    if (target.type === "imports") {
        finishRestore();
        openImportedView();
        return;
    }

    if (target.type === "favorites") {
        if (!hasBack) {
            if (favoritesCard) {
                finishRestore();
                clickForRestore(favoritesCard);
            }
            return;
        }
        if (favoritesView) {
            finishRestore();
            return;
        }
        clickForRestore(backButton);
        return;
    }

    if (target.type === "root") {
        if (!hasBack) {
            if (favoritesCard) {
                finishRestore();
                return;
            }
            const clearButton = panel.querySelector(SELECTORS.clearButton);
            if (searchValue && clearButton) {
                clickForRestore(clearButton);
                return;
            }
            finishRestore();
            return;
        }
        clickForRestore(backButton);
        return;
    }

    if (target.type === "category") {
        if (!hasBack) {
            const card = [...panel.querySelectorAll(SELECTORS.rootCards)].find(
                (item) => item.getAttribute("aria-label") === target.label
            );
            if (card) {
                finishRestore();
                clickForRestore(card);
            }
            return;
        }
        if (isCurrentCategory(panel, target.label)) {
            finishRestore();
            return;
        }
        clickForRestore(backButton);
    }
}

function trackNativeBackButton(panel) {
    const backButton = panel?.querySelector(SELECTORS.nativeBackButton);
    if (!backButton || backButton.dataset.vcViewTracking) return;
    backButton.dataset.vcViewTracking = "1";
    backButton.addEventListener("click", () => handleViewTracking({ type: "root" }), true);
}

function findRootGrid(panel) {
    const cards = panel?.querySelectorAll(SELECTORS.rootCards);
    if (!cards || cards.length === 0) return null;
    const favoritesCard = cards[0];
    if (!favoritesCard.querySelector(SELECTORS.categoryLabel)) return null;
    const wrapper = favoritesCard.parentElement;
    if (!wrapper) return null;
    return { favoritesCard, wrapper };
}

function isRootGifView(panel) {
    if (!panel || panel.querySelector(SELECTORS.nativeBackButton)) return false;
    const search = panel.querySelector(SELECTORS.searchInput);
    if (search && search.value.trim()) return false;
    return !!findRootGrid(panel);
}

function reflowRootGrid(wrapper) {
    const cards = [...wrapper.children].filter(isRootCard);
    if (cards.length === 0) return;

    const containerWidth = wrapper.clientWidth || wrapper.parentElement?.clientWidth || 806;
    const columns = clamp(Math.floor(containerWidth / DESIRED_TILE_WIDTH), 1, MAX_ROOT_COLUMNS);
    const tileWidth = Math.max(1, (containerWidth - GRID_GAP * 2 - (columns - 1) * GRID_GAP) / columns);

    // The wrapper is intentionally never shrunk: Discord uses it as a
    // scroll area and a smaller height would clip the last row.
    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        const left = `${GRID_GAP + (index % columns) * (tileWidth + GRID_GAP)}px`;
        const top = `${Math.floor(index / columns) * (ROOT_TILE_HEIGHT + GRID_GAP)}px`;
        const width = `${tileWidth}px`;
        const height = `${ROOT_TILE_HEIGHT}px`;
        if (card.style.position !== "absolute") card.style.position = "absolute";
        if (card.style.left !== left) card.style.left = left;
        if (card.style.top !== top) card.style.top = top;
        if (card.style.width !== width) card.style.width = width;
        if (card.style.height !== height) card.style.height = height;
    }

    const rows = Math.ceil(cards.length / columns);
    const needed = rows * (ROOT_TILE_HEIGHT + GRID_GAP) - GRID_GAP;
    const current = parseFloat(wrapper.style.height) || 0;
    if (current < needed) wrapper.style.height = `${needed}px`;
}

function ensureInput() {
    if (!document.body) return;
    if (input?.isConnected) return;
    input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ACCEPT;
    input.className = "vc-import-input";
    input.style.display = "none";
    input.addEventListener("change", () => {
        const files = [...(input.files || [])];
        input.value = "";
        handleFiles(files).catch((error) => {
            console.error(`${LOG_PREFIX} Import batch failed`, error);
        });
    });
    document.body.appendChild(input);
}

function ensureButton() {
    if (button?.isConnected) return button;

    button = document.createElement("button");
    button.type = "button";
    button.className = "vc-gif-import";
    button.title = t("importButton");
    button.setAttribute("aria-label", t("importButton"));
    button.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v4h14v-4"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!busy) input?.click();
    });
    drawer.appendChild(button);
    return button;
}

function ensureStatus() {
    if (statusEl?.isConnected) return statusEl;
    statusEl = document.createElement("div");
    statusEl.className = "vc-import-status";
    statusEl.setAttribute("role", "status");
    statusEl.setAttribute("aria-live", "polite");
    statusEl.style.display = "none";
    drawer.appendChild(statusEl);
    return statusEl;
}

function setStatus(text, isError = false, keep = false) {
    if (!drawer?.isConnected) return;
    const el = safeRun("status element", ensureStatus);
    if (!el) return;

    clearTimeout(statusTimer);
    el.textContent = text;
    el.dataset.error = isError ? "true" : "false";
    el.style.display = text ? "block" : "none";
    if (text && !keep) {
        statusTimer = setTimeout(() => {
            if (statusEl) statusEl.style.display = "none";
        }, TIMINGS.status);
    }
}

function createCategoryCard(nativeClass = SELECTORS.rootCardClass) {
    const card = document.createElement("div");
    card.className = `${nativeClass} vc-imported-category`;
    card.style.position = "absolute";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", t("categoryName"));
    card.innerHTML = `
            <img class="vc-imported-category-preview" alt="" draggable="false">
            <div class="vc-imported-category-fade"></div>
            <div class="${NATIVE_CLASSES.categoryText} vc-imported-category-text">
                ${UPLOAD_ICON}
                <span class="${NATIVE_CLASSES.categoryName} vc-imported-category-name">${t("categoryName")}</span>
            </div>
            <span class="vc-imported-category-count"></span>`;

    const open = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openImportedView();
    };
    addActivationHandler(card, open);
    return card;
}

function updateCategoryCardContent() {
    if (!categoryCard?.isConnected) return;

    const latest = imports[0] ?? null;
    const preview = categoryCard.querySelector(".vc-imported-category-preview");
    if (preview) {
        if (latest) {
            if (categoryPreviewId !== latest.id) {
                categoryPreviewId = latest.id;
                preview.src = objectUrls.get(latest.id) || "";
            }
            preview.style.display = "block";
        } else {
            categoryPreviewId = "";
            preview.removeAttribute("src");
            preview.style.display = "none";
        }
    }

    const count = categoryCard.querySelector(".vc-imported-category-count");
    if (count) {
        const countText = imports.length > 0 ? String(imports.length) : "";
        if (count.textContent !== countText) count.textContent = countText;
        count.style.display = imports.length > 0 ? "flex" : "none";
    }
}

function removeCategoryCard() {
    if (!categoryCard) return;
    const wrapper = categoryCard.parentElement;
    categoryCard.remove();
    if (wrapper) {
        const first = wrapper.firstElementChild;
        const cards = [...wrapper.children].filter(isRootCard);
        const firstHeight = parseFloat(first?.style.height) || 0;
        const uniform = cards.every((card) => Math.abs((parseFloat(card.style.height) || 0) - firstHeight) < 0.5);
        if (first?.querySelector(SELECTORS.categoryLabel) && uniform) {
            reflowRootGrid(wrapper);
        }
    }
}

function maintainCategoryCard(panel) {
    if (!isRootGifView(panel)) {
        removeCategoryCard();
        return;
    }

    const grid = findRootGrid(panel);
    if (!grid) {
        removeCategoryCard();
        return;
    }

    if (!categoryCard) {
        categoryCard = createCategoryCard(getNativeRootCardClass(grid.favoritesCard));
    } else {
        const nativeClass = getNativeRootCardClass(grid.favoritesCard);
        if (!getClassNames(categoryCard).includes(nativeClass)) {
            // Discord renamed the hashed card class since the card was
            // created; copy the new one so the native styling still applies.
            categoryCard.className = `${nativeClass} vc-imported-category`;
        }
    }
    if (
        !categoryCard.isConnected ||
        categoryCard.parentElement !== grid.wrapper ||
        grid.favoritesCard.nextElementSibling !== categoryCard
    ) {
        grid.favoritesCard.after(categoryCard);
    }

    for (const card of grid.wrapper.children) {
        if (card === categoryCard || !isRootCard(card) || card.dataset.vcViewTracking) continue;
        card.dataset.vcViewTracking = "1";
        card.addEventListener("click", () => {
            safeRun("track category view", () => {
                if (card === grid.wrapper.firstElementChild) {
                    handleViewTracking({ type: "favorites" });
                    return;
                }
                const label = card.getAttribute("aria-label");
                if (label) handleViewTracking({ type: "category", label });
            });
        });
    }

    updateCategoryCardContent();
    reflowRootGrid(grid.wrapper);
}
