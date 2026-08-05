"use strict";
import { getXXhash, getColors, getLUT } from "./helpers.js";
const hierarchy = await(await fetch("./hierarchy.json")).json();
const directory = await(await fetch("./directory.json")).json();
const canvas = document.querySelector("#gamearea");
const ctx = canvas.getContext("2d");
const Quantizer = new Worker("./quantize.js", { type: "module" });
const colors = await(await fetch("./colors.json")).json();
const elements = [];
// let ColorLUT;
// for (let i = 0; i < colors.length; i++) {
//     const hashed = xxhash.h32(colors[i])
//     ColorLUT.set(i, hashed);
//     ColorLUT.set(hashed, i);
// }
class Game {
    #on = false;
    #paused = false;
    #resolver = null;
    #speed;
    constructor(speed) { this.#speed = speed; }
    set speed(v) { this.#speed = v; }
    get speed() { return this.#speed; }
    get isPaused() { return this.#paused }
    pause() {
        if (this.#paused) return; //already paused
        this.#paused = true;
    }
    unpause() {
        if (!this.#paused) return;
        this.#paused = false;
        this.#resolver?.();
        this.#resolver = null;
    }
    async #run() {
        while (this.#on) {
            //pause statement
            if (this.#paused) await new Promise(res => this.#resolver = res);
            if (!this.#on) break;
            //game loop here
            this.#gameFunction();
            await new Promise(res => setTimeout(res, this.#speed));
        }
    }
    #gameFunction() {
        console.log("game")
    }
    start() {
        if (this.#on) return; // already on
        this.#on = true;
        this.#run().catch(err => {
            this.#on = false;
            throw err;
        });
    }
    end() {
        this.#on = false;
        this.#paused = false;
        this.#resolver?.();
        this.#resolver = null;
    }
}
async function quantize(imgurl) {
    return new Promise((resolve, reject) => {
        Quantizer.onmessage = e => resolve(e.data);
        Quantizer.onerror = err => reject(err);
        Quantizer.postMessage({ imgurl });
    })
}
async function loadAssets() {
    const directory = await (await fetch("./directory.json")).json();
    for (const item of directory) {
        const result = await quantize(item?.filepath);
        result.name = item.name;
        elements.push(result);
    };
}
// loadAssets();
const temp = await quantize("./OG TMNT-1.png (6).png");
console.log(new Uint8Array(temp.img))
// const result = await quantize("./testBall.jpg");
// const testImg = new Uint8Array(result.img);
// console.log(result);
// for (let i = 0; i < testImg.length; i++) {
//     const px = testImg[i];
//     const x = i % result.w;
//     const y = Math.floor(i / result.w);
//     ctx.fillStyle = `rgb(${colors[px].join(",")})`;
//     ctx.fillRect(x, y, 1, 1);
// }
// console.log("done")