/*
 * Local GIF imports
 * Adds an import button to the GIF page, converts files to GIF and
 * shows them in a dedicated "Imported" category of the GIF picker.
 *
 * This part intentionally shares the outer IIFE with the resize feature:
 * the whole module is injected as one script, so a single scope avoids
 * duplicated guards, helpers and polling timers.
 */

const DB_NAME = "VencordPickerResize";
const DB_VERSION = 1;
const STORE = "gifs";

const MAX_INPUT_BYTES = 100 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 480;
const MAX_DURATION = 6;
const FPS = 10;
const MAX_VIDEO_FRAMES = 60;
const MAX_IMAGE_FRAMES = 120;
const UPLOAD_PLATFORM_WEB = 1;
const DRAFT_TYPE_CHANNEL_MESSAGE = 0;
const GIF_EXTENSIONS = [".gif"];
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".apng", ".bmp"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv", ".m4v"];
const IMAGE_MIME_TYPES = [
    "image/gif",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "image/apng",
    "image/bmp"
];
const VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
const ACCEPT = [
    ...GIF_EXTENSIONS,
    ...IMAGE_EXTENSIONS,
    ...IMAGE_MIME_TYPES,
    ...VIDEO_EXTENSIONS,
    ...VIDEO_MIME_TYPES
].join(",");
