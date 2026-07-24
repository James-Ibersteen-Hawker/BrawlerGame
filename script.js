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
const colorset = colorGenerator();
for (let i = 0; i < colorset.length; i++) {
    const x = i % 42;
    const y = Math.floor(i / 42);

    ctx.fillStyle = `rgb(${colorset[i].join(",")})`;
    ctx.fillRect(x, y, 1, 1);
}
const colortree = await KDTree.initFrom(colorset);
const result = colortree.search([255,255,255], {includeDistance: true});
console.log(result)

//clock function
let GAME_ON = false;
let PAUSE_GAME = false;
let UNPAUSE_GAME = () => {};
const GAME_SPEED = 100; //ms between iterations
async function RUN() {
    while (GAME_ON) {
        await new Promise((resolve) => {
            if (PAUSE_GAME === true) UNPAUSE_GAME = resolve;
            else {
                UNPAUSE_GAME = () => {};
                resolve();
            }
        })
        //game running every so often
        await new Promise((res) => setTimeout(res, GAME_SPEED));
    }
}