// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

//write a function that can show next state of world when called

//2D co-ordinate Grid, live or dead at x,y co-ordinate.

// [ [x,y,living], [x,y,living] ...]

let globalState = [];
let universe = document.getElementById("universe");
let table = document.createElement("table");

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
  let count = 0;
  neighbours.forEach((neighbour) => {
    currWorldState.forEach((cell) => {
      if (cell[0] === neighbour[0] && cell[1] === neighbour[1]) {
        if (cell[2]) {
          count++;
        }
      }
    });
  });

  if (currLiving) {
    return count >= 2 ? true : false;
  } else if (!currLiving) {
    return count >= 3 ? true : false;
  }
}

function createUniverse(numRows, numColumns) {
  let currWorldState = [];

  table.setAttribute("id", "table");

  for (let x = 0; x < numRows; x++) {
    let tableRow = document.createElement("tr");
    for (let y = 0; y < numColumns; y++) {
      let datacell = document.createElement("td");

      if (startsAlive()) {
        datacell.classList.add("alive");
        datacell.dataset.xValue = x;
        datacell.dataset.yValue = y;
        datacell.dataset.living = "true";
        currWorldState.push([x, y, true]);
      } else {
        datacell.dataset.xValue = x;
        datacell.dataset.yValue = y;
        datacell.dataset.living = "false";
        currWorldState.push([x, y, false]);
      }
      tableRow.appendChild(datacell);
    }
    table.appendChild(tableRow);
  }
  universe.appendChild(table);
  return currWorldState;
}

function startsAlive() {
  return Math.random() > 0.8 ? true : false;
}

function renderNextState(currWorldState) {
  const nextWorldState = nextWorldyState(currWorldState);

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

let nextBtn = document.querySelector(".start-btn");
let dimensions = document.querySelector(".dimensions");

nextBtn.addEventListener("click", () => {
  globalState = createUniverse(50, 80);
});

setInterval(() => {
  renderNextState(globalState);
}, 500);
