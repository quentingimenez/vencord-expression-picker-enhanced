"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const windows = process.platform === "win32";
const command = windows ? "powershell" : "sh";
const args = windows
    ? ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(ROOT, "scripts", "package-release.ps1")]
    : [path.join(ROOT, "scripts", "package-release.sh")];

const result = spawnSync(command, args, { cwd: ROOT, stdio: "inherit" });
if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}
process.exit(result.status ?? 1);
