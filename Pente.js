// PenteJS Deluxe
// Allows for 2-4 players
// Allows for board size 13x13 || 19x19
// Allows for team vs team play

matrixLength = 13;
size = 55;
pieceSize = 25;
fontSize = 40
gameOver = false;
selcted = null
players = [
  { color: "rgb(109,207,247)", stamp: "ghost12", score: 0 },
  { color: "rgb(247,151,122)", stamp: "ghost14", score: 0 },
  { color: "rgb(128,203,171)", stamp: "ghost10", score: 0 },
  { color: "rgb(156,134,190)", stamp: "ghost13", score: 0 }
];
function setGrid13x13(selected) {
  return () => {
    matrixLength = 13;
    size = 55;
    pieceSize = 25;
    selected.move(110,925)
  }
}
function setGrid19x19(selected) {
  return () => {
    matrixLength = 19;
	  size = 38;
    pieceSize = 20;
  	selected.move(650,925)
  }
}

function startTeamGame () {
  team = true;
	startGame(4)()
}

function selectPlayers() {
  team = false;
  gameOver = false
  reset()
    text("DELUXE", 375, 60, 50, "Nova Cut", CENTER)

  text("PENTE", 375, 200, 150, "Nova Cut", CENTER)
  text("Snatch 5 pairs, or line up 5", 375, 290, 48, "Nova Cut", CENTER);
  x = 0;
  y = 440;
  imageWidth = 80;

  for (i = 2; i <= players.length; i++) {
    textStamp = text(`${i} GHOSTS`, 400, y, 50, "black");
    for (j = 0; j < i; j++) {
      stamp(players[j].stamp, 400 - 50 * (j + 1), y - 20, imageWidth);
    }

    box(0, -70 + y, 1000, 100, "clear", 'clear').tap = startGame(i)

    y += 100;
  }

  stamp(players[2].stamp, 275, y, imageWidth);
  stamp(getTeammate(2).stamp, 275 + imageWidth/2, y, imageWidth);

  stamp(players[3].stamp, 525, y, imageWidth);
  stamp(getTeammate(3).stamp, 525 - imageWidth/2, y, imageWidth);

  textStamp = text('VS', 400, y+20, 50, "black", CENTER);
  box(0, -50 + y, 1000, 100, "clear").tap = startTeamGame
  
  selected = box(10, 850, 200, 150, "clear", 'gray')
  if (matrixLength === 19) selected.move(650,925)
  text("13x13", 110, 950, 60, "Nova Cut", CENTER)
  box(10, 850, 200, 150, "clear", 'clear').tap = setGrid13x13(selected)
  text("19x19", 650, 950, 60, "Nova Cut", CENTER)
  box(550,850, 200, 150, "clear", 'clear').tap = setGrid19x19(selected)
}

selectPlayers();

score = {};
resetScore = () => players.forEach((player) => (player.score = 0));

function startGame(num) {
  return () => {
    circles = [];
		matrix = [];
    tapped = false;
    for(let i=0; i<matrixLength; i++) {
      matrix[i] = [];
      for(let j=0; j<matrixLength; j++) {
        matrix[i][j] = 'x';
      }
    }
    numberOfPlayers = num;
    reset();
    current = 0;
    player = players[current];
    resetScore();
    currentPlayer = box(0, 0, 1000, size, player.color).show();
		let i = 0
    for (i = 0; i < matrixLength; i++) {
      for (var j = 0; j < matrixLength; j++) {
        box(size + i * size, size+j * size, size, size, 'clear',
            ![i,j].includes(matrixLength-1) ? 'gray' : 'clear'
        ).tap = layPiece;
      }
    }
    captureTotalsText = {}
    captures = {}
    for (i=0;i<numberOfPlayers;i++) {
      captures[players[i].color] = []      
      captureTotalsText[players[i].color] = stamp(players[i].stamp, size*1.5, 775 + size * i, size)
    }

  }
}

function getTeammate(n) {
  return players[(n + 2) % 4]
}


