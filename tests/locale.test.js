"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { createFixture } = require("./helpers/picker-harness");

describe("localization", () => {
    test("normalizeLocale converts Discord locale variants to message tables", () => {
        const { imports } = createFixture();

        assert.equal(imports.normalizeLocale("fr"), "fr");
        assert.equal(imports.normalizeLocale("fr-FR"), "fr");
        assert.equal(imports.normalizeLocale("fr_FR"), "fr");
        assert.equal(imports.normalizeLocale("PT-br"), "pt");
        assert.equal(imports.normalizeLocale("en-US"), "en");
        assert.equal(imports.normalizeLocale("zh"), "zh-CN");
        assert.equal(imports.normalizeLocale("zh-Hans"), "zh-CN");
        assert.equal(imports.normalizeLocale("zh-Hant"), "zh-TW");
        assert.equal(imports.normalizeLocale("zh-Hant-TW"), "zh-TW");
        assert.equal(imports.normalizeLocale("ZH-hans"), "zh-CN");
        assert.equal(imports.normalizeLocale("pl"), "pl");
    });

    test("normalizeLocale falls back to English for unsupported locales", () => {
        const { imports } = createFixture();

        assert.equal(imports.normalizeLocale("xx"), "en");
        assert.equal(imports.normalizeLocale("xx-YY"), "en");
        assert.equal(imports.normalizeLocale(""), "en");
        assert.equal(imports.normalizeLocale(null), "en");
        assert.equal(imports.normalizeLocale(undefined), "en");
    });

    test("detectDiscordLocale reads UserSettingsProtoStore first", () => {
        const fixture = createFixture({
            Vencord: {
                Webpack: {
                    Common: {
                        UserSettingsProtoStore: {
                            settings: { localization: { locale: { value: "ja" } } }
                        },
                        i18n: { intl: { currentLocale: "de" } }
                    },
                    findByProps: () => ({ getLocale: () => "fr" })
                }
            }
        });

        assert.equal(fixture.imports.detectDiscordLocale(), "ja");
    });

    test("detectDiscordLocale falls back to getLocale then i18n", () => {
        const getLocaleFixture = createFixture({
            Vencord: {
                Webpack: {
                    Common: {},
                    findByProps: () => ({ getLocale: () => "fr" })
                }
            }
        });
        assert.equal(getLocaleFixture.imports.detectDiscordLocale(), "fr");

        const intlFixture = createFixture({
            Vencord: {
                Webpack: {
                    Common: { i18n: { intl: { currentLocale: "es" } } }
                }
            }
        });
        assert.equal(intlFixture.imports.detectDiscordLocale(), "es");
    });

    test("detectDiscordLocale returns null without Vencord", () => {
        const fixture = createFixture();
        assert.equal(fixture.imports.detectDiscordLocale(), null);
    });

    test("getLocale uses the Discord locale and caches it", () => {
        const settings = { localization: { locale: { value: "ja" } } };
        const fixture = createFixture({
            locale: "fr",
            Vencord: {
                Webpack: {
                    Common: {
                        UserSettingsProtoStore: { settings }
                    }
                }
            }
        });

        assert.equal(fixture.imports.getLocale(), "ja");
        settings.localization.locale.value = "de";
        assert.equal(fixture.imports.getLocale(), "ja");
    });

    test("getLocale falls back to the browser language", () => {
        const fixture = createFixture({ locale: "fr-CA" });
        assert.equal(fixture.imports.getLocale(), "fr");
    });

    test("t interpolates translated messages", () => {
        const fixture = createFixture({ locale: "fr" });

        assert.equal(fixture.imports.t("categoryName"), "Importés");
        assert.equal(fixture.imports.t("resizeHandle"), "Redimensionner");
        assert.equal(fixture.imports.t("resizeHandleLabel"), "Redimensionner la fenêtre");
        assert.equal(fixture.imports.t("addToMessage", { name: "chat.gif" }), "Ajouter chat.gif au message");
    });

    test("t uses English for unsupported browser languages", () => {
        const fixture = createFixture({ locale: "xx-YY" });
        assert.equal(fixture.imports.t("categoryName"), "Imported");
    });

    test("t falls back to English when a translation is missing", () => {
        const fixture = createFixture({ locale: "fr" });
        assert.equal(fixture.imports.t("__missing_key__"), "__missing_key__");
    });

    test("t selects the right plural category", () => {
        const english = createFixture({ locale: "en" });
        assert.equal(english.imports.t("countGifs", { count: 1 }), "1 GIF");
        assert.equal(english.imports.t("countGifs", { count: 2 }), "2 GIFs");

        const polish = createFixture({ locale: "pl" });
        assert.equal(polish.imports.t("countGifs", { count: 1 }), "1 GIF");
        assert.equal(polish.imports.t("countGifs", { count: 2 }), "2 GIF-y");
        assert.equal(polish.imports.t("countGifs", { count: 5 }), "5 GIF-ów");
        assert.equal(polish.imports.t("countGifs", { count: 22 }), "22 GIF-y");
    });

    test("interpolate replaces every placeholder and clears missing values", () => {
        const { imports } = createFixture();

        assert.equal(
            imports.interpolate("{name} has {count} GIFs ({name})", { name: "Ada", count: 0 }),
            "Ada has 0 GIFs (Ada)"
        );
        assert.equal(imports.interpolate("missing: {value}", {}), "missing: ");
        assert.equal(imports.interpolate("null: {value}", { value: null }), "null: ");
        assert.equal(imports.interpolate("number: {value}", { value: 42 }), "number: 42");
    });

    test("plural messages fall back to another category", () => {
        const fixture = createFixture({ locale: "fr" });
        assert.equal(fixture.imports.t("countResults", { count: 0 }), "0 résultat");
        assert.equal(fixture.imports.t("countResults", { count: 2 }), "2 résultats");
    });
});
