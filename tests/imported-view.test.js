"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture } = require("./helpers/picker-harness");

function createOverlay(fixture, width = 800) {
    const overlay = fixture.document.createElement("div");
    overlay.clientWidth = width;
    overlay.isConnected = true;

    const grid = fixture.document.createElement("div");
    const empty = fixture.document.createElement("div");
    const emptyLabel = fixture.document.createElement("span");
    const count = fixture.document.createElement("span");
    empty.appendChild(emptyLabel);
    overlay.appendChild(grid);
    overlay.appendChild(empty);
    overlay.appendChild(count);

    overlay.querySelector = (selector) => {
        if (selector === ".vc-imported-grid") return grid;
        if (selector === ".vc-imported-empty") return empty;
        if (selector === ".vc-imported-count") return count;
        return null;
    };

    fixture.imports.setOverlay(overlay);
    return { overlay, grid, empty, emptyLabel, count };
}

describe("imported view rendering", () => {
    test("an empty view still offers the import tile", () => {
        const fixture = createFixture();
        const { grid, emptyLabel, count } = createOverlay(fixture);

        fixture.imports.renderImportedView(true);

        assert.equal(grid.children.length, 1);
        assert.equal(grid.children[0].className, "vc-imported-tile vc-imported-add");
        assert.equal(grid.children[0].getAttribute("aria-label"), "Import GIFs");
        assert.equal(emptyLabel.textContent, "No imported GIFs yet");
        assert.equal(count.textContent, "");
    });

    test("a record renders attach, favorite and delete actions", () => {
        const fixture = createFixture();
        const { grid, empty, count } = createOverlay(fixture);

        fixture.imports.setImports([{ id: "one", name: "rec.gif", width: 100, height: 80 }]);
        fixture.imports.renderImportedView(true);

        assert.equal(grid.children.length, 2);
        const tile = grid.children[1];
        assert.equal(tile.children.length, 3);
        assert.equal(tile.children[0].getAttribute("aria-label"), "Add rec.gif to message");
        assert.equal(tile.children[1].getAttribute("aria-label"), "Add to favorites");
        assert.equal(tile.children[1].getAttribute("aria-pressed"), "false");
        assert.equal(tile.children[2].getAttribute("aria-label"), "Delete rec.gif");
        assert.equal(empty.style.display, "none");
        assert.equal(count.textContent, "1 GIF");
    });

    test("re-rendering without changes keeps the existing grid", () => {
        const fixture = createFixture();
        const { grid } = createOverlay(fixture);

        fixture.imports.renderImportedView(true);
        const firstTile = grid.children[0];
        fixture.imports.renderImportedView(false);

        assert.equal(grid.children[0], firstTile);
    });
});
