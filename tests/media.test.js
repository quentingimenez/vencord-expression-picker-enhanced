"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture } = require("./helpers/picker-harness");

describe("GIF tile reveal", () => {
    test("markGifMedia waits for the image load event", () => {
        const fixture = createFixture();
        const image = fixture.document.createElement("img");
        image.complete = false;
        image.naturalWidth = 0;

        fixture.resize.markGifMedia(image);

        assert.equal(image.__vcGifMarked, true);
        assert.equal(image.classList.contains("vc-gif-ready"), false);
        assert.equal(image.listeners.get("load").length, 1);
        assert.equal(image.listeners.get("error").length, 1);

        image.dispatch("load");
        assert.equal(image.__vcGifReady, true);
        assert.equal(image.classList.contains("vc-gif-ready"), true);
        assert.equal(fixture.clock.tasks.size, 0);
    });

    test("markGifMedia reveals already loaded images immediately", () => {
        const fixture = createFixture();
        const image = fixture.document.createElement("img");
        image.complete = true;
        image.naturalWidth = 32;

        fixture.resize.markGifMedia(image);

        assert.equal(image.__vcGifReady, true);
        assert.equal(image.classList.contains("vc-gif-ready"), true);
    });

    test("markGifMedia reveals broken images on error", () => {
        const fixture = createFixture();
        const image = fixture.document.createElement("img");
        image.complete = false;
        image.naturalWidth = 0;

        fixture.resize.markGifMedia(image);
        image.dispatch("error");

        assert.equal(image.__vcGifReady, true);
        assert.equal(image.classList.contains("vc-gif-ready"), true);
    });

    test("markGifMedia is idempotent", () => {
        const fixture = createFixture();
        const image = fixture.document.createElement("img");
        image.complete = false;
        image.naturalWidth = 0;

        fixture.resize.markGifMedia(image);
        fixture.resize.markGifMedia(image);

        assert.equal(image.listeners.get("load").length, 1);
        assert.equal(image.listeners.get("error").length, 1);
    });

    test("markGifMedia handles videos that are already ready", () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.readyState = 2;

        fixture.resize.markGifMedia(video);

        assert.equal(video.__vcGifReady, true);
        assert.equal(video.classList.contains("vc-gif-ready"), true);
    });

    test("markGifMedia waits for video playback events", () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.readyState = 0;

        fixture.resize.markGifMedia(video);

        assert.equal(video.listeners.get("loadeddata").length, 1);
        assert.equal(video.listeners.get("playing").length, 1);
        assert.equal(video.listeners.get("canplay").length, 1);
        video.dispatch("playing");
        assert.equal(video.__vcGifReady, true);
    });

    test("markGifMedia reveals the tile after ten seconds no matter what", () => {
        const fixture = createFixture();
        const image = fixture.document.createElement("img");
        image.complete = false;
        image.naturalWidth = 0;

        fixture.resize.markGifMedia(image);
        fixture.clock.advance(9999);
        assert.equal(image.__vcGifReady, undefined);

        fixture.clock.advance(1);
        assert.equal(image.__vcGifReady, true);
    });

    test("markGifMediaIn walks descendants and the root itself", () => {
        const fixture = createFixture();
        const root = fixture.document.createElement("div");
        const first = fixture.document.createElement("img");
        const second = fixture.document.createElement("img");
        first.complete = true;
        first.naturalWidth = 10;
        second.complete = true;
        second.naturalWidth = 10;

        root.querySelectorAll = () => [first, second];
        fixture.resize.markGifMediaIn(root);

        assert.equal(first.__vcGifReady, true);
        assert.equal(second.__vcGifReady, true);

        const matchingRoot = fixture.document.createElement("img");
        matchingRoot.classList.add("gif__");
        matchingRoot.complete = true;
        matchingRoot.naturalWidth = 10;
        matchingRoot.querySelectorAll = () => [];
        fixture.resize.markGifMediaIn(matchingRoot);

        assert.equal(matchingRoot.__vcGifReady, true);
    });

    test("markGifMedia ignores non-media elements", () => {
        const fixture = createFixture();
        const container = fixture.document.createElement("div");
        container.classList.add("gif__");

        fixture.resize.markGifMedia(container);

        assert.equal(container.__vcGifMarked, undefined);
        assert.equal(container.listeners.size, 0);
    });

    test("markGifMediaIn ignores non-element roots", () => {
        const fixture = createFixture();
        const root = { nodeType: 3, querySelectorAll: () => [] };
        assert.doesNotThrow(() => fixture.resize.markGifMediaIn(root));
    });
});

