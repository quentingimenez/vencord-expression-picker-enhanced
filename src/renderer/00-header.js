/*
 * Vencord - Expression Picker Enhanced
 *
 * Adds a top-left resize handle to Discord's expression picker
 * (GIF / stickers / emoji), remembers its height, imports local GIFs and
 * keeps the last opened category.
 *
 * Width is persisted by Discord itself (expressionPickerWidth).
 * Height is stored in size.json next to the installed renderer. On Windows
 * that is %LOCALAPPDATA%\VencordPickerResize; on macOS and Linux it is
 * <Vencord>/picker-resize.
 *
 * Loaded in the renderer main world by a small loader appended to
 * Vencord's preload.js. The loader also exposes VencordPickerResize
 * so the saved height is known before the picker is created (no flash).
 *
 * Architecture note: this is intentionally a single injected file because
 * the preload loader executes one script in the page world. The feature code
 * lives in one IIFE so the resize and import features can share:
 *   - one host/install guard and one test hook;
 *   - DOM selectors, style injection and activation helpers;
 *   - localization, clamping and logging utilities;
 *   - a single maintenance timer instead of one timer per feature.
 * The vendored `gifenc` block stays outside the IIFE; it is minified and must
 * not be reformatted or edited directly.
 */
