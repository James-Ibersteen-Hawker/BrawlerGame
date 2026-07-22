"use strict";
import KDTree from "https://cdn.jsdelivr.net/gh/James-Ibersteen-Hawker/KDTree@v3.0.0/kdtree.js"
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
const colortree = await KDTree.initFrom(colorset);
const result = colortree.search([255,255,255], {includeDistance: true});
console.log(result)