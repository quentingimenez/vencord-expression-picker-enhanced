function getNativeFavoriteEntries() {
    const gifs = getWebpackCommon()?.UserSettingsProtoStore?.frecencyWithoutFetchingLatest?.favoriteGifs?.gifs;
    if (!gifs) return [];

    const entries = [];
    for (const [key, gif] of Object.entries(gifs)) {
        if (!gif) continue;
        const src = gif.src || gif.url || gif.gifSrc;
        if (!src) continue;
        const pathname = toPathname(src);
        if (!pathname) continue;
        try {
            const name = decodeURIComponent(pathname.split("/").pop() || "").toLowerCase();
            if (!name) continue;
            entries.push({ key, pathname, name, width: gif.width, height: gif.height });
        } catch {
            /* Ignore malformed favorite filenames. */
        }
    }
    return entries;
}

const FAVORITE_SIZE_TOLERANCE = 2;

function addToIndex(map, key, value) {
    let values = map.get(key);
    if (!values) {
        values = new Set();
        map.set(key, values);
    }
    values.add(value);
}

/**
 * Matches local imports against native favorites once and exposes the
 * result in the shapes needed by the UI: per import, per URL path, and
 * as a flat list for tests and diagnostics.
 *
 * The maintenance loop calls this repeatedly, so the result is cached
 * until the imports or the native favorites actually change.
 */
let favoriteIndexCache = null;
let favoriteIndexSignature = "";

function buildImportFavoriteIndex() {
    const entries = getNativeFavoriteEntries();
    const importSignature = imports
        .map((record) =>
            record && typeof record === "object" ? `${record.id}:${record.name}:${record.width}:${record.height}` : ""
        )
        .join("|");
    const entrySignature = entries
        .map((entry) => `${entry.key}:${entry.pathname}:${entry.name}:${entry.width}:${entry.height}`)
        .join("|");
    const signature = `${importSignature}::${entrySignature}`;
    if (favoriteIndexCache && signature === favoriteIndexSignature) return favoriteIndexCache;

    const matches = [];
    const byRecordId = new Map();
    const byPath = new Map();

    for (const record of imports) {
        if (!record || typeof record !== "object") continue;
        const name = String(record.name || "").toLowerCase();
        for (const entry of entries) {
            if (entry.name !== name) continue;
            if (entry.width && record.width && Math.abs(entry.width - record.width) > FAVORITE_SIZE_TOLERANCE) continue;
            if (entry.height && record.height && Math.abs(entry.height - record.height) > FAVORITE_SIZE_TOLERANCE)
                continue;

            matches.push({ record, entry });
            addToIndex(byRecordId, record.id, entry.key);

            let pathMatch = byPath.get(entry.pathname);
            if (!pathMatch) {
                pathMatch = { records: [], entries: [] };
                byPath.set(entry.pathname, pathMatch);
            }
            if (!pathMatch.records.includes(record)) pathMatch.records.push(record);
            if (!pathMatch.entries.includes(entry)) pathMatch.entries.push(entry);
        }
    }

    favoriteIndexCache = { matches, byRecordId, byPath };
    favoriteIndexSignature = signature;
    return favoriteIndexCache;
}

function getFavoriteKeysForRecord(record) {
    return [...(buildImportFavoriteIndex().byRecordId.get(record.id) ?? [])];
}

let cachedUnfavoriteAction = null;

function getUnfavoriteAction() {
    if (cachedUnfavoriteAction) return cachedUnfavoriteAction;
    const module = findByProps("Tr", "wg");
    if (typeof module?.Tr === "function") cachedUnfavoriteAction = module.Tr;
    return cachedUnfavoriteAction;
}

const nativeDeleteTargets = new WeakMap();

function createNativeDeleteButton() {
    return createIconAction({
        className: `${NATIVE_CLASSES.favoriteButton} ${NATIVE_CLASSES.gifFavoriteButton} vc-native-delete`,
        label: t("deleteCompletely"),
        icon: TRASH_ICON,
        onActivate(event) {
            event.preventDefault();
            event.stopPropagation();
            const target = nativeDeleteTargets.get(event.currentTarget);
            if (!target) return;
            deleteImportedCompletely(target.records, target.favoriteKeys).catch((error) => {
                console.error(`${LOG_PREFIX} Delete failed`, error);
                setStatus(t("deleteFailed"), true);
            });
        }
    });
}

function maintainNativeDeleteButtons(panel) {
    if (!hasFavoritesView(panel) || imports.length === 0) {
        panel?.querySelectorAll(".vc-native-delete").forEach((button) => button.remove());
        return;
    }

    const { byPath } = buildImportFavoriteIndex();
    const seen = new Set();
    const tiles = panel.querySelectorAll(SELECTORS.rootCards);
    for (const tile of tiles) {
        const media = tile.querySelector("img, video");
        const src = media?.currentSrc || media?.src;
        if (!src) continue;

        const pathname = toPathname(src);
        if (!pathname) continue;

        const match = byPath.get(pathname);
        if (!match) continue;

        seen.add(tile);
        let button = tile.querySelector(".vc-native-delete");
        if (!button) {
            button = createNativeDeleteButton();
            tile.appendChild(button);
        }
        nativeDeleteTargets.set(button, {
            records: match.records,
            favoriteKeys: match.entries.map((entry) => entry.key)
        });
    }

    panel.querySelectorAll(".vc-native-delete").forEach((button) => {
        if (!seen.has(button.parentElement)) button.remove();
    });
}

async function deleteImportedCompletely(records, favoriteKeys) {
    if (!records?.length) return;

    const keys = favoriteKeys ?? [];
    const unfavorite = getUnfavoriteAction();
    let favoriteRemoved = false;
    if (unfavorite) {
        for (const key of new Set(keys)) {
            try {
                unfavorite(key);
                favoriteRemoved = true;
            } catch (error) {
                console.error(`${LOG_PREFIX} Failed to remove native favorite`, error);
            }
        }
    }

    const deleted = await deleteRecords(records);
    if (!deleted) {
        setStatus(t("deleteFailed"), true);
    } else if (favoriteRemoved) {
        setStatus(t("deletedWithFavorite"));
    } else {
        setStatus(t("deleted"));
    }
}
