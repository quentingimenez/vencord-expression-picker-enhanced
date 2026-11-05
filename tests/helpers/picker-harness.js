"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { Blob } = require("node:buffer");

const SOURCE_PATH = path.resolve(__dirname, "..", "..", "src", "picker-resize.js");
const SOURCE = fs.readFileSync(SOURCE_PATH, "utf8");

let compiledScript = null;

function getCompiledScript() {
    compiledScript ??= new vm.Script(SOURCE, { filename: SOURCE_PATH });
    return compiledScript;
}

class FakeClassList {
    constructor() {
        this.classes = new Set();
    }

    add(...names) {
        for (const name of names) this.classes.add(String(name));
    }

    remove(...names) {
        for (const name of names) this.classes.delete(String(name));
    }

    contains(name) {
        return this.classes.has(String(name));
    }

    toggle(name, force) {
        if (force === true) {
            this.add(name);
            return true;
        }
        if (force === false) {
            this.remove(name);
            return false;
        }
        if (this.contains(name)) {
            this.remove(name);
            return false;
        }
        this.add(name);
        return true;
    }

    get value() {
        return [...this.classes].join(" ");
    }
}

class FakeElement {
    constructor(document, tagName) {
        this.ownerDocument = document;
        this.tagName = String(tagName).toUpperCase();
        this.nodeType = 1;
        this.children = [];
        this.parentElement = null;
        this.style = {};
        this.dataset = {};
        this.attributes = {};
        this.listeners = new Map();
        this.classList = new FakeClassList();
        this.isConnected = true;
        this._className = "";
        this._id = "";
        this._innerHTML = "";
        this.textContent = "";
        this.value = "";
        this.rect = null;
        this.clientWidth = 0;
        this.clientHeight = 0;
        this.capturedPointerId = null;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = String(value);
        this.ownerDocument.register(this);
    }

    get className() {
        return this.classList.value;
    }

    set className(value) {
        this.classList.classes.clear();
        for (const name of String(value || "").split(/\s+/)) {
            if (name) this.classList.add(name);
        }
    }

    get innerHTML() {
        return this._innerHTML;
    }

    set innerHTML(value) {
        this._innerHTML = String(value);
    }

    get firstElementChild() {
        return this.children[0] ?? null;
    }

    get nextElementSibling() {
        if (!this.parentElement) return null;
        const siblings = this.parentElement.children;
        const index = siblings.indexOf(this);
        return index >= 0 ? (siblings[index + 1] ?? null) : null;
    }

    appendChild(child) {
        if (child.parentElement) {
            const previous = child.parentElement.children;
            const index = previous.indexOf(child);
            if (index >= 0) previous.splice(index, 1);
        }
        child.parentElement = this;
        child.isConnected = this.isConnected;
        this.children.push(child);
        this.ownerDocument.register(child);
        return child;
    }

    append(...nodes) {
        for (const node of nodes) {
            if (typeof node === "string") {
                this.textContent += node;
            } else {
                this.appendChild(node);
            }
        }
    }

    after(node) {
        if (!this.parentElement) return;
        const siblings = this.parentElement.children;
        const index = siblings.indexOf(this);
        if (index >= 0) {
            node.parentElement = this.parentElement;
            node.isConnected = this.isConnected;
            siblings.splice(index + 1, 0, node);
            this.ownerDocument.register(node);
        }
    }

    remove() {
        if (this.parentElement) {
            const index = this.parentElement.children.indexOf(this);
            if (index >= 0) this.parentElement.children.splice(index, 1);
        }
        this.parentElement = null;
        this.isConnected = false;
    }

    addEventListener(type, listener, options = {}) {
        const entries = this.listeners.get(type) ?? [];
        entries.push({ listener, once: !!options.once });
        this.listeners.set(type, entries);
    }

    removeEventListener(type, listener) {
        const entries = this.listeners.get(type);
        if (!entries) return;
        this.listeners.set(
            type,
            entries.filter((entry) => entry.listener !== listener)
        );
    }

