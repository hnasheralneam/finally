const ROWS: number = 10;
const COLS: number = 10;

let cursorHeight: number = 5;
let cursorWidth: number = 5;

let grid: number[][] = [];
let domGrid: HTMLElement[][] = [];

let gridEl: HTMLElement | null = document.querySelector(".grid");

let clearEnabled = false;


function generateGrid() {
   if (gridEl) {
      gridEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
   }

   for (let i = 0; i < ROWS; i++) {
      grid[i] = [];
      domGrid[i] = [];
      for (let j = 0; j < COLS; j++) {
         grid[i][j] = Math.floor(Math.random() * 2);

         let cell: HTMLElement = document.createElement("div");
         cell.classList.add("box");
         if (grid[i][j] == 1) cell.classList.add("full");
         addTracking(cell, i, j);
         domGrid[i][j] = cell;
         gridEl?.appendChild(cell);
      }
   }
   let breakEl: HTMLElement = document.createElement("br");
   gridEl?.appendChild(breakEl);
}

generateGrid();

let mouseOffX: number = 0;
let mouseOffY: number = 0;

function addTracking(cell: HTMLElement, i: number, j: number) {
   function moveEvent(e: MouseEvent) {
      mouseOffX = e.clientX - cell.getBoundingClientRect().left;
      mouseOffY = e.clientY - cell.getBoundingClientRect().top;
   }
   cell.addEventListener("mouseover", (e: MouseEvent) => {
      cell.addEventListener("mousemove", moveEvent);

      if (!clearEnabled) {
         for (let row = i; row < i + cursorHeight; row++) {
            for (let col = j; col < j + cursorWidth; col++) {
               if (row < ROWS && col < COLS) {
                  if (grid[row][col] == 1) {
                     domGrid[row][col].classList.add("preview-full");
                  } else {
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

function canPlaceBuilding(building: Building, position: Position): boolean {
   if (position.x + building.height > ROWS || position.y + building.width > COLS) return false;
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
function placeBuilding(building: Building, position: Position) {
   for (let i = position.x; i < building.height + position.x; i++) {
      for (let j = position.y; j < building.width + position.y; j++) {
         grid[i][j] = 1;
         domGrid[i][j].classList.add("full");
      }
   }
}

class Position {
   #x: number;
   #y: number;

   constructor(x: number, y: number) {
      this.#x = x;
      this.#y = y;
   }

   get x() {
      return this.#x;
   }
   get y() {
      return this.#y;
   }
}

class Building {
   #name: string;
   #height: number;
   #width: number;

   constructor(name: string, height: number, width: number) {
      this.#name = name;
      this.#height = height;
      this.#width = width;
   }

   get name() {
      return this.#name;
   }
   get height() {
      return this.#height;
   }
   get width() {
      return this.#width;
   }
}



const heightSlider: HTMLInputElement | null = document.querySelector("#heightSlider");
const widthSlider: HTMLInputElement | null = document.querySelector("#widthSlider");

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
   let preview: HTMLElement | null = document.querySelector(".cursor-preview");
   if (preview) {
      preview.style.width = `${cursorWidth * 60}px`;
      preview.style.height = `${cursorHeight * 60}px`;
   }
}

document.addEventListener("mousemove", (event) => {
   let preview: HTMLElement | null = document.querySelector(".cursor-preview");
   if (preview) {
      preview.style.left = `${event.clientX - mouseOffX}px`;
      preview.style.top = `${event.clientY - mouseOffY}px`;
   }
});


function toggleClearBlocks() {
   let clearBlock: HTMLElement | null = document.querySelector(".toggle-clear-blocks");
   clearEnabled = !clearEnabled;
   if (clearBlock) clearBlock.textContent = clearEnabled ? "Stop clearing blocks" : "Start clearing blocks";
}