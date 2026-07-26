"use strict";
import KDTree from "https://cdn.jsdelivr.net/gh/James-Ibersteen-Hawker/KDTree@v3.0.0/kdtree.js";
const colorsPromise = fetch("./colors.json").then(e => e.json());
let ColorTree;
function quantize(imgurl, colors) {
    console.log(imgurl)
    return imgurl;
}
self.onmessage = async function(e) {
    const colors = await colorsPromise;
    if (!ColorTree) ColorTree = await KDTree.initFrom(colors);
    self.postMessage({ img: quantize(e.data.imgurl, colors) })
}