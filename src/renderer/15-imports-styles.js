// Styles for the import UI, injected once next to the resize styles.
const IMPORT_CSS = `
.vc-gif-import {
    position: absolute;
    top: 16px;
    right: 14px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--interactive-text-default);
    cursor: pointer;
    opacity: 0.75;
    transition: opacity 0.15s, background-color 0.15s, color 0.15s;
}
.vc-gif-import:hover {
    opacity: 1;
    background: var(--background-mod-subtle);
    color: var(--interactive-text-hover);
}
.vc-gif-import:disabled {
    opacity: 0.4;
    cursor: default;
}
.vc-gif-import svg {
    width: 16px;
    height: 16px;
    pointer-events: none;
}
.vc-imported-category {
    position: absolute;
    overflow: hidden;
    border-radius: 4px;
    background: linear-gradient(135deg, #5865f2 0%, #eb459e 100%);
    cursor: pointer;
}
.vc-imported-category-preview {
    position: absolute;
    inset: 0;
    display: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.vc-imported-category-fade {
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: rgba(88, 101, 242, 0.8);
    pointer-events: none;
}
.vc-imported-category-text {
    position: absolute;
    inset-inline-start: 8px;
    bottom: 8px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: calc(100% - 16px);
    color: #fff;
    font: 600 13px/16px var(--font-primary, sans-serif);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    pointer-events: none;
}
.vc-imported-category-text svg {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
}
.vc-imported-category-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.vc-imported-category-count {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font: 600 11px/1 var(--font-primary, sans-serif);
    pointer-events: none;
}
.vc-imported-view {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: flex;
    flex-direction: column;
    background: var(--background-base-low, var(--background-base-lower));
    color: var(--text-default);
}
.vc-imported-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 0 0 auto;
    min-height: 53px;
    padding: 0 16px 12px;
    box-sizing: border-box;
    background: var(--background-surface-high);
    border-bottom: 1px solid var(--border-subtle);
}
.vc-imported-back {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: var(--interactive-text-default);
    cursor: pointer;
}
.vc-imported-back:hover {
    color: var(--interactive-text-hover);
    background: var(--background-mod-subtle);
}
.vc-imported-back svg {
    width: 24px;
    height: 24px;
}
.vc-imported-title {
    margin: 0;
    color: var(--text-strong, var(--text-default));
    font: 600 16px/20px var(--font-primary, sans-serif);
}
.vc-imported-count {
    flex: 0 0 auto;
    color: var(--text-muted);
    font: 500 12px/16px var(--font-primary, sans-serif);
}
.vc-imported-search {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    height: 40px;
    box-sizing: border-box;
    padding-left: 4px;
    border: 1px solid var(--input-border-default, transparent);
    border-radius: 8px;
    background: var(--input-background-default, var(--background-base-lowest));
}
.vc-imported-search:focus-within {
    border-color: var(--input-border-active, var(--border-focus));
    outline: 2px solid var(--input-border-active, var(--border-focus));
    outline-offset: -2px;
}
.vc-imported-search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 30px;
    height: 30px;
    color: var(--icon-strong);
}
.vc-imported-search-icon svg {
    width: 16px;
    height: 16px;
}
.vc-imported-search-input {
    flex: 1 1 auto;
    min-width: 0;
    height: 38px;
    padding: 1px 8px 1px 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text-default);
    font: 400 16px/20px var(--font-primary, sans-serif);
}
.vc-imported-search-input::placeholder {
    color: var(--text-muted);
}
.vc-imported-search-clear {
    display: none;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 30px;
    height: 30px;
    color: var(--text-muted);
    cursor: pointer;
}
.vc-imported-search-clear[data-visible="true"] {
    display: flex;
}
.vc-imported-search-clear:hover {
    color: var(--text-default);
}
.vc-imported-search-clear svg {
    width: 16px;
    height: 16px;
}
.vc-imported-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 12px 0;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: var(--background-surface-high) transparent;
}
.vc-imported-scroll::-webkit-scrollbar {
    width: 8px;
}
.vc-imported-scroll::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: var(--background-surface-high);
}
.vc-imported-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.vc-imported-grid {
    position: relative;
    display: block;
    width: 100%;
}
.vc-imported-tile {
    position: absolute;
    border-radius: 6px;
    overflow: hidden;
    background: var(--background-mod-subtle);
}
.vc-imported-add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0;
    border: 1px dashed var(--border-subtle);
    background: var(--background-base-lower);
    color: var(--text-muted);
    cursor: pointer;
    font: 500 13px/16px var(--font-primary, sans-serif);
    transition: border-color 0.12s, background-color 0.12s, color 0.12s;
}
.vc-imported-add:hover {
    border-color: var(--brand-500, #5865f2);
    background: var(--background-mod-subtle);
    color: var(--text-default);
}
.vc-imported-add:disabled {
    opacity: 0.5;
    cursor: default;
}
.vc-imported-add-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}
.vc-imported-add-icon svg {
    width: 26px;
    height: 26px;
}
.vc-imported-attach {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}
.vc-imported-attach img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.vc-imported-attach:hover {
    outline: 2px solid var(--border-focus);
    outline-offset: -2px;
}
.vc-imported-favorite,
.vc-imported-delete,
.vc-native-delete {
    position: absolute;
    top: 8px;
    inset-inline-end: 8px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.12s, color 0.12s, background-color 0.12s;
}
.vc-imported-delete,
.vc-native-delete {
    inset-inline-end: 40px;
}
.vc-imported-favorite svg,
.vc-imported-delete svg,
.vc-native-delete svg {
    width: 16px;
    height: 16px;
    pointer-events: none;
}
.vc-imported-tile:hover .vc-imported-delete,
.vc-imported-tile:hover .vc-imported-favorite,
.vc-imported-tile:focus-within .vc-imported-delete,
.vc-imported-tile:focus-within .vc-imported-favorite,
[class*="result_"]:hover .vc-native-delete,
[class*="result_"]:focus-within .vc-native-delete {
    opacity: 1;
    transform: none;
}
.vc-imported-delete:hover,
.vc-imported-delete:focus {
    color: var(--status-danger);
}
.vc-imported-favorite[aria-pressed="true"] {
    color: var(--yellow-300);
}
.vc-imported-favorite:hover,
.vc-imported-favorite:focus {
    color: var(--yellow-300);
}
@media (hover: none) {
    .vc-imported-delete,
    .vc-imported-favorite,
    .vc-native-delete {
        opacity: 1;
        transform: none;
    }
}
.vc-imported-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 100%;
    min-height: 180px;
    color: var(--text-muted);
    text-align: center;
    font: 500 14px/18px var(--font-primary, sans-serif);
}
.vc-native-delete:hover,
.vc-native-delete:focus {
    color: var(--status-danger);
}
.vc-import-status {
    position: absolute;
    top: 48px;
    right: 14px;
    z-index: 11;
    max-width: 320px;
    padding: 6px 10px;
    border-radius: 4px;
    background: var(--background-surface-high);
    box-shadow: var(--shadow-high);
    color: var(--text-default);
    font: 500 12px/16px var(--font-primary, sans-serif);
    pointer-events: none;
}
.vc-import-status[data-error="true"] {
    color: var(--text-feedback-critical);
}
`;

function ensureImportStyle() {
    injectStyle(IMPORT_STYLE_ID, IMPORT_CSS);
}
