var jewels = [
  'pixelwhite',
  'jewel1',
  'jewel2',
  'jewel3',
  'jewel4',
  'jewel5',
  'jewel6',
  'jewel7'
];
const jewelCount = 3;
const gemSize = 100;
var buffer = 80;
var gridSize = 5;
var grid = [];
var tapped = false;
var matchedExploded = false;
const hasEmpty = o => o.value === 0; 
const tappedOut = () => tapped = false;
const randomJewelName = () => Math.floor(Math.random() * jewelCount)+1;  
const randomJewel = (row, col)=> mineJewel(randomJewelName(), row, col);

function randomGrid() {
  for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
      grid[i][j] = randomJewel(i, j);
    }
  }
}
function drawGrid(grid){
  for (var row = 0; row < gridSize; row++) {
    for (var col = 0; col < gridSize; col++) {
      grid[row][col].change(jewels[grid[row][col]?.value]);
    }
  }
}

function moveIntoSquareBelow(grid) {
  zeroCount = 0;
  for (var row = grid.length; row >=0; row--) {
    for (var col = 0; col < grid[row].length; col++) {
      if (grid[row][col].value === 0) {
        zeroCount++;
        if (row === 0) {
//          grid[row][col].value = randomJewelName
//          grid[row][col].change(jewels[randomJewelName])
        } else {
          grid[row][col].value = grid[row-1][col].value 
          grid[row][col].change(jewels[grid[row-1][col].value])
          grid[row-1][col].value = 0;
          grid[row-1][col].change(jewels[0]);
        }
      }
    }
  }
  if (!zeroCount) {
    matchedExploded = false;
  }
}

function loop () {
  if (matchedExploded){
    moveIntoSquareBelow(grid)
  }
}

function mineJewel(value, row, col) {
  var gem = stamp(jewels[value], buffer+ gemSize * (gridSize -col), buffer+ gemSize * row, gemSize);
  gem.row = row;
  gem.col = col;
  gem.value = value;

  return gem;
}


// Define a function to handle the tap event
function onTap() {
  if (tapped) return false
  this.tap = null
  tapped = true
  // Get the stamp that was tapped
  var s = this
  s.pop()
  for(var row = s.row; row >= 0; row-- ) {
    var gem = grid[row][s.col]

    gem.move(DOWN,gemSize,300)
    delay(tappedOut, 301)
  }
}

// Seems to have compile errors below
function hasZeros(grid) {
  for (var row = 0; row < grid?.length; row++) {
    for (var col = 0; col < grid[row].length; col++) {
      if (grid[row][col].value === 0) {
        return true;
      }
    }
  }
  return false;
}

function findMatches(grid) {
  var matchedRows = [], matchedRow = [], row, col, i, type, matchLength;

  for (row = 0; row < grid?.length; row++) {
    for (col = 0; col < grid[row]?.length - 2; col++) {
      type = grid[row][col].value;
      matchLength = 1;
      while (col + matchLength < grid[row]?.length && grid[row][col + matchLength].value === type) {
        matchLength++;
      }
      if (matchLength >= 3) {
        matchedRows.push(grid[row].slice(col, col + matchLength));
      }
      col += matchLength - 1; // Skip checked jewels
    }
  }

  for (col = 0; col < grid[0].length; col++) {
    for (row = 0; row < grid.length - 2; row++) {
      type = grid[row][col].value;
      matchLength = 1;
      while (row + matchLength < grid.length && grid[row + matchLength][col].value === type) {
        matchLength++;
      }
      if (matchLength >= 3) {
        matchedRow = [];
        for (i = row; i < row + matchLength; i++) {
          matchedRow.push(grid[i][col]);
        }
        matchedRows.push(matchedRow);
      }
      row += matchLength - 1;
    }
  }
  return matchedRows;
}

function startGame() {
  randomGrid();
  var matchedRows = findMatches(grid) || [];
  if (matchedRows?.length) {
    removeMatches(matchedRows);
    delay(()=> matchedExploded = true, 100)
  }
}

function removeMatches(matchedRows) {
  matchedRows.forEach(matchedRow => matchedRow.forEach(({row, col}) => {
    grid[row][col].pow()
    grid[row][col].value = 0;
    delay(() => grid[row][col].change(jewels[0]), 1000)
  }))
}

startGame();
