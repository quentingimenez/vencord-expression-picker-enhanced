import js from "@eslint/js";

const browserGlobals = {
    Blob: "readonly",
    File: "readonly",
    Image: "readonly",
    ImageDecoder: "readonly",
    MutationObserver: "readonly",
    Node: "readonly",
    ResizeObserver: "readonly",
    URL: "readonly",
    clearInterval: "readonly",
    clearTimeout: "readonly",
    console: "readonly",
    createImageBitmap: "readonly",
    crypto: "readonly",
    document: "readonly",
    indexedDB: "readonly",
    location: "readonly",
    navigator: "readonly",
    queueMicrotask: "readonly",
    requestAnimationFrame: "readonly",
    setInterval: "readonly",
    setTimeout: "readonly",
    window: "readonly"
};

const nodeGlobals = {
    ...browserGlobals,
    __dirname: "readonly",
    Buffer: "readonly",
    module: "readonly",
    process: "readonly",
    require: "readonly",
    setImmediate: "readonly"
};

export default [
    {
        ignores: ["node_modules/**", "assets/**"]
    },
    {
        // The fragments are concatenated into one IIFE, so cross-fragment
        // symbols are intentionally undefined in a single file. The generated
        // bundle is linted with no-undef/no-unused-vars enabled below.
        files: ["src/renderer/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "script",
            globals: {
                ...browserGlobals,
                Gifenc: "readonly"
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-undef": "off",
            "no-unused-vars": "off"
        }
    },
    {
        files: ["dist/picker-resize.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "script",
            globals: {
                ...browserGlobals,
                Gifenc: "readonly"
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrors: "none" }]
        }
    },
    {
        files: ["src/loader.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "script",
            globals: nodeGlobals
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrors: "none" }]
        }
    },
    {
        files: ["scripts/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: nodeGlobals
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrors: "none" }]
        }
    },
    {
        files: ["tests/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: nodeGlobals
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrors: "none" }]
        }
    },
    {
        files: ["*.mjs"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: nodeGlobals
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrors: "none" }]
        }
    }
];
