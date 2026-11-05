"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture, toPlain } = require("./helpers/picker-harness");

function favoriteStore(gifs) {
    return {
        Webpack: {
            Common: {
                UserSettingsProtoStore: {
                    frecencyWithoutFetchingLatest: {
                        favoriteGifs: { gifs }
                    }
                }
            }
        }
    };
}

describe("native favorite matching", () => {
    test("getNativeFavoriteEntries reads src, url and gifSrc", () => {
        const fixture = createFixture({
            Vencord: favoriteStore({
                one: {
                    src: "https://media.discordapp.net/attachments/1/2/My%20GIF.GIF?ex=123",
                    width: 320,
                    height: 240
                },
                two: { url: "/media/Other.Gif", width: 100 },
                three: { gifSrc: "https://cdn.discordapp.com/gifs/third.gif" },
                missing: { width: 10, height: 10 }
            })
        });

        assert.deepEqual(toPlain(fixture.imports.getNativeFavoriteEntries()), [
            {
                key: "one",
                pathname: "/attachments/1/2/my%20gif.gif",
                name: "my gif.gif",
                width: 320,
                height: 240
            },
            {
                key: "two",
                pathname: "/media/other.gif",
                name: "other.gif",
                width: 100
            },
            {
                key: "three",
                pathname: "/gifs/third.gif",
                name: "third.gif"
            }
        ]);
    });

    test("getNativeFavoriteEntries returns an empty list without favorites", () => {
        const fixture = createFixture();
        assert.deepEqual(toPlain(fixture.imports.getNativeFavoriteEntries()), []);
    });

    test("getNativeFavoriteEntries skips unreadable filenames", () => {
        const fixture = createFixture({
            Vencord: favoriteStore({
                broken: { src: "https://cdn.discordapp.com/%E0%A4%A.gif" },
                emptyName: { src: "https://cdn.discordapp.com/" }
            })
        });

        assert.deepEqual(toPlain(fixture.imports.getNativeFavoriteEntries()), []);
    });

    test("getImportedNativeMatches compares names case-insensitively with a 2px tolerance", () => {
        const fixture = createFixture({
            Vencord: favoriteStore({
                catExact: {
                    src: "https://media.discordapp.net/gifs/Cat.GIF",
                    width: 100,
                    height: 80
                },
                catWrongSize: {
                    src: "https://media.discordapp.net/gifs/cat.gif?size=large",
                    width: 120,
                    height: 80
                },
                dogNoSize: {
                    src: "https://media.discordapp.net/gifs/Dog.gif"
                }
            })
        });

        fixture.imports.setImports([
            { id: "a", name: "Cat.GIF", width: 102, height: 79 },
            { id: "b", name: "cat.gif", width: 103, height: 80 },
            { id: "c", name: "dog.gif", width: 640, height: 480 }
        ]);

        const matches = fixture.imports.getImportedNativeMatches();
        assert.deepEqual(toPlain(matches.map((match) => [match.record.id, match.entry.key])), [
            ["a", "catExact"],
            ["c", "dogNoSize"]
        ]);

        assert.deepEqual(toPlain(fixture.imports.getFavoriteKeysForRecord({ id: "a" })), ["catExact"]);
        assert.deepEqual(toPlain(fixture.imports.getFavoriteKeysForRecord({ id: "b" })), []);
        assert.deepEqual(toPlain(fixture.imports.getFavoriteKeysForRecord({ id: "c" })), ["dogNoSize"]);
    });

    test("getFavoriteKeysForRecord returns every matching favorite", () => {
        const fixture = createFixture({
            Vencord: favoriteStore({
                copyA: { src: "https://cdn.discordapp.com/a/cat.gif", width: 100, height: 100 },
                copyB: { src: "https://cdn.discordapp.com/b/cat.gif", width: 100, height: 100 }
            })
        });

        fixture.imports.setImports([{ id: "cat", name: "cat.gif", width: 100, height: 100 }]);

        assert.deepEqual(toPlain(fixture.imports.getFavoriteKeysForRecord({ id: "cat" }).sort()), ["copyA", "copyB"]);
    });

    test("getUnfavoriteAction returns Discord's Tr action", () => {
        const unfavorite = () => {};
        const fixture = createFixture({
            Vencord: {
                Webpack: {
                    findByProps(...properties) {
                        assert.deepEqual(properties, ["Tr", "wg"]);
                        return { Tr: unfavorite, wg: () => {} };
                    }
                }
            }
        });

        assert.equal(fixture.imports.getUnfavoriteAction(), unfavorite);
    });

    test("getUnfavoriteAction returns null when the action is unavailable", () => {
        const missing = createFixture();
        assert.equal(missing.imports.getUnfavoriteAction(), null);

        const invalid = createFixture({
            Vencord: { Webpack: { findByProps: () => ({ Tr: "not a function" }) } }
        });
        assert.equal(invalid.imports.getUnfavoriteAction(), null);
    });

    test("closePicker uses the expression picker store when available", () => {
        let closed = 0;
        const fixture = createFixture({
            Vencord: {
                Webpack: {
                    Common: {
                        ExpressionPickerStore: {
                            closeExpressionPicker() {
                                closed++;
                            }
                        }
                    }
                }
            }
        });

        assert.equal(fixture.imports.closePicker(), true);
        assert.equal(closed, 1);
    });

    test("closePicker falls back to the v8 action", () => {
        let closed = 0;
        const fixture = createFixture({
            Vencord: {
                Webpack: {
                    Common: {},
                    findByProps(...properties) {
                        assert.deepEqual(properties, ["v8", "RQ"]);
                        return {
                            v8() {
                                closed++;
                            }
                        };
                    }
                }
            }
        });

        assert.equal(fixture.imports.closePicker(), true);
        assert.equal(closed, 1);
    });

    test("closePicker returns false when both paths fail", () => {
        const fixture = createFixture();
        assert.equal(fixture.imports.closePicker(), false);
    });

    test("closePicker still tries the fallback when the store throws", () => {
        let closed = 0;
        const fixture = createFixture({
            Vencord: {
                Webpack: {
                    Common: {
                        ExpressionPickerStore: {
                            closeExpressionPicker() {
                                throw new Error("store changed");
                            }
                        }
                    },
                    findByProps: () => ({ v8: () => closed++ })
                }
            }
        });

        assert.equal(fixture.imports.closePicker(), true);
        assert.equal(closed, 1);
    });
});
