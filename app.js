// Rules
// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

// Write a function that can show next state of world when called

// 2D co-ordinate Grid, live or dead at x,y co-ordinate.

// [ [x,y,living], [x,y,living] ...]

const allBtns = document.querySelectorAll("button");
const createBtn = document.querySelector(".create-btn");
const nextBtn = document.querySelector(".next-btn");
const restartBtn = document.querySelector(".restart");
const dimensions = document.querySelector("#dimensions");
const dimensionContainer = document.querySelector(".dimension-container");
const instructions = document.querySelector(".instructions");
const generations = document.querySelector(".generations");
const gen = document.querySelector("#gen");
const clickableCells = document.querySelectorAll("#table td");
const clickSound = document.querySelector(".clickSound");

let universe = document.getElementById("universe");
let table = document.createElement("table");
let globalState = [];
let globalGen = 0;
let init = false;

function nextWorldyState(currWorldState) {
  let nextWorldState = [];
  //loop through 2D array, to apply rules to each cell
  //current world state should have all co-ordinates

  for (let i = 0; i < currWorldState.length; i++) {
    let currCellX = currWorldState[i][0];
    let currCellY = currWorldState[i][1];
    let currLiving = currWorldState[i][2];

    let neighbours = [
      [currCellX - 1, currCellY + 1],
      [currCellX, currCellY + 1],
      [currCellX + 1, currCellY + 1],
      [currCellX + 1, currCellY],
      [currCellX + 1, currCellY - 1],
      [currCellX, currCellY - 1],
      [currCellX - 1, currCellY - 1],
      [currCellX - 1, currCellY],
    ];

    let count = 0;

    neighbours.forEach((neighbour) => {
      //now the co-ordinates of neighbouring cells are known, retrieve the actual living state from state array
      currWorldState.forEach((cell) => {
        //if x and y co-ordinates of currWorldState and neighbour co-ordinates match, retrieve living state of neighbour cell in question
        if (cell[0] === neighbour[0] && cell[1] === neighbour[1]) {
          if (cell[2]) {
            count++;
          }
        }
      });
    });

    if ((count === 2 || count === 3) && currLiving) {
      currLiving = true;
      nextWorldState.push([currCellX, currCellY, currLiving]);
    } else if (count === 3 && !currLiving) {
      currLiving = true;
      nextWorldState.push([currCellX, currCellY, currLiving]);
    } else {
      currLiving = false;
      nextWorldState.push([currCellX, currCellY, currLiving]);
    }
  }

  return nextWorldState;
}

function createUniverse(numRows, numColumns) {
  table.setAttribute("id", "table");

  for (let x = 0; x < numRows; x++) {
    let tableRow = document.createElement("tr");
    for (let y = 0; y < numColumns; y++) {
      let datacell = document.createElement("td");
      datacell.dataset.xValue = x;
      datacell.dataset.yValue = y;
      datacell.dataset.living = "false";

      datacell.addEventListener("click", (event) => {
        if (globalState.length === 0) {
          event.target.classList.add("alive");
          event.target.dataset.living = "true";
        }
      });

      datacell.addEventListener("mouseover", (event) => {
        if (globalState.length === 0 && event.ctrlKey) {
          event.target.classList.add("alive");
          event.target.dataset.living = "true";
        }
      });

      tableRow.appendChild(datacell);
    }
    table.appendChild(tableRow);
  }
  universe.appendChild(table);
}

function clickedStateUpdate() {
  // first introduction of state
  let currWorldState = [];

  for (let row of table.rows) {
    for (let cell of row.cells) {
      let x = parseInt(cell.dataset.xValue);
      let y = parseInt(cell.dataset.yValue);
      if (cell.dataset.living === "true") {
        currWorldState.push([x, y, true]);
      } else {
        currWorldState.push([x, y, false]);
      }
    }
  }

  // return state
  return currWorldState;
}

function renderNextState(currWorldState) {
  const nextWorldState = nextWorldyState(currWorldState);

  for (let row of table.rows) {
    for (let cell of row.cells) {
      cell.classList.remove("alive");
      for (let cellState of nextWorldState) {
        if (
          cellState[0] === Number(cell.dataset.xValue) &&
          cellState[1] === Number(cell.dataset.yValue) &&
          cellState[2] === true
        ) {
          cell.classList.add("alive");
        }
      }
    }
  }
  globalState = nextWorldState;
  console.log(globalState);
}

let noChange = function (arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    let nestedArr1 = arr1[i];
    let nestedArr2 = arr2[i];
    for (let y = 0; y < nestedArr1; y++) {
      if (nestedArr1[y] !== nestedArr2[y]) return false;
    }
  }
  return true;
};

allBtns.forEach((button) => {
  button.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});

createBtn.addEventListener("click", () => {
  createUniverse(dimensions.value, dimensions.value);
  // no state at this point
  createBtn.classList.add("hidden");
  dimensionContainer.classList.add("hidden");
  nextBtn.classList.remove("hidden");
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

nextBtn.addEventListener("click", () => {
  //run clickedState update and get currentstate for first time
  setInterval(timeTick, 200);
  instructions.classList.add("hidden");
  nextBtn.classList.add("hidden");
});

function timeTick() {
  if (!init) {
    let currWorldState = clickedStateUpdate();
    renderNextState(currWorldState);
    init = true;
  } else {
    let currWorldState = globalState;
    renderNextState(currWorldState);
  }
  globalGen++;
  gen.innerHTML = globalGen;
  generations.classList.remove("hidden");
}
