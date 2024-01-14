// Cracker Barrel Solitare
// Finish with one peg
// TODO add different colors
// TODO detect if game over
// TODO add ghost play moves

pieces = []
bufferX = [385,310, 235, 160, 85]
bufferY = 200
pegSize = 150
holeSize = 110
tapped = false
peg = '@PINKGHOST'
pegMoveLeft = '@PINKGHOSTLEFT2'
pegMoveRight = '@PINKGHOSTRIGHT2'// 'ghost10'
hole = 'black'

let grid = [[1],[2,3],[4,5,6],[7,8,9,10],[11,12,13,14,15]];

let index = [
  {value: 1, coords: [0,0]},
  {value: 1, coords: [1,0]}, {value: 1, coords: [1,1]},
  {value: 1, coords: [2, 0]},{value: 0, coords: [2, 1]},{value: 1, coords: [2, 2]},
  {value: 1, coords: [3, 0]},{value: 1, coords: [3, 1]},{value: 1, coords: [3, 2]},{value: 1, coords: [3, 3]},
  {value: 1, coords: [4, 0]},{value: 1, coords: [4, 1]},{value: 1, coords: [4, 2]},{value: 1, coords: [4, 3]},{value: 1, coords: [4, 4]}
];

let moves = {
  [1]: [[2,4],[3,6]],
  [2]: [[4,7],[5,9]],
  [3]: [[5,8],[6,10]],
  [4]: [[2,1],[5,6],[7,11],[8,13]],
  [5]: [[8,12],[9,14]],
  [6]: [[3,1],[5,4],[9,13],[10,15]],
  [7]: [[4,2],[8,9]],
  [8]: [[5,3],[9,10]],
  [9]: [[5,2],[8,7]],
 [10]: [[6,3],[9,8]],
 [11]: [[7,4],[12,13]],
 [12]: [[8,5],[13,14]],
 [13]: [[8,4],[9,6],[12,11],[14,15]],
 [14]: [[9,5],[13,12]],
 [15]: [[10,6],[14,13]],
};

function makeMove(piece, dest){
  sound('flap')
  const x = piece.x;
  const y = piece.y;
  let mover = piece.x > dest.x ? pegMoveLeft : pegMoveRight;
  let s = stamp(mover, x, y, pegSize)
  piece.change(hole).size(holeSize).move(DOWN,10)
  piece.value = 0;
  tapped = false;
  s.move(dest.x, dest.y-10, 800)
  

	delay(()=> {
    dest.change(peg).size(pegSize);
    dest.value = 1;
    s.hide()
    
    if (++count === 14) {
      sound('dance');
      dest.dance();
      delay(() => {
        dest.dance()
        pieces[dest.row].forEach(piece => {
          piece.change(peg).size(pegSize)
          piece.dance()
        })
      }, 1000);
      delay(()=> {
        pieces.forEach(row => {
          console.log(row);
          if (Array.isArray(row))
            row.forEach(hole => {
              hole.change(peg).size(pegSize);
              hole.dance();
            });
        });
      }, 2000);
      delay(() => {
        dest.dance()
      }, 3000);
      delay(startGame, 4000);
    }
  },800)
}

function resetPegBoard(grid){
  let s = null;
  for (let i = 0; i< grid?.length; i++) {
    pieces[i] = [];
    for (let j =0; j < grid[i]?.length; j++) {
      coords = index[grid[i][j]-1].coords
      stamp(hole, coords[1] *pegSize + bufferX[i], coords[0]*pegSize + bufferY, holeSize);
 
      s = stamp(peg, coords[1] *pegSize + bufferX[i], coords[0]*pegSize + bufferY, pegSize);
      s.value = 1;
      s.row = coords[0];
      s.col = coords[1];
      s.tap = function() {
        if (!start) {
         	this.change(hole).size(holeSize);
        	this.value = 0;
        	start = true;
          count++
          resetGame = stamp('ghost9',700,75,100)
  				resetGame.tap = rewind
        	return
        }
        let pegMove = this.x < 350 ? pegMoveRight : pegMoveLeft;
        
        if (!tapped) {
          if (this.name === hole) return
          tapped = this;
          this.change(pegMove);
          this.move(UP, 10)
        	return 
        } else {
          if (this.name === peg && this.value === 1) {
            tapped.move(DOWN, 10)
            tapped.change(peg).size(pegSize)
            
            tapped = this;
            tapped.change(pegMove)
            tapped.move(UP, 10)
            return
          }

          moves[grid[i][j]].forEach(move => {
            let values = move.map(v => {
              coords = index[v-1].coords;
              return pieces[coords[0]][coords[1]];
            });
            if (values[0].value === 1 && values[1].row === tapped.row && values[1].col === tapped.col) {
              values[0].change(hole).size(holeSize);
              values[0].value = 0;
              makeMove(tapped, this)
            }
          });
        }
      }
      pieces[i].push(s)
    }
  }
}

function rewind() {
 	sound('rewind')
  delay(startGame, 1500)
}

function startGame() {
  reset()
  count = 0
  fill('wallpaper')
  pieces = []
  gameOver = true
  start = false
  resetPegBoard(grid)
}

startGame()
