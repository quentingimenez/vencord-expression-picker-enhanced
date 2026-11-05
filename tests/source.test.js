"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture, SOURCE } = require("./helpers/picker-harness");

describe("source loading", () => {
    test("loads both renderer modules and exposes the test hooks", () => {
        const fixture = createFixture();

        assert.equal(fixture.sandbox.__vcExpressionPickerResizeInstalled, true);
        assert.equal(fixture.sandbox.__vcPickerImportInstalled, true);
        assert.equal(typeof fixture.resize.clamp, "function");
        assert.equal(typeof fixture.imports.t, "function");
    });

    test("does not run on non-Discord hosts", () => {
        const fixture = createFixture({ hostname: "example.com" });

        assert.deepEqual(fixture.hook, {});
        assert.equal(fixture.sandbox.__vcExpressionPickerResizeInstalled, undefined);
        assert.equal(fixture.sandbox.__vcPickerImportInstalled, undefined);
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
            ".mkv"
        ]) {
            assert.ok(accepted.includes(extension), `${extension} is missing from ACCEPT`);
        }

        assert.ok(accepted.includes("image/gif"));
        assert.ok(accepted.includes("video/webm"));
    });

    test("the stylesheet contains the picker, resize and import selectors", () => {
        assert.match(SOURCE, /expressionPickerPositionLayer/);
        assert.match(SOURCE, /--vc-picker-saved-height/);
        assert.match(SOURCE, /HANDLE_CLASS = "vc-picker-resize"/);
        assert.match(SOURCE, /gif-picker-tab-panel/);
        assert.match(SOURCE, /\.vc-imported-view/);
        assert.match(SOURCE, /\.vc-gif-import/);
        assert.match(SOURCE, /\.vc-native-delete/);
    });

    test("the test hooks are opt-in", () => {
        assert.match(SOURCE, /__VC_PICKER_RESIZE_TEST__/);
        assert.match(SOURCE, /if \(TEST_HOOK\)/);
    });
});
