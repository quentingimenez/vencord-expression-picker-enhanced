const MESSAGE_KEYS_BY_LOWER = new Map(Object.keys(MESSAGES).map((key) => [key.toLowerCase(), key]));
const PLURAL_RULES = new Map();
const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;
let currentLocale = null;

function detectDiscordLocale() {
    try {
        const common = getWebpackCommon();
        const locale =
            common?.UserSettingsProtoStore?.settings?.localization?.locale?.value ??
            findByProps("getLocale")?.getLocale?.() ??
            common?.i18n?.intl?.currentLocale;
        return locale ? String(locale) : null;
    } catch {
        return null;
    }
}

function normalizeLocale(locale) {
    const value = String(locale || "")
        .replace("_", "-")
        .toLowerCase();
    if (!value) return "en";
    if (value === "zh" || value.startsWith("zh-hans")) return "zh-CN";
    if (value === "zh-hk" || value === "zh-mo" || value.startsWith("zh-hant")) return "zh-TW";
    const exact = MESSAGE_KEYS_BY_LOWER.get(value);
    if (exact) return exact;
    const base = value.split("-")[0];
    return MESSAGE_KEYS_BY_LOWER.get(base) || "en";
}

function getLocale() {
    if (currentLocale) return currentLocale;
    const discordLocale = detectDiscordLocale();
    if (discordLocale) currentLocale = normalizeLocale(discordLocale);
    return currentLocale || normalizeLocale(navigator.language || "en");
}

function getPluralRules(locale) {
    let rules = PLURAL_RULES.get(locale);
    if (!rules) {
        try {
            rules = new Intl.PluralRules(locale);
        } catch (error) {
            console.warn(`${LOG_PREFIX} Plural rules unavailable for ${locale}`, error);
            return null;
        }
        PLURAL_RULES.set(locale, rules);
    }
    return rules;
}

function interpolate(template, params = {}) {
    return String(template).replace(PLACEHOLDER_PATTERN, (match, name) =>
        params[name] == null ? "" : String(params[name])
    );
}

function t(key, params = {}) {
    const locale = getLocale();
    const table = MESSAGES[locale] || MESSAGES.en;
    let entry = table[key] ?? MESSAGES.en[key] ?? key;

    if (entry && typeof entry === "object") {
        const count = Number(params.count);
        const safeCount = Number.isFinite(count) ? count : 0;
        const rules = getPluralRules(locale);
        let category = "other";
        if (rules) {
            category = rules.select(safeCount);
        } else if (safeCount === 1) {
            category = "one";
        }
        entry = entry[category] ?? entry.other ?? entry.one ?? "";
    }

    return interpolate(entry, params);
}
