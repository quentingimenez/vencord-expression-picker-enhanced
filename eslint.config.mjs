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
    require: "readonly"
};

export default [
    {
        ignores: ["dist/**", "node_modules/**", "assets/**"]
    },
    {
        files: ["src/**/*.js"],
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
        files: ["*.mjs", "*.js"],
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
