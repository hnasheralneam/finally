"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Position_x, _Position_y, _Building_name, _Building_height, _Building_width;
const ROWS = 10;
const COLS = 10;
let cursorHeight = 5;
let cursorWidth = 5;
let grid = [];
let domGrid = [];
let gridEl = document.querySelector(".grid");
let clearEnabled = false;
function generateGrid() {
    if (gridEl) {
        gridEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    }
    for (let i = 0; i < ROWS; i++) {
        grid[i] = [];
        domGrid[i] = [];
        for (let j = 0; j < COLS; j++) {
            let cell = document.createElement("div");
            cell.classList.add("box");
            addTracking(cell, i, j);
            domGrid[i][j] = cell;
            gridEl === null || gridEl === void 0 ? void 0 : gridEl.appendChild(cell);
        }
    }
    randomizeCellStates();
    let breakEl = document.createElement("br");
    gridEl === null || gridEl === void 0 ? void 0 : gridEl.appendChild(breakEl);
}
function randomizeCellStates() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = Math.floor(Math.random() * 2);
            if (grid[i][j] == 1)
                domGrid[i][j].classList.add("full");
            else
                domGrid[i][j].classList.remove("full");
        }
    }
}
generateGrid();
let mouseOffX = 0;
let mouseOffY = 0;
function addTracking(cell, i, j) {
    function moveEvent(e) {
        mouseOffX = e.clientX - cell.getBoundingClientRect().left;
        mouseOffY = e.clientY - cell.getBoundingClientRect().top;
    }
    cell.addEventListener("mouseover", (e) => {
        cell.addEventListener("mousemove", moveEvent);
        if (!clearEnabled) {
            for (let row = i; row < i + cursorHeight; row++) {
                for (let col = j; col < j + cursorWidth; col++) {
                    if (row < ROWS && col < COLS) {
                        if (grid[row][col] == 1) {
                            domGrid[row][col].classList.add("preview-full");
                        }
                        else {
                            domGrid[row][col].classList.add("preview-empty");
                        }
                    }
                }
            }
        }
        else if (grid[i][j] == 1) {
            domGrid[i][j].classList.add("preview-full");
        }
        else {
            domGrid[i][j].classList.add("preview-empty");
        }
    });
    cell.addEventListener("mouseout", () => {
        cell.removeEventListener("mousemove", moveEvent);
        mouseOffX = 0;
        mouseOffY = 0;
        if (!clearEnabled) {
            for (let row = i; row < i + cursorHeight; row++) {
                for (let col = j; col < j + cursorWidth; col++) {
                    if (row < ROWS && col < COLS) {
                        domGrid[row][col].classList.remove("preview-full");
                        domGrid[row][col].classList.remove("preview-empty");
                    }
                }
            }
        }
        else {
            domGrid[i][j].classList.remove("preview-full");
            domGrid[i][j].classList.remove("preview-empty");
        }
    });
    cell.addEventListener("click", () => {
        if (!clearEnabled) {
            const cursorBuilding = new Building("cursor", cursorHeight, cursorWidth);
            if (canPlaceBuilding(cursorBuilding, new Position(i, j))) {
                placeBuilding(cursorBuilding, new Position(i, j));
            }
        }
        else {
            if (grid[i][j] == 1) {
                grid[i][j] = 0;
                domGrid[i][j].classList.remove("full");
            }
        }
    });
}
function canPlaceBuilding(building, position) {
    if (position.x + building.height > ROWS || position.y + building.width > COLS)
        return false;
    for (let i = position.x; i < building.height + position.x; i++) {
        for (let j = position.y; j < building.width + position.y; j++) {
            if (grid[i][j] == 1) {
                return false;
            }
        }
    }
    return true;
}
// Precodition: canPlaceBuilding is true
function placeBuilding(building, position) {
    for (let i = position.x; i < building.height + position.x; i++) {
        for (let j = position.y; j < building.width + position.y; j++) {
            grid[i][j] = 1;
            domGrid[i][j].classList.add("full");
        }
    }
}
class Position {
    constructor(x, y) {
        _Position_x.set(this, void 0);
        _Position_y.set(this, void 0);
        __classPrivateFieldSet(this, _Position_x, x, "f");
        __classPrivateFieldSet(this, _Position_y, y, "f");
    }
    get x() {
        return __classPrivateFieldGet(this, _Position_x, "f");
    }
    get y() {
        return __classPrivateFieldGet(this, _Position_y, "f");
    }
}
_Position_x = new WeakMap(), _Position_y = new WeakMap();
class Building {
    constructor(name, height, width) {
        _Building_name.set(this, void 0);
        _Building_height.set(this, void 0);
        _Building_width.set(this, void 0);
        __classPrivateFieldSet(this, _Building_name, name, "f");
        __classPrivateFieldSet(this, _Building_height, height, "f");
        __classPrivateFieldSet(this, _Building_width, width, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _Building_name, "f");
    }
    get height() {
        return __classPrivateFieldGet(this, _Building_height, "f");
    }
    get width() {
        return __classPrivateFieldGet(this, _Building_width, "f");
    }
}
_Building_name = new WeakMap(), _Building_height = new WeakMap(), _Building_width = new WeakMap();
const heightSlider = document.querySelector("#heightSlider");
const widthSlider = document.querySelector("#widthSlider");
if (heightSlider && widthSlider) {
    heightSlider.addEventListener("input", () => {
        cursorHeight = parseInt(heightSlider.value);
        updateCursorPreview();
    });
    widthSlider.addEventListener("input", () => {
        cursorWidth = parseInt(widthSlider.value);
        updateCursorPreview();
    });
}
updateCursorPreview();
function updateCursorPreview() {
    let preview = document.querySelector(".cursor-preview");
    if (preview) {
        preview.style.width = `${cursorWidth * 60}px`;
        preview.style.height = `${cursorHeight * 60}px`;
    }
}
document.addEventListener("mousemove", (event) => {
    let preview = document.querySelector(".cursor-preview");
    if (preview) {
        preview.style.left = `${event.clientX - mouseOffX}px`;
        preview.style.top = `${event.clientY - mouseOffY}px`;
    }
});
function toggleClearBlocks() {
    let clearBlock = document.querySelector(".toggle-clear-blocks");
    clearEnabled = !clearEnabled;
    if (clearBlock)
        clearBlock.textContent = clearEnabled ? "Stop clearing blocks" : "Start clearing blocks";
}
let gridRotation = "rotateX(45deg) rotateZ(45deg)";
let gridScale = .5;
function zoomIn() {
    gridScale += .1;
    renderGrid();
}
function zoomOut() {
    if (gridScale > .2)
        gridScale -= .1;
    renderGrid();
}
function renderGrid() {
    if (gridEl)
        gridEl.style.transform = `scale(${gridScale}) ${gridRotation}`;
}