    dispatch(type, init = {}) {
        const event = {
            type,
            target: this,
            currentTarget: this,
            defaultPrevented: false,
            propagationStopped: false,
            preventDefault() {
                this.defaultPrevented = true;
            },
            stopPropagation() {
                this.propagationStopped = true;
            },
            ...init
        };

        const entries = [...(this.listeners.get(type) ?? [])];
        for (const entry of entries) {
            const current = this.listeners.get(type) ?? [];
            if (!current.includes(entry)) continue;
            if (entry.once) this.removeEventListener(type, entry.listener);
            entry.listener.call(this, event);
        }
        return event;
    }

    click() {
        return this.dispatch("click");
    }

    focus() {
        this.ownerDocument.activeElement = this;
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
        if (name === "id") this.id = value;
        if (name === "class") this.className = value;
    }

    getAttribute(name) {
        return this.attributes[name] ?? null;
    }

    removeAttribute(name) {
        delete this.attributes[name];
    }

    setPointerCapture(pointerId) {
        this.capturedPointerId = pointerId;
    }

    releasePointerCapture(pointerId) {
        if (this.capturedPointerId === pointerId) this.capturedPointerId = null;
    }

    matches(selector) {
        return String(selector)
            .split(",")
            .some((part) => this.matchesOne(part.trim()));
    }

    matchesOne(selector) {
        if (!selector) return false;
        if (selector.startsWith(".")) return this.classList.contains(selector.slice(1));
        if (selector.startsWith("#")) return this.id === selector.slice(1);

        const classContains = selector.match(/^\[class\*="([^"]+)"\]$/);
        if (classContains) {
            return [...this.classList.classes].some((name) => name.includes(classContains[1]));
        }

        const attribute = selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);
        if (attribute) {
            const value = this.getAttribute(attribute[1]);
            return attribute[2] == null ? value != null : value === attribute[2];
        }

        return this.tagName === selector.toUpperCase();
    }

    querySelectorAll(selector) {
        const results = [];
        const visit = (node) => {
            for (const child of node.children) {
                if (child.matches(selector)) results.push(child);
                visit(child);
            }
        };
        visit(this);
        return results;
    }

    querySelector(selector) {
        return this.querySelectorAll(selector)[0] ?? null;
    }

    getBoundingClientRect() {
        return (
            this.rect ?? {
                width: this.clientWidth,
                height: this.clientHeight,
                top: 0,
                right: this.clientWidth,
                bottom: this.clientHeight,
                left: 0
            }
        );
    }
}

class FakeDocument {
    constructor(options = {}) {
        this.elements = [];
        this.cookieJar = new Map();
        this.cookieWrites = [];
        this.activeElement = null;
        this.createPixelData = (width, height) => new Uint8ClampedArray(width * height * 4);

        this.documentElement = this.createElement("html");
        this.head = this.createElement("head");
        this.body = this.createElement("body");
        this.documentElement.appendChild(this.head);
        this.documentElement.appendChild(this.body);

        if (options.cookie) this.cookie = options.cookie;
    }

    register(element) {
        if (!this.elements.includes(element)) this.elements.push(element);
    }

    createElement(tagName) {
        const element = new FakeElement(this, tagName);
        this.elements.push(element);

        if (String(tagName).toLowerCase() === "canvas") {
            element.getContext = () => ({
                imageSmoothingQuality: "low",
                clearRect() {},
                drawImage() {},
                getImageData(_x, _y, width, height) {
                    return { data: element.ownerDocument.createPixelData(width, height) };
                }
            });
        }

        return element;
    }

    getElementById(id) {
        return this.elements.find((element) => element.id === id && element.isConnected) ?? null;
    }

    addEventListener() {}
    removeEventListener() {}

    get cookie() {
        return [...this.cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
    }

    set cookie(value) {
        const raw = String(value);
        this.cookieWrites.push(raw);
        const pair = raw.split(";")[0];
        const separator = pair.indexOf("=");
        if (separator < 0) return;
        const name = pair.slice(0, separator).trim();
        const cookieValue = pair.slice(separator + 1).trim();
        if (name) this.cookieJar.set(name, cookieValue);
    }
}

class FakeClock {
    constructor() {
        this.now = 0;
        this.nextId = 1;
        this.tasks = new Map();

        this.setTimeout = this.setTimeout.bind(this);
        this.clearTimeout = this.clearTimeout.bind(this);
        this.setInterval = this.setInterval.bind(this);
        this.clearInterval = this.clearInterval.bind(this);
        this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    }

