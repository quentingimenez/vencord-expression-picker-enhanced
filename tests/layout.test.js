"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture, toPlain } = require("./helpers/picker-harness");

function addTile(document, grid, aspect) {
    const tile = document.createElement("div");
    tile.dataset.aspect = aspect;
    grid.appendChild(tile);
    return tile;
}

describe("fit", () => {
    test("fit keeps small images unchanged", () => {
        const { imports } = createFixture();

        assert.deepEqual(toPlain(imports.fit(300, 200)), { width: 300, height: 200 });
        assert.deepEqual(toPlain(imports.fit(480, 480)), { width: 480, height: 480 });
    });

    test("fit scales the longest side to 480px", () => {
        const { imports } = createFixture();

        assert.deepEqual(toPlain(imports.fit(960, 480)), { width: 480, height: 240 });
        assert.deepEqual(toPlain(imports.fit(1000, 333)), { width: 480, height: 160 });
    });

    test("fit never produces a zero-sized dimension", () => {
        const { imports } = createFixture();

        assert.deepEqual(toPlain(imports.fit(0, 100)), { width: 1, height: 1 });
        assert.deepEqual(toPlain(imports.fit(100, 0)), { width: 1, height: 1 });
        assert.deepEqual(toPlain(imports.fit(1, 10000)), { width: 1, height: 480 });
        assert.deepEqual(toPlain(imports.fit(10000, 1)), { width: 480, height: 1 });
    });
});

describe("root category grid", () => {
    test("reflowRootGrid aligns cards in columns", () => {
        const fixture = createFixture();
        const wrapper = fixture.document.createElement("div");
        wrapper.clientWidth = 806;
        wrapper.style.height = "";

        const cards = [];
        for (let index = 0; index < 5; index++) {
            const card = fixture.document.createElement("div");
            card.classList.add("result__2dc39");
            wrapper.appendChild(card);
            cards.push(card);
        }

        fixture.imports.reflowRootGrid(wrapper);

        assert.equal(cards[0].style.position, "absolute");
        assert.equal(cards[0].style.left, "12px");
        assert.equal(cards[0].style.top, "0px");
        assert.equal(cards[0].style.width, "186.5px");
        assert.equal(cards[0].style.height, "110px");

        assert.equal(cards[3].style.left, "607.5px");
        assert.equal(cards[4].style.left, "12px");
        assert.equal(cards[4].style.top, "122px");
        assert.equal(wrapper.style.height, "232px");
    });

    test("reflowRootGrid falls back to the parent width", () => {
        const fixture = createFixture();
        const parent = fixture.document.createElement("div");
        parent.clientWidth = 1000;

        const wrapper = fixture.document.createElement("div");
        parent.appendChild(wrapper);
        wrapper.clientWidth = 0;

        for (let index = 0; index < 2; index++) {
            const card = fixture.document.createElement("div");
            card.classList.add("result__2dc39");
            wrapper.appendChild(card);
        }

        fixture.imports.reflowRootGrid(wrapper);

        const first = wrapper.children[0];
        const second = wrapper.children[1];
        assert.equal(first.style.left, "12px");
        assert.equal(second.style.left, "209.6px");
    });

    test("reflowRootGrid does not shrink an already taller wrapper", () => {
        const fixture = createFixture();
        const wrapper = fixture.document.createElement("div");
        wrapper.clientWidth = 806;
        wrapper.style.height = "400px";

        const card = fixture.document.createElement("div");
        card.classList.add("result__2dc39");
        wrapper.appendChild(card);

        fixture.imports.reflowRootGrid(wrapper);
        assert.equal(wrapper.style.height, "400px");
    });

    test("reflowRootGrid ignores wrappers without cards", () => {
        const fixture = createFixture();
        const wrapper = fixture.document.createElement("div");
        wrapper.clientWidth = 806;

        const other = fixture.document.createElement("div");
        wrapper.appendChild(other);

        fixture.imports.reflowRootGrid(wrapper);

        assert.equal(wrapper.style.height, undefined);
        assert.equal(other.style.position, undefined);
    });
});

describe("imported masonry layout", () => {
    function overlayWithTiles(fixture, count, width = 800) {
        const overlay = fixture.document.createElement("div");
        const grid = fixture.document.createElement("div");
        overlay.clientWidth = width;
        overlay.isConnected = true;
        overlay.querySelector = (selector) => (selector === ".vc-imported-grid" ? grid : null);

        const tiles = [];
        for (let index = 0; index < count; index++) {
            tiles.push(addTile(fixture.document, grid, "1"));
        }

        fixture.imports.setOverlay(overlay);
        return { overlay, grid, tiles };
    }

    test("layoutImportedTiles fills the shortest column", () => {
        const fixture = createFixture();
        const { grid, tiles } = overlayWithTiles(fixture, 0);

        tiles.push(addTile(fixture.document, grid, "1"));
        tiles.push(addTile(fixture.document, grid, "0.5"));
        tiles.push(addTile(fixture.document, grid, "2"));
        tiles.push(addTile(fixture.document, grid, "1"));
        tiles.push(addTile(fixture.document, grid, "1"));

        fixture.imports.layoutImportedTiles(true);

        assert.deepEqual(
            tiles.map((tile) => [tile.style.left, tile.style.top, tile.style.width, tile.style.height]),
            [
                ["12px", "0px", "185px", "185px"],
                ["209px", "0px", "185px", "92.5px"],
                ["406px", "0px", "185px", "370px"],
                ["603px", "0px", "185px", "185px"],
                ["209px", "104.5px", "185px", "185px"]
            ]
        );
        assert.equal(grid.style.width, "800px");
        assert.equal(grid.style.height, "370px");
    });

    test("layoutImportedTiles falls back to a square aspect", () => {
        const fixture = createFixture();
        const { grid, tiles } = overlayWithTiles(fixture, 1);
        tiles[0].dataset.aspect = "not-a-number";

        fixture.imports.layoutImportedTiles(true);
        assert.equal(tiles[0].style.height, "185px");
        assert.equal(grid.style.height, "185px");
    });

    test("layoutImportedTiles handles an empty grid", () => {
        const fixture = createFixture();
        const { grid } = overlayWithTiles(fixture, 0);

        fixture.imports.layoutImportedTiles(true);
        assert.equal(grid.style.width, "800px");
        assert.equal(grid.style.height, "0px");
    });

    test("layoutImportedTiles waits for a measurable width", () => {
        const fixture = createFixture();
        const { grid, tiles } = overlayWithTiles(fixture, 1, 0);

        fixture.imports.layoutImportedTiles(true);
        assert.equal(tiles[0].style.width, undefined);
        assert.equal(grid.style.width, undefined);
    });

    test("layoutImportedTiles ignores a detached overlay", () => {
        const fixture = createFixture();
        const { overlay, grid, tiles } = overlayWithTiles(fixture, 1);
        overlay.isConnected = false;

        fixture.imports.layoutImportedTiles(true);
        assert.equal(tiles[0].style.width, undefined);
        assert.equal(grid.style.width, undefined);
    });

    test("layoutImportedTiles reuses the layout until forced", () => {
        const fixture = createFixture();
        const { tiles } = overlayWithTiles(fixture, 2);
        fixture.imports.layoutImportedTiles(true);

        const originalTop = tiles[1].style.top;
        tiles[1].dataset.aspect = "2";
        fixture.imports.layoutImportedTiles(false);
        assert.equal(tiles[1].style.top, originalTop);

        fixture.imports.layoutImportedTiles(true);
        assert.equal(tiles[1].style.height, "370px");
    });
});
