"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { PART_FILES, build } = require("../scripts/build-renderer");

const ROOT = path.resolve(__dirname, "..");

describe("project consistency", () => {
    test("package, lockfile, installer and assembly versions stay in sync", () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
        const lock = JSON.parse(fs.readFileSync(path.join(ROOT, "package-lock.json"), "utf8"));
        const installer = fs.readFileSync(path.join(ROOT, "installer", "Installer.cs"), "utf8");

        assert.equal(lock.version, pkg.version);
        assert.equal(lock.packages[""].version, pkg.version);

        const expectedAssembly = `${pkg.version}.0`;
        assert.match(installer, new RegExp(`AssemblyVersion\\("${expectedAssembly.replace(/\./g, "\\.")}\\"\\)`));
        assert.match(installer, new RegExp(`AssemblyFileVersion\\("${expectedAssembly.replace(/\./g, "\\.")}\\"\\)`));
    });

    test("every renderer fragment is listed in the build", () => {
        const actual = fs
            .readdirSync(path.join(ROOT, "src", "renderer"))
            .filter((name) => name.endsWith(".js"))
            .sort();

        assert.deepEqual(actual, [...PART_FILES].sort());
    });

    test("the generated renderer bundle is up to date", () => {
        assert.doesNotThrow(() => build({ check: true }));
    });
});
