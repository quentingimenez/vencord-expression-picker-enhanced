"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture, toPlain } = require("./helpers/picker-harness");

describe("last opened view", () => {
    test("normalizeLastView accepts the root views", () => {
        const { imports } = createFixture();

        assert.deepEqual(toPlain(imports.normalizeLastView("root")), { type: "root" });
        assert.deepEqual(toPlain(imports.normalizeLastView("favorites")), { type: "favorites" });
        assert.deepEqual(toPlain(imports.normalizeLastView("imports")), { type: "imports" });
        assert.deepEqual(toPlain(imports.normalizeLastView({ type: "imports" })), { type: "imports" });
    });

    test("normalizeLastView keeps a valid category label", () => {
        const { imports } = createFixture();

        assert.deepEqual(toPlain(imports.normalizeLastView({ type: "category", label: "Trending GIFs" })), {
            type: "category",
            label: "Trending GIFs"
        });
    });

    test("normalizeLastView rejects malformed values", () => {
        const { imports } = createFixture();

        const fallback = { type: "favorites" };
        assert.deepEqual(toPlain(imports.normalizeLastView(null)), fallback);
        assert.deepEqual(toPlain(imports.normalizeLastView(undefined)), fallback);
        assert.deepEqual(toPlain(imports.normalizeLastView("")), fallback);
        assert.deepEqual(toPlain(imports.normalizeLastView({ type: "unknown" })), fallback);
        assert.deepEqual(toPlain(imports.normalizeLastView({ type: "category" })), fallback);
        assert.deepEqual(toPlain(imports.normalizeLastView({ type: "category", label: "" })), fallback);
        assert.deepEqual(toPlain(imports.normalizeLastView({ type: "category", label: 42 })), fallback);
    });

    test("loadLastView decodes the cookie", () => {
        const value = encodeURIComponent(JSON.stringify({ type: "category", label: "Anime" }));
        const fixture = createFixture({ cookie: `vcPickerLastView=${value}` });

        assert.deepEqual(toPlain(fixture.imports.loadLastView()), { type: "category", label: "Anime" });
    });

    test("loadLastView defaults to favorites for malformed cookies", () => {
        const brokenJson = createFixture({ cookie: "vcPickerLastView=%7Bbroken%7D" });
        assert.deepEqual(toPlain(brokenJson.imports.loadLastView()), { type: "favorites" });

        const brokenEncoding = createFixture({ cookie: "vcPickerLastView=%E0%A4%A" });
        assert.deepEqual(toPlain(brokenEncoding.imports.loadLastView()), { type: "favorites" });

        const empty = createFixture();
        assert.deepEqual(toPlain(empty.imports.loadLastView()), { type: "favorites" });
    });

    test("saveLastView normalizes and serializes the view", () => {
        const fixture = createFixture();
        fixture.imports.saveLastView({ type: "category", label: "Anime" });

        const raw = fixture.document.cookieWrites.at(-1);
        assert.match(raw, /^vcPickerLastView=/);
        assert.match(raw, /path=\//);
        assert.match(raw, /max-age=31536000/);
        assert.match(raw, /SameSite=Lax/);

        const encoded = raw.slice("vcPickerLastView=".length).split(";")[0];
        assert.deepEqual(JSON.parse(decodeURIComponent(encoded)), { type: "category", label: "Anime" });

        assert.deepEqual(toPlain(fixture.imports.loadLastView()), { type: "category", label: "Anime" });
    });

    test("saveLastView stores favorites for invalid views", () => {
        const fixture = createFixture();
        fixture.imports.saveLastView({ type: "nope", label: 1 });

        const raw = fixture.document.cookieWrites.at(-1);
        const encoded = raw.slice("vcPickerLastView=".length).split(";")[0];
        assert.deepEqual(JSON.parse(decodeURIComponent(encoded)), { type: "favorites" });
    });
});
