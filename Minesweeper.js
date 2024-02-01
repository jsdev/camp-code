// MinesweeperJS
// TODO: seems to random timing bug

var grid = [];
var tapped = null;
var gridSize = 15;
var gridSizeY = 20;
var gameCount = 0;
var bombCount = 0;
var gameOver = false;
var gameStatus;
var portal = [
  'whitebox',
  '@mines1',
  '@mines2',
  '@mines3',
  '@mines4',
  '@mines5',
  '@mines6',
  '@mines7',
  '@mines8'
];

function makeArray(){
  var array = [];
  var tileSize = 51.2;
  for (var row = 0; row < gridSizeY; row++) {
    array[row] = [];
    for (var col = 0; col < gridSize; col++) {
      var s = stamp(
        'chalksquare',
        tileSize/2 + col*tileSize,
        tileSize/2 + row*tileSize,
        tileSize
      );
      s.row = row;
      s.col = col;
      s.revealed = false;
      s.tap = notBomb;
      array[row].push(s);
    }
  }

  return array;
}

function revealBomb() {
  tapped = this;
	return explodeBomb(tapped)
}

function explodeBomb(tile) {
  var explode = random('bomb', 'bomb2');
  if (tile.change) {
    tile.change('bomb');
    gameOver = true;
    sound(explode);
  }
}

function revealTile(tile) {
  var row = tile.row;
  var col = tile.col;
  if (gameOver || tile.revealed) {
    return;
  }
  var reveal = countAdjacentMines(row, col);
  tile.change(portal[reveal]).back();
  gameCount++;
  tile.revealed = true;
  if (!reveal) {
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        var newX = col + dx;
        var newY = row + dy;
        if (isValidCoordinate(newY, newX)) {
          revealTile(grid[newY][newX])
        }
      }
    }
  } else {
    // if use portal assets
    //tile.size(90);
  }
}

function isValidCoordinate(y, x) {
  return x >= 0 && x < gridSize && y >= 0 && y < gridSizeY
}

function countAdjacentMines(y,x) {
  var count = 0;
  for (var dx = -1; dx <= 1; dx++) {
    for (var dy = -1; dy <= 1; dy++) {
      var newX = x + dx;
      var newY = y + dy;

      if (isValidCoordinate(newY, newX) && grid[newY][newX].mine === true) {
        count = count + 1;
      }
    }
  }
  return count
}

function notBomb() {
  tapped = this;
  delay(()=> {
    revealTile(tapped);
    tapped = false;
  }, 10)
}

function tap() {
  if (!bombCount) {
    bombCount = random(gridSizeY*2,gridSize*4);
	  for (var i = 0; i < bombCount; i++) {
      row = random(gridSizeY)-1;
      col = random(gridSize)-1;
      if (grid[row][col].mine === true || (row === tapped.row && col === tapped.col)) {
        i--;
      } else {
        grid[row][col].mine = true; 
        grid[row][col].tap = revealBomb;
      }
    }
    gameCount++;
    return
  }
  if (gameOver) {
  	gameStatus.change('YOU LOSE!!');
    sound('boo');
    delay(startGame,5000);
    return
  }
  const discoverable = gridSize * gridSizeY - bombCount;
  if (discoverable === gameCount) {
    gameStatus.change('YOU WIN!!!');
    sound('claps')
  	delay(startGame,5000);
    return
  }
  if (gameCount+5 >= discoverable) {
    gameStatus.change('BE CAREFUL');
  }
}

function startGame() {
  var x, y;
  reset();
  fill('white');
  gameStatus = text('', 375, 950, 100, 'black', CENTER);
  gameCount = 0;
  bombCount = 0;
  grid = makeArray();
}

startGame()