function switchPlayer() {
  current = (current + 1) % numberOfPlayers
  player = players[current]
  currentPlayer.change(player.color);
  tapped = false
}

function outOfIndex(x, y) {
  return x < 0 || y < 0 || x >= matrixLength || y >= matrixLength
}

function layPiece() {
  if (tapped) return
  o = {
    x: (this.x -size)/size,
    y: (this.y -size)/size
  }
  if (
    outOfIndex(o.x, o.y) ||
    matrix[o.y][o.x]!== 'x'
  ) return
  tapped = true
  circles.push({
    piece: circle(this.x, this.y, pieceSize, player.color, 'black'),
    indexes: o
  })
  sound('block', 10)
  matrix[o.y][o.x] = current;
	capturePairs(o.y, o.x);
	if (
   	!gameOver &&
    checkDiagonal(o.y, o.x) &&
    checkHorizontal(o.y) &&
    checkVertical(o.x)
  ) { delay(switchPlayer,  200) }
}

function checkConsecutiveFive(row, current) {
  return row.join('').includes(`${current}${current}${current}${current}${current}`)
}

function movePiecesOffBoard(pieces) {
  pieces.forEach((piece, index) => {
    let {x,y} = piece
    let circleIndex = circles.findIndex(({
      indexes
    }) => 
                 Object.is(indexes.y, y) &&
                 Object.is(indexes.x, x)
                )
    if (circleIndex >=0) {
      let circle = circles[circleIndex]
      circles.splice(circleIndex,1);
      if(circle?.piece) {
        let count = captures[player.color];
        captures[player.color] = ++count;
        circle.piece.move(size*1.5 + count*size, 775 + size * current, 500)
        tempMatrix[y][x] = 'x'
      }
    }
  })
}

function captureIfPair(arr) {
  let pieces = arr.map(o=>o.piece);
  console.log(pieces.join(''))
  if (
    arr.length === 4 &&
    pieces[3] === pieces[0] &&
    pieces[1] === pieces[2] && 
    !['x',pieces[0]].includes(pieces[1])
  ) {
    let SUM = pieces.reduce((a, b) => a + b, 0);
    console.log({team, SUM});
    if (team && [4,8].includes(SUM)) return
    sound('game')
    movePiecesOffBoard(arr.slice(1,3))
  }
}

function winningTeamDance() {
  teammate = stamp(getTeammate(current).stamp,540,500,300)
  dancer = stamp(player.stamp,220,500,300)

  sound('dance')

  dancer.dance()
  teammate.dance()
  delay(() => {
    dancer.dance()
    teammate.dance()
  }, 1500)
  delay(selectPlayers, 5000)
}


function winningDance() {
  if (team) {
  	winningTeamDance()
    return
  }
  
  sound('dance')
  dancer = stamp(player.stamp,400)
  dancer.dance()
  delay(() => dancer.dance(), 1500)
  delay(selectPlayers, 3000)
}

