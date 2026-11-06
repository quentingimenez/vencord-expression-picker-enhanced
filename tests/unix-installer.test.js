"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const installScript = fs.readFileSync(path.join(ROOT, "install.sh"), "utf8");
const uninstallScript = fs.readFileSync(path.join(ROOT, "uninstall.sh"), "utf8");
const watcherScript = fs.readFileSync(path.join(ROOT, "src", "watcher.sh"), "utf8");
const commonScript = fs.readFileSync(path.join(ROOT, "src", "unix-common.sh"), "utf8");
const packageReleaseScript = fs.readFileSync(path.join(ROOT, "scripts", "package-release.sh"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

const START_MARKER = "/* VC_PICKER_RESIZE_LOADER_START */";
const END_MARKER = "/* VC_PICKER_RESIZE_LOADER_END */";

function count(text, marker) {
    return (text.match(new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

describe("Unix installer", () => {
    test("supports macOS and Linux and re-applies the loader from the watcher", () => {
        assert.match(commonScript, /Darwin/);
        assert.match(commonScript, /Linux/);
        assert.match(installScript, /--from-watcher/);
        assert.match(installScript, /preload\.js/);
        assert.match(installScript, /start_watcher/);
        assert.match(commonScript, /LaunchAgents/);
        assert.match(commonScript, /autostart/);
        assert.match(commonScript, /com\.discordapp\.Discord/);
    });

    test("the uninstaller strips the current preload and keeps files on failure", () => {
        assert.match(commonScript, /VC_PICKER_RESIZE_LOADER_START/);
        assert.match(uninstallScript, /strip_loader/);
        assert.match(uninstallScript, /cleanup_failed/);
        assert.match(uninstallScript, /rm -rf "\$INSTALL_DIR"/);
        assert.match(uninstallScript, /rm -f "\$BACKUP"/);
        assert.match(commonScript, /\.bak-picker-resize/);
    });

    test("the POSIX watcher polls preload.js and uses one instance", () => {
        assert.match(watcherScript, /VC_PICKER_RESIZE_LOADER_START/);
        assert.match(watcherScript, /--from-watcher/);
        assert.match(watcherScript, /cksum/);
        assert.match(watcherScript, /watcher\.lock/);
        assert.match(watcherScript, /ensure_patch/);
    });

    test("the release script packages the Unix archive and checksum", () => {
        assert.match(packageReleaseScript, /build-renderer\.js/);
        assert.match(packageReleaseScript, /VencordExpressionPickerEnhanced-v\$version-unix\.tar\.gz/);
        assert.match(packageReleaseScript, /SHA256SUMS-unix\.txt/);
        assert.match(packageReleaseScript, /src\/unix-common\.sh/);
        assert.equal(packageJson.scripts["release:unix"], "sh scripts/package-release.sh");
        assert.equal(packageJson.scripts["release:windows"].startsWith("powershell "), true);
    });

    test(
        "install and uninstall run against a temporary Vencord tree",
        {
            skip: process.platform === "win32"
        },
        () => {
            const home = fs.mkdtempSync(path.join(os.tmpdir(), "vc-picker-home-"));
            const config =
                process.platform === "darwin"
                    ? path.join(home, "Library", "Application Support", "Vencord")
                    : path.join(home, ".config", "Vencord");
            const preload = path.join(config, "dist", "preload.js");
            const backup = `${preload}.bak-picker-resize`;
            const installed = path.join(config, "dist", "picker-resize");
            const originalPreload = "// fake Vencord preload\n";
            const env = {
                ...process.env,
                HOME: home,
                XDG_CONFIG_HOME: path.join(home, ".config"),
                VENCORD_DIR: config
            };
            const run = (script, args = []) =>
                spawnSync("sh", [script, ...args], {
                    encoding: "utf8",
                    env,
                    cwd: ROOT
                });

            try {
                fs.mkdirSync(path.dirname(preload), { recursive: true });
                fs.writeFileSync(preload, originalPreload, "utf8");

                const install = run(path.join(ROOT, "install.sh"), ["--from-watcher"]);
                assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);

                for (const file of [
                    "install.sh",
                    "picker-resize.js",
                    "loader.js",
                    "uninstall.sh",
                    "unix-common.sh",
                    "watcher.sh"
                ]) {
                    assert.ok(fs.existsSync(path.join(installed, file)), `${file} was not installed`);
                }
                assert.equal(fs.readFileSync(backup, "utf8"), originalPreload);

                let patched = fs.readFileSync(preload, "utf8");
                assert.equal(count(patched, START_MARKER), 1);
                assert.equal(count(patched, END_MARKER), 1);
                assert.ok(patched.startsWith(originalPreload));
                assert.ok(patched.endsWith(END_MARKER));

                // Running the installer again must stay idempotent.
                const reinstall = run(path.join(ROOT, "install.sh"), ["--from-watcher"]);
                assert.equal(reinstall.status, 0, `${reinstall.stdout}\n${reinstall.stderr}`);
                patched = fs.readFileSync(preload, "utf8");
                assert.equal(count(patched, START_MARKER), 1);
                assert.equal(fs.readFileSync(backup, "utf8"), originalPreload);

                const uninstall = run(path.join(installed, "uninstall.sh"));
                assert.equal(uninstall.status, 0, `${uninstall.stdout}\n${uninstall.stderr}`);
                assert.equal(fs.readFileSync(preload, "utf8"), originalPreload);
                assert.equal(fs.existsSync(backup), false);
                assert.equal(fs.existsSync(installed), false);
                assert.deepEqual(fs.readdirSync(path.join(config, "dist")), ["preload.js"]);
            } finally {
                fs.rmSync(home, { recursive: true, force: true });
            }
        }
    );
});
