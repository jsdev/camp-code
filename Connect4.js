// Crude Connect4
// One of our early apps we did
// TODO: revisit after make Bejeweled to properly animate ghost falling to bottom available row of column
// TODO: add a tile for the board perhaps yellow or let users choose

speed = 5
targetX = 0
targetY = 0

var player = {};
var currentPlayer = 1;

function initGrid(){
  grid = [];
  for (var i = 0; i < 7; i++) {
    grid[i] = [];
    for (var j = 0; j < 7; j++) {
      grid[i][j] = 0;
    }
  }
}

function drawGrid() {
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      if (grid[i][j] == 0) {
        // Draw empty slot
        stamp('ghost9', i * 100 + 85, j * 100 + 250,95).tap = tapIt(i,i * 100 + 85,j * 100 + 250);
      } else if (grid[i][j] == 1) {
        // Draw player 1's piece
        stamp('ghost4', i * 100 + 85, j * 100 + 250,95);
      } else if (grid[i][j] == 2) {
        // Draw player 2's piece
        stamp('ghost5', i * 100 + 85, j * 100 + 250,95);
      }
    }
  }
  player ={
    1: stamp('ghost10', 60, 80, 100).flip().hide(),
    2: stamp('ghost11', 700, 80, 100).hide()
  }
}

function tapIt (i,x,y) {
  return () => {
    if (gameOver || tapped) return
    lastIndex = grid[i].lastIndexOf(0)
    grid[i][lastIndex] = currentPlayer
		player[currentPlayer].move(x, y, speed * 100)
    tapped = true
    delay(()=>{
      sound('fart2')
      reset('black')
      drawGrid()
      winner = checkConnectFour(grid)
      if (winner) {
        gameOver = true
        dancer = player[winner]
        sound('claps')
        delay(() => {
          dancer.move(386,512).size(400)
          sound('dance')
          dancer.show().dance(), 2000
        })
        delay(() => dancer.dance(), 2000)
        delay(() => dancer.dance(), 3000)
        delay(startGame, 4000)
        return
      } else {
        tapped = false
        currentPlayer = currentPlayer === 1 ? 2 : 1
      	player[currentPlayer].show()
      }
    }, speed * 100)
  }
}

function checkConnectFour(grid) {
    // Check rows & columns
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            let player = grid[r][c];
            if (player == 0) continue;

            // Check right
            if (c + 3 < 7 &&
                player == grid[r][c+1] && // Look right
                player == grid[r][c+2] && // Look right 2
                player == grid[r][c+3])   // Look right 3
                return player;

            // Check down
            if (r + 3 < 6 &&
                player == grid[r+1][c] && // Look down
                player == grid[r+2][c] && // Look down 2
                player == grid[r+3][c])   // Look down 3
                return player;

            // Check down-right
            if (c + 3 < 7 && r + 3 < 6 &&
                player == grid[r+1][c+1] && // Look down-right
                player == grid[r+2][c+2] && // Look down-right 2
                player == grid[r+3][c+3])   // Look down-right 3
                return player;

            // Check down-left
            if (c - 3 >= 0 && r + 3 < 6 &&
                player == grid[r+1][c-1] && // Look down-left
                player == grid[r+2][c-2] && // Look down-left 2
                player == grid[r+3][c-3])   // Look down-left 3
                return player;
        }
    }
    return 0; // No winner
}

function startGame() {
  reset()
  fill('black')
  gameOver = false
  tapped = false
  initGrid();
  drawGrid();
  player[currentPlayer].show()
}

startGame()