describe("GIF encoding", () => {
    test("encodeFrames writes a valid GIF89a header", async () => {
        const fixture = createFixture();
        const pixels = new fixture.Uint8ClampedArray(2 * 2 * 4);
        for (let index = 0; index < pixels.length; index += 4) {
            pixels[index] = 255;
            pixels[index + 1] = 64;
            pixels[index + 2] = 32;
            pixels[index + 3] = 255;
        }

        const blob = fixture.imports.encodeFrames([{ data: pixels, delay: 100 }], 2, 2);
        const bytes = new Uint8Array(await blob.arrayBuffer());

        assert.equal(blob.type, "image/gif");
        assert.ok(bytes.length > 20);
        assert.equal(String.fromCharCode(...bytes.slice(0, 6)), "GIF89a");
        assert.equal(bytes[6] | (bytes[7] << 8), 2);
        assert.equal(bytes[8] | (bytes[9] << 8), 2);
        assert.equal(bytes.at(-1), 0x3b);
    });

    test("encodeFrames rejects an empty frame list", () => {
        const fixture = createFixture();
        assert.throws(() => fixture.imports.encodeFrames([], 2, 2), /no frame/);
    });

    test("encodeFrames rejects invalid dimensions", () => {
        const fixture = createFixture();
        const pixels = new fixture.Uint8ClampedArray(4 * 4 * 4);
        assert.throws(() => fixture.imports.encodeFrames([{ data: pixels, delay: 100 }], 0, 4), /conversion failed/);
    });

    test("encodeFrames accepts multiple frames", async () => {
        const fixture = createFixture();
        const first = new fixture.Uint8ClampedArray(4 * 4 * 4).fill(255);
        const second = new fixture.Uint8ClampedArray(4 * 4 * 4).fill(0);

        const blob = fixture.imports.encodeFrames(
            [
                { data: first, delay: 100 },
                { data: second, delay: 100 }
            ],
            4,
            4
        );

        assert.equal(blob.type, "image/gif");
        assert.ok(blob.size > 20);
    });
});

describe("video seeking", () => {
    test("seekVideo resolves immediately when the time is already correct", async () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.readyState = 2;
        video.currentTime = 1;

        const promise = fixture.imports.seekVideo(video, 1);
        fixture.clock.advance(16);
        await promise;

        assert.equal(fixture.clock.tasks.size, 0);
    });

    test("seekVideo waits for the seeked event", async () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.readyState = 1;
        video.currentTime = 0;

        const promise = fixture.imports.seekVideo(video, 2);
        assert.equal(video.currentTime, 2);
        video.dispatch("seeked");
        await promise;

        assert.equal(fixture.clock.tasks.size, 0);
    });

    test("seekVideo rejects after seven seconds", async () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.readyState = 1;
        video.currentTime = 0;

        const expectation = assert.rejects(fixture.imports.seekVideo(video, 2), /video conversion timed out/);
        fixture.clock.advance(7000);
        await expectation;
    });

    test("seekVideo rejects when setting currentTime throws", async () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.readyState = 1;
        Object.defineProperty(video, "currentTime", {
            get: () => 0,
            set: () => {
                throw new Error("seek failed");
            }
        });

        await assert.rejects(fixture.imports.seekVideo(video, 2), /seek failed/);
        assert.equal(fixture.clock.tasks.size, 0);
    });
});
