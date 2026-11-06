/** Validates an input file, converts it when needed, and builds its record. */
async function importFile(file) {
    if (file.size > MAX_INPUT_BYTES) {
        throw new Error(t("fileTooLarge"));
    }

    const originalName = String(file.name || "import");
    const type = String(file.type || "").toLowerCase();
    const name = originalName.toLowerCase();
    let result;

    if (type === "image/gif" || hasExtension(name, GIF_EXTENSIONS)) {
        if (file.size > MAX_OUTPUT_BYTES) {
            throw new Error(t("gifTooLarge"));
        }
        const dimensions = await measureImage(file);
        result = { blob: file, width: dimensions.width, height: dimensions.height };
    } else if (type.startsWith("video/") || hasExtension(name, VIDEO_EXTENSIONS)) {
        result = await convertVideo(file);
    } else if (type.startsWith("image/") || hasExtension(name, IMAGE_EXTENSIONS)) {
        result = await convertImage(file);
    } else {
        throw new Error(t("unsupportedFormat"));
    }

    if (!result?.blob || result.blob.size > MAX_OUTPUT_BYTES) {
        throw new Error(t("convertedTooLarge"));
    }

    const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return {
        id,
        name: originalName.replace(/\.[^.]+$/, "") + ".gif",
        blob: result.blob,
        width: result.width,
        height: result.height,
        size: result.blob.size,
        createdAt: Date.now()
    };
}

async function measureImage(blob) {
    try {
        const bitmap = await createImageBitmap(blob);
        const dimensions = { width: bitmap.width, height: bitmap.height };
        bitmap.close?.();
        if (!dimensions.width || !dimensions.height) {
            throw new Error(t("imageUnreadable"));
        }
        return dimensions;
    } catch {
        if (typeof Image !== "function") {
            throw new Error(t("imageUnreadable"));
        }
        return new Promise((resolve, reject) => {
            const image = new Image();
            const url = URL.createObjectURL(blob);
            image.onload = () => {
                URL.revokeObjectURL(url);
                if (!image.naturalWidth || !image.naturalHeight) {
                    reject(new Error(t("imageUnreadable")));
                    return;
                }
                resolve({ width: image.naturalWidth, height: image.naturalHeight });
            };
            image.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error(t("imageUnreadable")));
            };
            image.src = url;
        });
    }
}

function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error(t("conversionFailedGeneric"));
    context.imageSmoothingQuality = "high";
    return { canvas, context };
}

function captureFrame(context, source, width, height, delay) {
    context.clearRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);
    return {
        data: context.getImageData(0, 0, width, height).data,
        delay
    };
}

function encodeSingleFrame(source, width, height, delay = 1000) {
    const { context } = createCanvas(width, height);
    return encodeFrames([captureFrame(context, source, width, height, delay)], width, height);
}

async function convertImage(file) {
    if (typeof ImageDecoder === "function") {
        let decoder = null;
        try {
            const data = await file.arrayBuffer();
            decoder = new ImageDecoder({ data, type: file.type || "image/png" });
            await decoder.tracks.ready;
            const track = decoder.tracks.selectedTrack;
            const frameCount = clamp(track?.frameCount ?? 1, 1, MAX_IMAGE_FRAMES);

            const first = await decoder.decode({ frameIndex: 0 });
            const sourceWidth = first.image.displayWidth || first.image.codedWidth;
            const sourceHeight = first.image.displayHeight || first.image.codedHeight;
            if (!sourceWidth || !sourceHeight) throw new Error(t("imageUnreadable"));
            const { width, height } = fit(sourceWidth, sourceHeight);

            const { context } = createCanvas(width, height);
            const frames = [];
            let totalDelay = 0;
            for (let index = 0; index < frameCount && totalDelay < MAX_DURATION * 1000; index++) {
                const frame = index === 0 ? first : await decoder.decode({ frameIndex: index });
                const rawDuration = frame.image.duration;
                const delay =
                    frameCount === 1 ? 1000 : Math.min(1000, Math.max(20, Math.round((rawDuration || 100000) / 1000)));

                try {
                    frames.push(captureFrame(context, frame.image, width, height, delay));
                } finally {
                    frame.image.close?.();
                }
                totalDelay += delay;
                if (index % 2 === 0) await yieldToUI();
            }

            if (frames.length === 0) throw new Error(t("noFrames"));
            return {
                blob: encodeFrames(frames, width, height),
                width,
                height
            };
        } catch (error) {
            console.warn(`${LOG_PREFIX} ImageDecoder failed, trying static image`, error);
        } finally {
            try {
                decoder?.close?.();
            } catch {
                /* The decoder may already be closed. */
            }
        }
    }

    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        throw new Error(t("imageUnreadable"));
    }
    if (!bitmap.width || !bitmap.height) {
        bitmap.close?.();
        throw new Error(t("imageUnreadable"));
    }

    const { width, height } = fit(bitmap.width, bitmap.height);
    try {
        return {
            blob: encodeSingleFrame(bitmap, width, height, 1000),
            width,
            height
        };
    } finally {
        bitmap.close?.();
    }
}

