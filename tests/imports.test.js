"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture } = require("./helpers/picker-harness");

const MB = 1024 * 1024;

async function gifHeader(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    return String.fromCharCode(...bytes.slice(0, 6));
}

describe("importFile", () => {
    test("rejects files above 100 MB", async () => {
        const fixture = createFixture();

        await assert.rejects(
            fixture.imports.importFile({
                name: "huge.gif",
                type: "image/gif",
                size: 100 * MB + 1
            }),
            /file too large/
        );
    });

    test("rejects GIFs above 8 MB", async () => {
        const fixture = createFixture();

        await assert.rejects(
            fixture.imports.importFile({
                name: "heavy.gif",
                type: "image/gif",
                size: 8 * MB + 1
            }),
            /GIF too large/
        );
    });

    test("rejects unsupported formats", async () => {
        const fixture = createFixture();

        await assert.rejects(
            fixture.imports.importFile({
                name: "notes.txt",
                type: "text/plain",
                size: 12
            }),
            /unsupported format/
        );
    });

    test("accepts a GIF and renames it to .gif", async () => {
        const fixture = createFixture({
            crypto: { randomUUID: () => "fixed-id" },
            createImageBitmap: async () => ({ width: 320, height: 240, close() {} })
        });
        const file = {
            name: "My Clip.GIF",
            type: "image/gif",
            size: 1024
        };

        const record = await fixture.imports.importFile(file);

        assert.equal(record.id, "fixed-id");
        assert.equal(record.name, "My Clip.gif");
        assert.equal(record.width, 320);
        assert.equal(record.height, 240);
        assert.equal(record.size, 1024);
        assert.equal(record.blob, file);
        assert.equal(typeof record.createdAt, "number");
    });

    test("accepts a GIF based on its extension when the MIME type is empty", async () => {
        const fixture = createFixture({
            createImageBitmap: async () => ({ width: 10, height: 20, close() {} })
        });

        const record = await fixture.imports.importFile({
            name: "reaction.GIF",
            type: "",
            size: 100
        });

        assert.equal(record.name, "reaction.gif");
        assert.equal(record.width, 10);
        assert.equal(record.height, 20);
    });

    test("converts a static image to GIF and caps its dimensions", async () => {
        const fixture = createFixture({
            createImageBitmap: async () => ({ width: 960, height: 480, close() {} })
        });

        const record = await fixture.imports.importFile({
            name: "photo.PNG",
            type: "image/png",
            size: 2048
        });

        assert.equal(record.name, "photo.gif");
        assert.equal(record.width, 480);
        assert.equal(record.height, 240);
        assert.equal(record.blob.type, "image/gif");
        assert.equal(await gifHeader(record.blob), "GIF89a");
        assert.equal(record.size, record.blob.size);
    });

    test("accepts image extensions when the MIME type is missing", async () => {
        const fixture = createFixture({
            createImageBitmap: async () => ({ width: 40, height: 40, close() {} })
        });

        const record = await fixture.imports.importFile({
            name: "sticker.WEBP",
            type: "",
            size: 2048
        });

        assert.equal(record.name, "sticker.gif");
        assert.equal(record.blob.type, "image/gif");
    });

    test("appends .gif to names without an extension", async () => {
        const fixture = createFixture({
            createImageBitmap: async () => ({ width: 25, height: 25, close() {} })
        });

        const record = await fixture.imports.importFile({
            name: "clip",
            type: "image/gif",
            size: 100
        });

        assert.equal(record.name, "clip.gif");
    });

    test("rejects an unreadable image", async () => {
        const fixture = createFixture({
            createImageBitmap: async () => {
                throw new Error("not an image");
            }
        });

        await assert.rejects(
            fixture.imports.importFile({
                name: "broken.png",
                type: "image/png",
                size: 100
            }),
            /unreadable image/
        );
    });
});
