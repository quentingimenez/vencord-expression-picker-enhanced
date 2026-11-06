"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture, SOURCE } = require("./helpers/picker-harness");

describe("source loading", () => {
    test("loads the generated renderer bundle and exposes the test hooks", () => {
        const fixture = createFixture();

        assert.equal(fixture.sandbox.__vcExpressionPickerResizeInstalled, true);
        assert.equal(typeof fixture.resize.clamp, "function");
        assert.equal(typeof fixture.imports.t, "function");
    });

    test("does not run on non-Discord hosts", () => {
        const fixture = createFixture({ hostname: "example.com" });

        assert.deepEqual(fixture.hook, {});
        assert.equal(fixture.sandbox.__vcExpressionPickerResizeInstalled, undefined);
    });

    test("allows an empty hostname during preload", () => {
        const fixture = createFixture({ hostname: "" });

        assert.equal(typeof fixture.resize.initDrawer, "function");
        assert.equal(typeof fixture.imports.importFile, "function");
    });

    test("the runtime constants stay in sync with the documented limits", () => {
        const fixture = createFixture();
        const resize = fixture.resize.constants;
        const imports = fixture.imports.constants;

        assert.equal(resize.MIN_WIDTH, 498);
        assert.equal(resize.MIN_HEIGHT, 320);
        assert.equal(resize.MAX_HEIGHT, 5000);
        assert.equal(resize.TOP_MARGIN, 60);
        assert.equal(imports.MAX_INPUT_BYTES, 100 * 1024 * 1024);
        assert.equal(imports.MAX_OUTPUT_BYTES, 8 * 1024 * 1024);
        assert.equal(imports.MAX_DIMENSION, 480);
        assert.equal(imports.MAX_DURATION, 6);
        assert.equal(imports.FPS, 10);
        assert.equal(imports.MAX_VIDEO_FRAMES, 60);
        assert.equal(imports.MAX_IMAGE_FRAMES, 120);
    });

    test("the accepted file list covers the documented formats", () => {
        const { imports } = createFixture();
        const accepted = imports.constants.ACCEPT.split(",");

        for (const extension of [
            ".gif",
            ".png",
            ".jpg",
            ".jpeg",
            ".webp",
            ".avif",
            ".apng",
            ".bmp",
            ".mp4",
            ".webm",
            ".mov",
            ".mkv",
            ".m4v"
        ]) {
            assert.ok(accepted.includes(extension), `${extension} is missing from ACCEPT`);
        }

        assert.ok(accepted.includes("image/gif"));
        assert.ok(accepted.includes("video/webm"));
    });

    test("the stylesheets contain the picker, resize and import selectors", () => {
        const fixture = createFixture();
        const { STATIC_CSS, IMPORT_CSS } = fixture.imports.constants;

        assert.match(STATIC_CSS, /expressionPickerPositionLayer/);
        assert.match(STATIC_CSS, /--vc-picker-saved-height/);
        assert.match(STATIC_CSS, /\.vc-picker-resize/);
        assert.match(STATIC_CSS, /gif-picker-tab-panel/);
        assert.match(IMPORT_CSS, /\.vc-imported-view/);
        assert.match(IMPORT_CSS, /\.vc-gif-import/);
        assert.match(IMPORT_CSS, /\.vc-native-delete/);
    });

    test("the test hooks are opt-in", () => {
        assert.match(SOURCE, /__VC_PICKER_RESIZE_TEST__/);
        assert.match(SOURCE, /if \(TEST_HOOK\)/);
    });

    test("safeRun isolates a failing integration step", () => {
        const fixture = createFixture();

        const result = fixture.imports.safeRun("explode", () => {
            throw new Error("boom");
        });

        assert.equal(result, undefined);
        assert.ok(
            fixture.logs.some((entry) => String(entry.args[0]).includes("explode failed")),
            "the failure should be logged"
        );
    });

    test("root card detection discovers the current hashed class", () => {
        const fixture = createFixture();
        const card = fixture.document.createElement("div");
        card.className = "result_deadbeef other-class";

        assert.equal(fixture.imports.isRootCard(card), true);
        assert.equal(fixture.imports.getNativeRootCardClass(card), "result_deadbeef");

        const other = fixture.document.createElement("div");
        other.className = "not-a-result";
        assert.equal(fixture.imports.isRootCard(other), false);
        assert.equal(fixture.imports.getNativeRootCardClass(other), "result__2dc39");
    });
});
