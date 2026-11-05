"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture, toPlain } = require("./helpers/picker-harness");

function createDrawer(fixture, rect) {
    const parent = fixture.document.createElement("div");
    parent.rect = {
        width: 1000,
        height: 800,
        top: 0,
        right: 1000,
        bottom: 800,
        left: 0
    };

    const drawer = fixture.document.createElement("div");
    drawer.rect = { ...rect };
    drawer.parentElement = parent;
    return { drawer, parent };
}

describe("resize grip", () => {
    test("initDrawer applies the saved height and creates the grip", () => {
        const fixture = createFixture({
            locale: "fr",
            api: { savedHeight: 600 },
            Vencord: { Settings: {} }
        });
        const { drawer } = createDrawer(fixture, {
            width: 700,
            height: 600,
            top: 100,
            right: 1000,
            bottom: 700,
            left: 300
        });

        fixture.resize.initDrawer(drawer);

        assert.equal(drawer.style.height, "600px");
        assert.equal(drawer.children.length, 1);
        const handle = drawer.children[0];
        assert.equal(handle.className, "vc-picker-resize");
        assert.equal(handle.getAttribute("role"), "button");
        assert.equal(handle.getAttribute("aria-label"), "Redimensionner la fenêtre");
        assert.equal(handle.title, "Redimensionner");
        assert.match(handle.innerHTML, /<svg/);
    });

    test("initDrawer is idempotent", () => {
        const fixture = createFixture({ Vencord: { Settings: {} } });
        const { drawer } = createDrawer(fixture, {
            width: 700,
            height: 400,
            top: 300,
            right: 1000,
            bottom: 700,
            left: 300
        });

        fixture.resize.initDrawer(drawer);
        fixture.resize.initDrawer(drawer);

        assert.equal(drawer.children.length, 1);
    });

    test("dragging updates both dimensions and persists them", () => {
        const savedHeights = [];
        const widths = [];
        const settings = {};
        const fixture = createFixture({
            api: {
                savedHeight: 600,
                saveHeight: (height) => savedHeights.push(height)
            },
            Vencord: {
                Settings: settings,
                Webpack: {
                    findByProps: () => ({
                        updatedUnsyncedSettings: (value) => widths.push(value)
                    })
                }
            }
        });
        const { drawer } = createDrawer(fixture, {
            width: 600,
            height: 400,
            top: 300,
            right: 900,
            bottom: 700,
            left: 300
        });

        fixture.resize.initDrawer(drawer);
        const handle = drawer.children[0];

        const down = handle.dispatch("pointerdown", {
            button: 0,
            pointerId: 7,
            clientX: 400,
            clientY: 500
        });
        assert.equal(down.defaultPrevented, true);
        assert.equal(down.propagationStopped, true);
        assert.equal(handle.classList.contains("active"), true);
        assert.equal(handle.capturedPointerId, 7);

        handle.dispatch("pointermove", {
            pointerId: 7,
            clientX: 340,
            clientY: 430
        });
        assert.equal(drawer.style.width, "660px");
        assert.equal(drawer.style.height, "470px");

        drawer.rect = {
            width: 660,
            height: 470,
            top: 230,
            right: 900,
            bottom: 700,
            left: 240
        };
        handle.dispatch("pointerup", { pointerId: 7 });

        assert.equal(handle.classList.contains("active"), false);
        assert.equal(handle.capturedPointerId, null);
        assert.deepEqual(savedHeights, [470]);
        assert.deepEqual(toPlain(widths), [{ expressionPickerWidth: 660 }]);
        assert.equal(settings.vcExpressionPickerSize.height, 470);
        assert.equal(fixture.resize.getSavedHeight(), 470);
        assert.equal(
            fixture.document.getElementById("vc-picker-resize-vars").textContent,
            ":root { --vc-picker-saved-height: 470px; }"
        );
    });

    test("dragging clamps width to the minimum and height to the available space", () => {
        const fixture = createFixture({ Vencord: { Settings: {} } });
        const { drawer } = createDrawer(fixture, {
            width: 600,
            height: 400,
            top: 200,
            right: 900,
            bottom: 600,
            left: 300
        });

        fixture.resize.initDrawer(drawer);
        const handle = drawer.children[0];

        handle.dispatch("pointerdown", {
            button: 0,
            pointerId: 1,
            clientX: 100,
            clientY: 100
        });
        handle.dispatch("pointermove", {
            pointerId: 1,
            clientX: 1500,
            clientY: -500
        });

        assert.equal(drawer.style.width, "498px");
        assert.equal(drawer.style.height, "540px");

        drawer.rect = {
            width: 498,
            height: 540,
            top: 60,
            right: 798,
            bottom: 600,
            left: 300
        };
        handle.dispatch("pointerup", { pointerId: 1 });
        assert.equal(fixture.resize.getSavedHeight(), 540);
    });

    test("initDrawer uses the settings fallback when the bridge has no saved height", () => {
        const fixture = createFixture({
            Vencord: {
                Settings: {
                    vcExpressionPickerSize: { height: 900 }
                }
            }
        });
        const { drawer } = createDrawer(fixture, {
            width: 700,
            height: 400,
            top: 300,
            right: 1000,
            bottom: 700,
            left: 300
        });

        fixture.resize.initDrawer(drawer);
        assert.equal(drawer.style.height, "900px");
        assert.equal(
            fixture.document.getElementById("vc-picker-resize-vars").textContent,
            ":root { --vc-picker-saved-height: 900px; }"
        );
    });

    test("the grip is keyboard accessible with arrow keys", () => {
        const fixture = createFixture({ Vencord: { Settings: {} } });
        const { drawer } = createDrawer(fixture, {
            width: 600,
            height: 400,
            top: 300,
            right: 900,
            bottom: 700,
            left: 300
        });

        fixture.resize.initDrawer(drawer);
        const handle = drawer.children[0];

        assert.equal(handle.getAttribute("tabindex"), "0");

        const left = handle.dispatch("keydown", { key: "ArrowLeft" });
        assert.equal(left.defaultPrevented, true);
        assert.equal(drawer.style.width, "608px");

        handle.dispatch("keydown", { key: "ArrowUp", shiftKey: true });
        assert.equal(drawer.style.height, "432px");
        assert.equal(fixture.resize.getSavedHeight(), 432);
    });

    test("the grip ignores non-primary buttons and unknown pointers", () => {
        const fixture = createFixture({ Vencord: { Settings: {} } });
        const { drawer } = createDrawer(fixture, {
            width: 600,
            height: 400,
            top: 300,
            right: 900,
            bottom: 700,
            left: 300
        });

        fixture.resize.initDrawer(drawer);
        const handle = drawer.children[0];

        handle.dispatch("pointerdown", {
            button: 2,
            pointerId: 3,
            clientX: 400,
            clientY: 500
        });
        assert.equal(handle.classList.contains("active"), false);

        handle.dispatch("pointermove", {
            pointerId: 3,
            clientX: 100,
            clientY: 100
        });
        assert.equal(drawer.style.width, undefined);

        handle.dispatch("pointerdown", {
            button: 0,
            pointerId: 4,
            clientX: 400,
            clientY: 500
        });
        handle.dispatch("pointermove", {
            pointerId: 5,
            clientX: 100,
            clientY: 100
        });
        assert.equal(drawer.style.width, undefined);

        handle.dispatch("pointerup", { pointerId: 5 });
        assert.equal(fixture.resize.getSavedHeight(), null);
    });
});
