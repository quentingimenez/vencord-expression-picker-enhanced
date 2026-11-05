"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture, toPlain } = require("./helpers/picker-harness");

describe("height persistence", () => {
    test("clamp keeps values inside the supported range", () => {
        const { resize } = createFixture();

        assert.equal(resize.clamp(500, 320, 5000), 500);
        assert.equal(resize.clamp(100, 320, 5000), 320);
        assert.equal(resize.clamp(9000, 320, 5000), 5000);
        assert.equal(resize.clamp(-1, 0, 10), 0);
    });

    test("round follows Math.round", () => {
        const { resize } = createFixture();

        assert.equal(resize.round(1.4), 1);
        assert.equal(resize.round(1.5), 2);
        assert.equal(resize.round(-1.5), -1);
    });

    test("loadSavedHeight prefers the preload bridge and clamps it", () => {
        const apiFixture = createFixture({ api: { savedHeight: 640 } });
        assert.equal(apiFixture.resize.loadSavedHeight(), 640);

        const lowFixture = createFixture({ api: { savedHeight: 100 } });
        assert.equal(lowFixture.resize.loadSavedHeight(), 320);

        const highFixture = createFixture({ api: { savedHeight: 9000 } });
        assert.equal(highFixture.resize.loadSavedHeight(), 5000);
    });

    test("loadSavedHeight falls back to Vencord settings", () => {
        const fixture = createFixture({
            Vencord: { Settings: { vcExpressionPickerSize: { height: "777" } } }
        });

        assert.equal(fixture.resize.loadSavedHeight(), 777);
    });

    test("loadSavedHeight ignores invalid API and settings values", () => {
        const fixture = createFixture({
            api: { savedHeight: Number.NaN },
            Vencord: { Settings: { vcExpressionPickerSize: { height: "not-a-number" } } }
        });

        assert.equal(fixture.resize.loadSavedHeight(), null);
    });

    test("loadSavedHeight clamps a settings fallback", () => {
        const fixture = createFixture({
            Vencord: { Settings: { vcExpressionPickerSize: { height: 120 } } }
        });

        assert.equal(fixture.resize.loadSavedHeight(), 320);
    });

    test("loadSavedHeight returns null when nothing was saved", () => {
        const fixture = createFixture();
        assert.equal(fixture.resize.loadSavedHeight(), null);
    });

    test("saveHeight rounds, clamps and stores both copies", () => {
        const calls = [];
        const settings = { vcExpressionPickerSize: { width: 498 } };
        const fixture = createFixture({
            api: { saveHeight: (value) => calls.push(value) },
            Vencord: { Settings: settings }
        });

        fixture.resize.saveHeight(777.6);

        assert.deepEqual(calls, [778]);
        assert.deepEqual(toPlain(settings.vcExpressionPickerSize), { width: 498, height: 778 });
        assert.equal(fixture.resize.getSavedHeight(), null);
    });

    test("saveHeight ignores non-finite values", () => {
        const calls = [];
        const settings = {};
        const fixture = createFixture({
            api: { saveHeight: (value) => calls.push(value) },
            Vencord: { Settings: settings }
        });

        fixture.resize.saveHeight(Number.NaN);
        fixture.resize.saveHeight(Infinity);
        fixture.resize.saveHeight(undefined);

        assert.deepEqual(calls, []);
        assert.equal(settings.vcExpressionPickerSize, undefined);
    });

    test("saveHeight clamps out-of-range values", () => {
        const calls = [];
        const settings = {};
        const fixture = createFixture({
            api: { saveHeight: (value) => calls.push(value) },
            Vencord: { Settings: settings }
        });

        fixture.resize.saveHeight(100);
        fixture.resize.saveHeight(99999);

        assert.deepEqual(calls, [320, 5000]);
        assert.equal(settings.vcExpressionPickerSize.height, 5000);
    });

    test("saveHeight still writes settings when the bridge throws", () => {
        const settings = {};
        const fixture = createFixture({
            api: {
                saveHeight() {
                    throw new Error("bridge down");
                }
            },
            Vencord: { Settings: settings }
        });

        assert.doesNotThrow(() => fixture.resize.saveHeight(600));
        assert.equal(settings.vcExpressionPickerSize.height, 600);
        assert.equal(fixture.logs.filter((entry) => entry.level === "error").length, 1);
    });

    test("setDiscordWidth rounds the width and calls Discord's setter", () => {
        const received = [];
        const fixture = createFixture({
            Vencord: {
                Webpack: {
                    findByProps(property) {
                        assert.equal(property, "updatedUnsyncedSettings");
                        return {
                            updatedUnsyncedSettings(value) {
                                received.push(value);
                            }
                        };
                    }
                }
            }
        });

        fixture.resize.setDiscordWidth(641.6);
        assert.deepEqual(toPlain(received), [{ expressionPickerWidth: 642 }]);
    });

    test("setDiscordWidth ignores non-finite values", () => {
        const received = [];
        const fixture = createFixture({
            Vencord: {
                Webpack: {
                    findByProps: () => ({
                        updatedUnsyncedSettings: (value) => received.push(value)
                    })
                }
            }
        });

        fixture.resize.setDiscordWidth(Number.NaN);
        assert.deepEqual(received, []);
    });

    test("setDiscordWidth is a no-op when Discord internals are missing", () => {
        const fixture = createFixture();
        assert.doesNotThrow(() => fixture.resize.setDiscordWidth(640));
    });

    test("applySavedHeight writes a CSS variable instead of an inline style", () => {
        const fixture = createFixture();
        fixture.resize.applySavedHeight(654.4);

        const staticStyle = fixture.document.getElementById("vc-picker-resize-style");
        const varsStyle = fixture.document.getElementById("vc-picker-resize-vars");

        assert.ok(staticStyle);
        assert.match(staticStyle.textContent, /\.vc-picker-resize/);
        assert.ok(varsStyle);
        assert.equal(varsStyle.textContent, ":root { --vc-picker-saved-height: 654px; }");
    });

    test("applySavedHeight ignores non-finite values", () => {
        const fixture = createFixture();
        fixture.resize.applySavedHeight(Number.NaN);

        assert.equal(fixture.document.getElementById("vc-picker-resize-style"), null);
        assert.equal(fixture.document.getElementById("vc-picker-resize-vars"), null);
    });

    test("the initial saved height comes from the preload bridge", () => {
        const fixture = createFixture({ api: { savedHeight: 880 } });
        assert.equal(fixture.resize.getSavedHeight(), 880);
    });
});