function capturePairs(row, col) {
  tempMatrix = matrix;
  const VERT_ROW = tempMatrix.map(row => row[col]);
  const VERT_UP = row >= 3 ? VERT_ROW.slice(row - 3, row+1) : false;
  const VERT_DOWN = row <= matrixLength - 4 ? VERT_ROW.slice(row,row+4) : false;

  if (VERT_UP) {
    arr = VERT_UP.map((piece,i) => ({
      piece,
      y: row-i,
      x: col
    }))

    // VERTICAL UP
    console.log('VERT UP')
    captureIfPair(arr)
  }

  if (VERT_DOWN) {
    arr = VERT_DOWN.map((piece,i) => ({
      piece,
      y: row+i,
      x: col
    }))
    // VERTICAL DOWN
    console.log('VERT DOWN')
    captureIfPair(arr)
  }
  
  const HORIZ_LEFT = col >= 3 ? tempMatrix[row].slice(col - 3, col+1) : false;
  const HORIZ_RIGHT = col <= matrixLength - 4 ? tempMatrix[row].slice(col,col+4) : false;
  
  if (HORIZ_RIGHT) {
    arr = HORIZ_RIGHT.map((piece,i) => ({
          piece,
          y: row,
          x: col+i
    }))
    // HORIZONTAL RIGHT
    console.log('HORIZ RIGHT')
    captureIfPair(arr)
  }

  if (HORIZ_LEFT) {
    arr = HORIZ_LEFT.map((piece,i) => ({
      piece,
      y: row,
      x: col-i
    }))
    // HORIZONTAL LEFT
    console.log('HORIZ LEFT')
    captureIfPair(arr)
  }
  
  arr = [{
    piece: tempMatrix[row][col],
    y: row,
    x: col
  }]
  
  for(let i = 1; i <= 3; i++) {
    if(row+i < matrixLength && col+i < matrixLength) {
      arr.push({
        piece: tempMatrix[row+i][col+i],
        y: row+i,
        x: col+i
      });
    }
  }
  // DIAGONAL DOWN RIGHT
  console.log('DIAGONAL DOWN RIGHT')
  captureIfPair(arr)
  
  arr = [{
    piece: tempMatrix[row][col],
    y: row,
    x: col
  }]

  for(let i = 1; i <= 3; i++) {
    if(row-i >= 0 && col-i >= 0) {
      arr.push({
        piece: tempMatrix[row-i][col-i],
        y: row-i,
        x: col-i
    	});
    }
  }
  
  // DIAGONAL UP LEFT
  console.log('DIAGONAL UP LEFT')
  captureIfPair(arr)

  arr = [{
    piece: tempMatrix[row][col],
    y: row,
    x: col
  }]

  for(let i = 1; i <= 3; i++) {
    if(row-i >= 0 && col+i < matrixLength) {
      arr.push({
        piece: tempMatrix[row-i][col+i],
        y: row-i,
        x: col+i
    	});
    }
  }
	// DIAGONAL UP RIGHT
  console.log('DIAGONAL UP RIGHT')
  captureIfPair(arr)

  arr = [{
    piece: tempMatrix[row][col],
    y: row,
    x: col
  }]

  for(let i = 1; i <= 3; i++) {
    if(col-i >= 0 && row+i < matrixLength) {
      arr.push({
        piece: tempMatrix[row+i][col-i],
        y: row+i,
        x: col-i
    	});
    }
  }
  // DIAGONAL DOWN LEFT
  console.log('DIAGONAL DOWN LEFT')
  captureIfPair(arr)
  matrix = tempMatrix;
  if (captures[player.color] >=10){
    gameOver = true;
    delay(winningDance, 1500);
  }
}

function checkHorizontal(index) {
  if (checkConsecutiveFive(matrix[index], current) ) {
    gameOver = true;
    delay(winningDance, 100);
    return false;
  }
  return true;
}

function checkVertical(index) {
  if (checkConsecutiveFive(matrix.map(row => row[index]), current) ) {
    gameOver = true;
    delay(winningDance, 100);
    return false;
  }
  return true
}

function checkDiagonal(row, col) {
  let arr = [current]

  for(let i = 1; i <= 4; i++) {
    if(row+i < matrixLength && col+i < matrixLength) {
      arr.push(matrix[row+i][col+i]);
    }
  }
  for(let i = 1; i <= 4; i++) {
    if(row-i >= 0 && col-i >= 0) {
      arr.unshift(matrix[row-i][col-i]);
    }
  }

  if (checkConsecutiveFive(arr, current) ) {
    gameOver = true;
    delay(winningDance, 100);
    return false
  }

  arr = [current]

  for(let i = 1; i <= 4; i++) {
    if(row-i >= 0 && col+i < matrixLength) {
      arr.push(matrix[row-i][col+i]);
    }
  }

  for(let i = 1; i <= 4; i++) {
    if(col-i >= 0 && row+i < matrixLength) {
      arr.unshift(matrix[row+i][col-i]);
    }
  }

  if (checkConsecutiveFive(arr, current) ) {
    gameOver = true;
    delay(winningDance, 100);
    return false
  }
  return true
}
