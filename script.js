"use strict";
import KDTree from "https://cdn.jsdelivr.net/gh/James-Ibersteen-Hawker/KDTree@v3.0.0/kdtree.js"
const canvas = document.querySelector("#gamearea");
const ctx = canvas.getContext("2d");
function colorGenerator() {
    const colors = [];
    const [r, g, b] = [[], [], []]
    for (let i = 0; i < 6; i++) r.push(((255 / 5)) * i)
    for (let i = 0; i < 7; i++) g.push(Math.floor((255 / 6) * i))
    for (let i = 0; i < 6; i++) b.push((255 / 5) * i)
    for (let ri = 0; ri < r.length; ri++) {
        for (let gi = 0; gi < g.length; gi++) {
            for (let bi = 0; bi < b.length; bi++) {
                colors.push([r[ri], g[gi], b[bi]])
            }
        }
    }
    return colors;
}
const colorset = colorGenerator().map(e => {
    return e.map(n => n.toString(16).padStart(2,0)).join("");
});
console.log(colorset)
for (let i = 0; i < colorset.length; i++) {
    const x = i % 42;
    const y = Math.floor(i / 42);

    ctx.fillStyle = `#${colorset[i]}`;
    ctx.fillRect(x, y, 1, 1);
}
// const colortree = await KDTree.initFrom(colorset);
// const result = colortree.search([255,255,255], {includeDistance: true});

class Game {
    #paused = false;
    #speed;
    #resolver = null;
    #on = false;
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