async function convertVideo(file) {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    try {
        await new Promise((resolve, reject) => {
            let settled = false;
            let timeout = 0;
            const finish = (callback, value) => {
                if (settled) return;
                settled = true;
                clearTimeout(timeout);
                video.onloadedmetadata = null;
                video.onerror = null;
                callback(value);
            };

            timeout = setTimeout(() => finish(reject, new Error(t("videoReadTimeout"))), TIMINGS.videoMetadata);
            video.onloadedmetadata = () => finish(resolve);
            video.onerror = () => finish(reject, new Error(t("videoUnsupported")));
        });

        const sourceWidth = video.videoWidth;
        const sourceHeight = video.videoHeight;
        if (!sourceWidth || !sourceHeight) throw new Error(t("invalidVideoDimensions"));

        const { width, height } = fit(sourceWidth, sourceHeight);
        const duration =
            Number.isFinite(video.duration) && video.duration > 0
                ? Math.min(video.duration, MAX_DURATION)
                : MAX_DURATION;
        const frameCount = clamp(Math.ceil(duration * FPS), 1, MAX_VIDEO_FRAMES);

        const { context } = createCanvas(width, height);
        const frames = [];
        const frameDelay = Math.round(1000 / FPS);
        for (let index = 0; index < frameCount; index++) {
            const time = clamp(duration - 0.001, 0, index / FPS);
            await seekVideo(video, time);
            frames.push(captureFrame(context, video, width, height, frameDelay));
            if (index % 2 === 0) await yieldToUI();
        }

        return {
            blob: encodeFrames(frames, width, height),
            width,
            height
        };
    } finally {
        try {
            video.pause();
        } catch {
            /* ignore */
        }
        video.removeAttribute("src");
        try {
            video.load();
        } catch {
            /* ignore */
        }
        URL.revokeObjectURL(url);
    }
}

function seekVideo(video, time) {
    return new Promise((resolve, reject) => {
        let settled = false;
        let timeout = 0;

        const cleanup = () => {
            clearTimeout(timeout);
            video.removeEventListener("seeked", onSeeked);
        };
        const settle = (callback, value) => {
            if (settled) return;
            settled = true;
            cleanup();
            callback(value);
        };
        const onSeeked = () => settle(resolve);

        timeout = setTimeout(() => settle(() => reject(new Error(t("videoConvertTimeout")))), TIMINGS.videoSeek);

        if (Math.abs(video.currentTime - time) < 0.001 && video.readyState >= 2) {
            requestAnimationFrame(onSeeked);
            return;
        }

        video.addEventListener("seeked", onSeeked);
        try {
            video.currentTime = time;
        } catch (error) {
            settle(() => reject(error));
        }
    });
}

function encodeFrames(frames, width, height) {
    if (!frames?.length) throw new Error(t("noFrames"));
    if (!width || !height) throw new Error(t("conversionFailedGeneric"));
    const encoder = Gifenc.GIFEncoder();
    for (const frame of frames) {
        const palette = Gifenc.quantize(frame.data, 256);
        const index = Gifenc.applyPalette(frame.data, palette);
        encoder.writeFrame(index, width, height, {
            palette,
            delay: frame.delay,
            repeat: 0,
            dispose: 2
        });
    }
    encoder.finish();
    return new Blob([encoder.bytes()], { type: "image/gif" });
}
