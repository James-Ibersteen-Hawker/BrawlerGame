"use strict";
import KDTree from "https://cdn.jsdelivr.net/gh/James-Ibersteen-Hawker/KDTree@v3.0.0/kdtree.js";
import initXXHash from "https://unpkg.com/xxhash-wasm@1.1.0/esm/xxhash-wasm.js";
let xxhash = null;
const colorsPromise = fetch("./colors.json").then(e => e.json());
let ColorLUT = new Map();
let ColorTree, alphaKey;
async function getHash() { if (!xxhash) xxhash = await initXXHash() }
async function quantize(imgurl, colors) {
    const blob = await (await fetch(imgurl)).blob();
    if (!blob.type.includes("image")) throw new Error(`${imgurl} is not an Image`);
    const bitmap = await createImageBitmap(blob);
    const CANVAS = new OffscreenCanvas(bitmap.width, bitmap.height);
    const QCTX = CANVAS.getContext("2d");
    QCTX.drawImage(bitmap, 0, 0);
    const pixels = QCTX.getImageData(0, 0, bitmap.width, bitmap.height).data;
    const result = new Uint8Array((pixels.length / 4) + 2);
    for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        if (a === 0) result[j] = alphaKey;
        const nearest = ColorTree.search([r, g, b]);
        const hashed = xxhash.h32(nearest);
        const mapKey = ColorLUT.get(hashed);
        if (mapKey === alphaKey) result[j] = ColorLUT.get(xxhash.h32(colors[1]));
        else result[j] = mapKey;
    }
    const w = bitmap.width;
    const h = bitmap.height;
    bitmap.close();
    return [result, w, h];
}
self.onmessage = async function (e) {
    await getHash();
    const colors = await colorsPromise;
    if (!ColorTree) ColorTree = await KDTree.initFrom(colors);
    if (ColorLUT.size === 0) {
        for (let i = 0; i < colors.length; i++) {
            const hashed = xxhash.h32(colors[i])
            ColorLUT.set(i, hashed);
            ColorLUT.set(hashed, i);
        }
    }
    if (!alphaKey) alphaKey = ColorLUT.get(xxhash.h32(colors[0]));
    const [result, w, h] = await quantize(e.data.imgurl, colors);
    const imgBuffer = result.buffer;
    self.postMessage({ img: imgBuffer, w, h }, [imgBuffer])
}