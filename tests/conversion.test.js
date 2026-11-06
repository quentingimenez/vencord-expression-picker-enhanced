"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { Blob } = require("node:buffer");
const { createFixture } = require("./helpers/picker-harness");

const flush = () => new Promise((resolve) => setImmediate(resolve));

async function drain(fixture, promise) {
    const settled = promise.then(
        (value) => ({ value }),
        (error) => ({ error })
    );

    for (let index = 0; index < 5; index++) {
        await flush();
        fixture.clock.advance(16);
    }

    const result = await settled;
    if (result.error) throw result.error;
    return result.value;
}

describe("image conversion", () => {
    test("convertImage uses ImageDecoder for animated images", async () => {
        let closedFrames = 0;

        class FakeImageDecoder {
            constructor() {
                this.tracks = {
                    ready: Promise.resolve(),
                    selectedTrack: { frameCount: 2 }
                };
            }

            async decode() {
                return {
                    image: {
                        displayWidth: 1000,
                        displayHeight: 500,
                        duration: 100000,
                        close() {
                            closedFrames++;
                        }
                    }
                };
            }

            close() {}
        }

        const fixture = createFixture({ ImageDecoder: FakeImageDecoder });
        const result = await drain(
            fixture,
            fixture.imports.convertImage({
                arrayBuffer: async () => new ArrayBuffer(8),
                type: "image/png",
                name: "animated.png",
                size: 8
            })
        );

        assert.equal(result.width, 480);
        assert.equal(result.height, 240);
        assert.equal(result.blob.type, "image/gif");
        assert.equal(closedFrames, 2);
    });

    test("convertImage rejects an invalid decoded frame size", async () => {
        class EmptyDecoder {
            constructor() {
                this.tracks = {
                    ready: Promise.resolve(),
                    selectedTrack: { frameCount: 1 }
                };
            }

            async decode() {
                return {
                    image: {
                        displayWidth: 0,
                        displayHeight: 0,
                        duration: 100000,
                        close() {}
                    }
                };
            }

            close() {}
        }

        const fixture = createFixture({
            ImageDecoder: EmptyDecoder,
            createImageBitmap: async () => {
                throw new Error("bad image");
            }
        });
        await assert.rejects(
            drain(
                fixture,
                fixture.imports.convertImage({
                    arrayBuffer: async () => new ArrayBuffer(8),
                    type: "image/png",
                    name: "empty.png",
                    size: 8
                })
            ),
            /unreadable image/
        );
    });
});

describe("video conversion", () => {
    test("convertVideo converts a short clip to GIF", async () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.videoWidth = 100;
        video.videoHeight = 50;
        video.readyState = 2;
        video.duration = 0.05;
        video.pause = () => {};
        video.load = () => {};

        Object.defineProperty(video, "src", {
            configurable: true,
            get: () => video._src,
            set(value) {
                video._src = value;
                queueMicrotask(() => video.onloadedmetadata?.());
            }
        });
        Object.defineProperty(video, "currentTime", {
            configurable: true,
            get: () => 0,
            set: () => {
                queueMicrotask(() => video.dispatch("seeked"));
            }
        });

        const createElement = fixture.document.createElement.bind(fixture.document);
        fixture.document.createElement = (tagName) =>
            String(tagName).toLowerCase() === "video" ? video : createElement(tagName);

        const file = new Blob([new Uint8Array(8)], { type: "video/mp4" });
        const result = await drain(fixture, fixture.imports.convertVideo(file));

        assert.equal(result.width, 100);
        assert.equal(result.height, 50);
        assert.equal(result.blob.type, "image/gif");
        assert.equal(fixture.clock.tasks.size, 0);
    });

    test("convertVideo rejects videos without dimensions", async () => {
        const fixture = createFixture();
        const video = fixture.document.createElement("video");
        video.videoWidth = 0;
        video.videoHeight = 0;
        video.readyState = 2;
        video.duration = 1;
        video.pause = () => {};
        video.load = () => {};
        Object.defineProperty(video, "src", {
            configurable: true,
            get: () => video._src,
            set(value) {
                video._src = value;
                queueMicrotask(() => video.onloadedmetadata?.());
            }
        });

        const createElement = fixture.document.createElement.bind(fixture.document);
        fixture.document.createElement = (tagName) =>
            String(tagName).toLowerCase() === "video" ? video : createElement(tagName);

        const promise = drain(
            fixture,
            fixture.imports.convertVideo(new Blob([new Uint8Array(8)], { type: "video/mp4" }))
        );
        await assert.rejects(promise, /invalid video dimensions/);
    });
});
