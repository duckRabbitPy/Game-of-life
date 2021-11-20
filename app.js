// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

//write a function that can show next state of world when called

//2D co-ordinate Grid, live or dead at x,y co-ordinate.

// [ [x,y,living], [x,y,living] ...]

let universe = document.getElementById("universe");
let table = document.createElement("table");
let globalState = [];
let init = false;

function nextWorldyState(currWorldState) {
  let nextWorldState = [];
  //loop through 2D array, to apply rules to each cell

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

    if (aliveInNext(neighbours, currWorldState, currLiving)) {
      currLiving = true;
      nextWorldState.push([currCellX, currCellY, currLiving]);
    }
  }
  //as world is potentially infinite, only return state of alive cells
  return nextWorldState;
}

///checks all neighbours and count living
//check for match between neighbour co-ordinates and world array and extract living value
//count living neighbours and determine if survive, revive or die
function aliveInNext(neighbours, currWorldState, currLiving) {
  let countForLiving = 0;
  neighbours.forEach((neighbour) => {
    let countForDead = 0;
    currWorldState.forEach((cell) => {
      //if x and y co-ordinates of currWorldState and neighbours match, you have found the neighbour cell in the current state
      //check and see if that neighbour is alive
      if (cell[0] === neighbour[0] && cell[1] === neighbour[1]) {
        if (cell[2]) {
          countForLiving++;
        }
      } else {
        // console.log("not alive", neighbour[0], neighbour[1]);
        if (
          (cell[0] === neighbour[0] + 1 || cell[0] === neighbour[0] - 1) &&
          (cell[1] === neighbour[1] + 1 || cell[1] === neighbour[1] - 1)
        ) {
          countForDead++;
        }
      }
    });
    if (countForDead > 2) {
      console.log("revive me", neighbour);
    }
  });

  if (currLiving) {
    return countForLiving === 2 || countForLiving === 3 ? true : false;
  }
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
      }
    }
  }

  // return state
  return currWorldState;
}

function renderNextState(currWorldState) {
  const nextWorldState = nextWorldyState(currWorldState);

  if (noChange(currWorldState, nextWorldState)) {
    nextBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");
    alert("Game over! Marvel at your life forms and restart to play again");
    return;
  }

  for (let row of table.rows) {
    for (let cell of row.cells) {
      cell.classList.remove("alive");
      for (let aliveCell of nextWorldState) {
        if (
          aliveCell[0] === Number(cell.dataset.xValue) &&
          aliveCell[1] === Number(cell.dataset.yValue)
        ) {
          cell.classList.add("alive");
        }
      }
    }
  }
  globalState = nextWorldState;
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

const allBtns = document.querySelectorAll("button");
const createBtn = document.querySelector(".create-btn");
const nextBtn = document.querySelector(".next-btn");
const restartBtn = document.querySelector(".restart");
const dimensions = document.querySelector("#dimensions");
const dimensionContainer = document.querySelector(".dimension-container");
const clickableCells = document.querySelectorAll("#table td");
const clickSound = document.querySelector(".clickSound");

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

nextBtn.addEventListener("click", () => {
  //run clickedState update and get currentstate for first time
  if (!init) {
    let currWorldState = clickedStateUpdate();
    renderNextState(currWorldState);
    init = true;
  } else {
    let currWorldState = globalState;
    renderNextState(currWorldState);
  }
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});
