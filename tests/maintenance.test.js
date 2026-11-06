"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture } = require("./helpers/picker-harness");

function createPicker(fixture) {
    const layer = fixture.document.createElement("div");
    layer.className = "expressionPickerPositionLayer";

    const drawer = fixture.document.createElement("div");
    drawer.className = "drawerSizingWrapper";
    drawer.rect = {
        width: 800,
        height: 500,
        top: 200,
        right: 1100,
        bottom: 700,
        left: 300
    };
    layer.appendChild(drawer);

    const panel = fixture.document.createElement("div");
    panel.id = "gif-picker-tab-panel";
    panel.clientWidth = 800;
    drawer.appendChild(panel);

    const grid = fixture.document.createElement("div");
    panel.appendChild(grid);

    const favorites = fixture.document.createElement("div");
    favorites.className = "result__abc";
    favorites.setAttribute("role", "button");
    favorites.setAttribute("aria-label", "Favorites");
    const favoritesLabel = fixture.document.createElement("div");
    favoritesLabel.className = "categoryText_xyz";
    favoritesLabel.textContent = "Favorites";
    favorites.appendChild(favoritesLabel);
    grid.appendChild(favorites);

    const trending = fixture.document.createElement("div");
    trending.className = "result__abc";
    trending.setAttribute("role", "button");
    trending.setAttribute("aria-label", "Trending");
    grid.appendChild(trending);

    fixture.document.body.appendChild(layer);

    return { layer, drawer, panel, grid, favorites, trending };
}

describe("maintenance loop", () => {
    test("maintain wires the drawer, category card and file input", () => {
        const fixture = createFixture();
        const { drawer, grid } = createPicker(fixture);

        fixture.imports.maintain();

        assert.ok(drawer.querySelector(".vc-picker-resize"), "resize grip is missing");
        assert.ok(drawer.querySelector(".vc-gif-import"), "import button is missing");
        assert.ok(fixture.document.body.querySelector(".vc-import-input"), "file input is missing");
        assert.ok(grid.querySelector(".vc-imported-category"), "imports category card is missing");
        assert.equal(fixture.imports.getImports().length, 0);
    });

    test("maintain recreates the resize grip after a Discord re-render", () => {
        const fixture = createFixture();
        const { drawer } = createPicker(fixture);

        fixture.imports.maintain();
        drawer.querySelector(".vc-picker-resize").remove();
        assert.equal(drawer.querySelectorAll(".vc-picker-resize").length, 0);

        fixture.imports.maintain();

        assert.equal(drawer.querySelectorAll(".vc-picker-resize").length, 1);
    });

    test("maintain is safe when no picker is present", () => {
        const fixture = createFixture();
        assert.doesNotThrow(() => fixture.imports.maintain());
    });

    test("category restore does not click Back when the category is already open", () => {
        const fixture = createFixture();
        const panel = fixture.document.createElement("div");
        let backClicks = 0;

        const back = fixture.document.createElement("div");
        back.className = "backButton_abc";
        back.addEventListener("click", () => backClicks++);
        panel.appendChild(back);

        const label = fixture.document.createElement("div");
        label.className = "categoryText_xyz";
        label.textContent = "Trending";
        panel.appendChild(label);

        fixture.imports.saveLastView({ type: "category", label: "Trending" });
        fixture.imports.requestRestore();
        fixture.imports.tryRestore(panel);

        assert.equal(backClicks, 0);
    });

    test("category restore clicks Back when another category is open", () => {
        const fixture = createFixture();
        const panel = fixture.document.createElement("div");
        let backClicks = 0;

        const back = fixture.document.createElement("div");
        back.className = "backButton_abc";
        back.addEventListener("click", () => backClicks++);
        panel.appendChild(back);

        const label = fixture.document.createElement("div");
        label.className = "categoryText_xyz";
        label.textContent = "Trending";
        panel.appendChild(label);

        fixture.imports.saveLastView({ type: "category", label: "React" });
        fixture.imports.requestRestore();
        fixture.imports.tryRestore(panel);

        assert.equal(backClicks, 1);
    });

    test("category restore ignores a matching label inside a hidden root card", () => {
        const fixture = createFixture();
        const panel = fixture.document.createElement("div");
        let backClicks = 0;

        const back = fixture.document.createElement("div");
        back.className = "backButton_abc";
        back.addEventListener("click", () => backClicks++);
        panel.appendChild(back);

        const rootCard = fixture.document.createElement("div");
        rootCard.className = "result__abc";
        rootCard.setAttribute("role", "button");
        const hiddenLabel = fixture.document.createElement("div");
        hiddenLabel.className = "categoryText_xyz";
        hiddenLabel.textContent = "Trending";
        rootCard.appendChild(hiddenLabel);
        panel.appendChild(rootCard);

        const headerLabel = fixture.document.createElement("div");
        headerLabel.className = "categoryName_xyz";
        headerLabel.textContent = "React";
        panel.appendChild(headerLabel);

        fixture.imports.saveLastView({ type: "category", label: "Trending" });
        fixture.imports.requestRestore();
        fixture.imports.tryRestore(panel);

        assert.equal(backClicks, 1);
    });
});