    setTimeout(callback, delay = 0) {
        const id = this.nextId++;
        this.tasks.set(id, {
            id,
            callback,
            due: this.now + Math.max(0, Number(delay) || 0),
            interval: null
        });
        return id;
    }

    setInterval(callback, delay = 0) {
        const id = this.nextId++;
        const interval = Math.max(1, Number(delay) || 1);
        this.tasks.set(id, {
            id,
            callback,
            due: this.now + interval,
            interval
        });
        return id;
    }

    clearTimeout(id) {
        this.tasks.delete(id);
    }

    clearInterval(id) {
        this.tasks.delete(id);
    }

    requestAnimationFrame(callback) {
        return this.setTimeout(() => callback(this.now), 16);
    }

    advance(milliseconds) {
        const target = this.now + Math.max(0, Number(milliseconds) || 0);

        while (true) {
            let next = null;
            for (const task of this.tasks.values()) {
                if (task.due > target) continue;
                if (!next || task.due < next.due || (task.due === next.due && task.id < next.id)) {
                    next = task;
                }
            }
            if (!next) break;

            this.now = next.due;
            if (next.interval) {
                next.due += next.interval;
            } else {
                this.tasks.delete(next.id);
            }
            next.callback();
        }

        this.now = target;
    }
}

class FakeMutationObserver {
    observe() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

class FakeResizeObserver {
    observe() {}
    disconnect() {}
}

function toPlain(value) {
    return JSON.parse(JSON.stringify(value));
}

function createFixture(options = {}) {
    const document = new FakeDocument({ cookie: options.cookie });
    const clock = new FakeClock();
    const hook = {};
    const logs = [];

    const logger = options.console ?? {
        log: (...args) => logs.push({ level: "log", args }),
        warn: (...args) => logs.push({ level: "warn", args }),
        error: (...args) => logs.push({ level: "error", args })
    };

    const sandbox = {
        console: logger,
        document,
        location: {
            hostname: options.hostname ?? "discord.com",
            href: "https://discord.com/channels/@me"
        },
        navigator: { language: options.locale ?? "en-US" },
        MutationObserver: FakeMutationObserver,
        ResizeObserver: FakeResizeObserver,
        setTimeout: clock.setTimeout,
        clearTimeout: clock.clearTimeout,
        setInterval: clock.setInterval,
        clearInterval: clock.clearInterval,
        requestAnimationFrame: clock.requestAnimationFrame,
        queueMicrotask,
        URL,
        Blob,
        crypto: options.crypto ?? globalThis.crypto,
        createImageBitmap:
            options.createImageBitmap ??
            (async () => ({
                width: 64,
                height: 64,
                close() {}
            })),
        ImageDecoder: options.ImageDecoder,
        Image: options.Image,
        __VC_PICKER_RESIZE_TEST__: hook
    };

    if (options.Vencord !== undefined) sandbox.Vencord = options.Vencord;
    if (options.api !== undefined) sandbox.VencordPickerResize = options.api;
    if (options.extendSandbox) Object.assign(sandbox, options.extendSandbox);

    sandbox.window = sandbox;

    const context = vm.createContext(sandbox);
    const Uint8ClampedArrayInContext = vm.runInContext("Uint8ClampedArray", context);
    document.createPixelData = (width, height) => new Uint8ClampedArrayInContext(width * height * 4);

    getCompiledScript().runInContext(context);

    return {
        hook,
        resize: hook.resize,
        imports: hook.imports,
        document,
        clock,
        sandbox,
        logs,
        Uint8ClampedArray: Uint8ClampedArrayInContext
    };
}

module.exports = {
    FakeClock,
    FakeDocument,
    FakeElement,
    SOURCE,
    SOURCE_PATH,
    createFixture,
    toPlain
};
