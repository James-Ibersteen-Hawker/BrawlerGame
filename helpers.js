import initXXHash from "https://unpkg.com/xxhash-wasm@1.1.0/esm/xxhash-wasm.js";
let xxhash = null;
export async function getXXhash() {
    if (!xxhash) xxhash = await initXXHash();
    return xxhash;
}
let colors;
const colorsPromise = fetch("./colors.json").then(e => e.json());
export async function getColors() {
    if (!colors) colors = await colorsPromise;
    return colors;
}
let ColorLUT = new Map();
export async function getLUT() {
    if (!xxhash) xxhash = await getXXhash();
    if (!colors )colors = await getColors();
    if (ColorLUT.size === 0) {
        for (let i = 0; i < colors.length; i++) {
            const hashed = xxhash.h32(colors[i])
            ColorLUT.set(i, hashed);
            ColorLUT.set(hashed, i);
        }
    }
    return ColorLUT;
}