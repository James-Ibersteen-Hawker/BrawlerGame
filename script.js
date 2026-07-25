"use strict";
import KDTree from "https://cdn.jsdelivr.net/gh/James-Ibersteen-Hawker/KDTree@v3.0.0/kdtree.js"
const colors = await (await fetch("./colors.json")).json();
const hierarchy = await (await fetch("./hierarchy.json")).json();
const directory = await (await fetch("./directory.json")).json();
const canvas = document.querySelector("#gamearea");
const ctx = canvas.getContext("2d");
const ColorTree = await KDTree.initFrom(colors);
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