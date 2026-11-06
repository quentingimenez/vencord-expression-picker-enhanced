// Allow an empty hostname (preload can run before navigation) but
// don't run in the Monaco editor window or other remote pages.
const isDiscordHost = !location.hostname || /(^|\.)(discord\.com|discordapp\.com)$/i.test(location.hostname);

// Both features used to be separate IIFEs. They now live in a single
// bootstrap so they can share utilities, constants and a single timer.
const INSTALL_FLAG = "__vcExpressionPickerResizeInstalled";

// The Node test suite sets this object to load the helpers without
// starting any observer, timer or DOM mutation.
const TEST_HOOK = window.__VC_PICKER_RESIZE_TEST__ ?? null;
