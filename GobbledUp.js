// Gobbled Up
// Options: Gobbler board wither 3x3 with 6 pieces || 4x4 with 12 pieces
// Not sure have exact rules down as I allow any type to be placed on board
// Allow players to select their colors
// Added Easter Egg of sorts for selecting same color

nextBoardSize = localStorage.gobbled_up_board_size  === undefined ? 3 : parseInt(localStorage.gobbled_up_board_size);
const getOpposing = n => (n+1) % 2;
const isPieceOnGameBoard = piece => piece.y < 700;
const buffer = 85;
const hidePieces = pieces => pieces.forEach(o => o?.piece?.hide())

function getRowCol(x,y) {
  let row = Math.floor((y - buffer)/squareSize);
  let col = Math.floor((x - buffer)/squareSize);

  return { row, col }
}
const notSameSquareCoords = (square, piece) =>
	!(square.x + square.width_/2 === piece.x && square.y + square.width_/2 === piece.y);

players = []
current = 0
player = null
pieceClicked = 0
beginPosition = {x:0,y:0}
gameOver = true
loneGhost = {
    color: 'yellow',
    border: 'gold',
    stamp: '@ghost15',
    stampMove: 'ghost15'
  },
ghosts = [
  {
    color: 'rgb(220,255,220)',
    border: 'green',
    stamp: 'ghost4',
    stampMove: 'ghost10'
  },
  {
    color: 'pink',
    border: 'rose',
    stamp: 'ghost5',
    stampMove: 'ghost11'
  },
    {
    color: 'skyblue',
    border: 'blue',
    stamp: 'ghost6',
    stampMove: 'ghost12'
  },
  {
    color: 'rgb(156,134,191)',
    border: 'purple',
    stamp: 'ghost7',
    stampMove: 'ghost13'
  },
  {
    color: 'rgb(247,151,122)',
    border: 'orange',
    stamp: 'ghost8',
    stampMove: 'ghost14'
  },
  {
    color: 'rgb(157,155,155)',
    border: 'silver',
    stamp: 'ghost9',
    stampMove: 'ghost16'
  }
]
nextPlayers = [
//  ghosts[0],
//  ghosts[1]
	ghosts[parseInt(localStorage.gobbled_up_ghost_0 || 0)],
  ghosts[parseInt(localStorage.gobbled_up_ghost_1 || 1)]
]

drawBoardPieces = {
	[4]: s => [{
      piece: stamp(s.stamp, 165, 800, sizes[2]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 605, 800, sizes[2]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 165, 900, sizes[2]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 605, 900, sizes[2]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 270, 800, sizes[1]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 270, 900, sizes[1]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 500, 800, sizes[1]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 500, 900, sizes[1]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 350, 810, sizes[0]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 350, 890, sizes[0]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 420, 810, sizes[0]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 420, 890, sizes[0]),
      size:2,
      color: s.color
    }],
  [3]: (s) => [{
      piece: stamp(s.stamp, 165, 850, sizes[2]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 325, 810, sizes[1]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 335, 920, sizes[0]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 460, 790, sizes[0]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 455, 890, sizes[1]),
      size:2,
      color: s.color
    },{
      piece: stamp(s.stamp, 605, 850, sizes[2]),
      size:2,
      color: s.color
    }]
}


function drawBoard() {
  board = [];
  valueBoard = ''
  for (let i = 0; i < boardSize; i++) {
    board.push([])
    for (let j = 0; j < boardSize; j++) {
      board[i].push([])
      box(i*squareSize + buffer, j*squareSize + buffer, squareSize, squareSize, 'almond','onyx').tap = boxTap;
      valueBoard = valueBoard + '0'
    }
  }
}

// Function to add a piece to the board
function addPiece(row, col, size, color) {
  // If there's no piece at the location or the new piece is larger than the top piece
  if (board[row][col].length === 0 || size > getTopPiece(row, col)?.size) {
    board[row][col].push({size, color, value: player.value});
    updateValueBoard(row, col, boardSize, player.value);
    return true
  }
  return false
}

function updateValueBoard(row,col,boardSize,value) {
  valueArray = valueBoard.split('');
  valueArray[row*boardSize + col] = value;
  valueBoard = valueArray.join('');
}

// Function to remove the top piece from the board
function removePiece(row, col) {
  board[row][col].pop();
  let value = board[row][col].length ?
    board[row][col][board[row][col].length-1].value : 0;
  updateValueBoard(row, col, boardSize, value);
}

// Function to get the top piece on a spot
function getTopPiece(row, col) {
  let len = board[row][col].length;
  return len ? board[row][col][len - 1] : {};
}

function checkConsecutiveValues(matrixString, playerValue) {
  // Calculate the size of the matrix
  let size = Math.sqrt(matrixString.length);

  // Convert the string into a square matrix
  let matrix = [];
  for (var i = 0; i < size; i++) {
    matrix[i] = matrixString.slice(i*size, i*size + size).split('');
  }

  // Prepare the consecutive player values string
  let consecutiveValues = `${playerValue}`.repeat(size)

  // Check rows and columns
  for (let i = 0; i < size; i++) {
    if (matrix[i].join('') === consecutiveValues) return true;
    if (matrix.map(row => row[i]).join('') === consecutiveValues) return true;
  }

  // Check the two diagonals
  if (Array(size).fill().map((_, i) => matrix[i][i]).join('') === consecutiveValues) return true;
  if (Array(size).fill().map((_, i) => matrix[i][size-i-1]).join('') === consecutiveValues) return true;

  // If no consecutive player values found
  return false;
}

function checkWin(value) {
    return checkConsecutiveValues(valueBoard, value)
}

function startGame(){
  boardSize = nextBoardSize + 0
  SIZES = {
    [3]: [80,120,200],
    [4]: [75,100,150]
  };
  sizes = SIZES[boardSize];
  sounds = {
    [sizes[0]]: 'click',
    [sizes[1]]: 'clang',
    [sizes[2]]: 'smash'
  }
  squareSize = sizes[sizes.length-1]
  reset();
  gameOver = false
  hovering = null
	drawBoard();
  if (nextPlayers[0].stamp === nextPlayers[1].stamp) {
    players = [nextPlayers[0], loneGhost]
  } else {
		players = [...nextPlayers]
  }
	players[0].pieces = drawBoardPieces[boardSize](players[0]);
  players[1].pieces = drawBoardPieces[boardSize](players[1]);
	players[0].pieces.forEach((o,i) => o.piece.tap = pieceTapped(0, i));
	players[1].pieces.forEach((o,i) => o.piece.tap = pieceTapped(1, i));
	players[0].value = 1
  players[1].value = 2

  hidePieces(players[1].pieces);
  current = 0;
	player = players[current];
  gear = stamp('gear',768-45,1024-45,80)
  gear.tap = showSettings
}

function showSettings() {
  gameOver = true
  gear.hide()
  b = box(0,0,768,1024,'onyx','onyx')
  gridSelecter = circle(-1000,-1000,0,'silver','onyx')
  player1Selector = circle(-1000,-1000,0,'rgb(255,220,220)','onyx')
  player2Selector = circle(-1000,-1000,0,'rgb(220,220,255)','onyx')
  arrow = stamp('arrow16',768 - 45, 1024-45,80)
  dispose = [b, arrow]
  // text("Gobble JR",100,100)
  // text("Gobble It",420,100)
  grid = [
  	box(150,100,150,150,'almond','onyx'),
  	line(200,100,200,250),
    line(150,150,300,150),
    line(250,100,250,250),
    line(150,200,300,200),
    box(450,100,200,200,'almond','onyx'),
    line(450,150,650,150),
    line(500,100,500,300),
    line(450,200,650,200),
    line(550,100,550,300),
    line(450,250,650,250),
    line(600,100,600,300),
  ]
  const selectGrid = (grid) => {
    if (grid===3) {
      gridSelecter.size(110).move(225,175)
	    nextBoardSize = 3
  	  localStorage.gobbled_up_board_size = 3
      return
    }
    gridSelecter.size(144).move(550,200)
    nextBoardSize = 4
    localStorage.gobbled_up_board_size = 4
  }
  grid3 = box(150,100,150,150,'clear');
  grid4 = box(450,100,200,200,'clear');
	grid3.tap = () => selectGrid(3)
  grid4.tap = () => selectGrid(4)
  
  ghostTaps = 0
  
  function selectPlayer(i) {
    let ghostCoords =[
      {x: 184, y: 512},
      {x: 384, y: 512},
      {x: 584, y: 512},
      {x: 184, y: 752},
      {x: 384, y: 752},
      {x: 584, y: 752}
    ], selector = [
      player1Selector, player2Selector
    ], ndex = ghostTaps % 2;
    
    selector[ndex].move(ghostCoords[i].x,ghostCoords[i].y)
    localStorage[`gobbled_up_ghost_${ndex}`] = i
    nextPlayers[ndex] = ghosts[i]
    ghostTaps++;
  }
  
  [
  	stamp('ghost4',184,512,200),
    stamp('ghost5',384,512,200),
    stamp('ghost6',584,512,200),
    stamp('ghost7',184,752,200),
    stamp('ghost8',384,752,200),
    stamp('ghost9',584,752,200)    
  ].forEach((ghost, i) => {
  	ghost.tap = () => selectPlayer(i);
  })
	arrow.tap = () => delay(startGame, 10)
  selectGrid(nextBoardSize)
}

function switchPlayers(){
  console.log(valueBoard)
  hidePieces(player.pieces)
	current = getOpposing(current)
  player = players[current]
  player.pieces.forEach(o => o?.piece?.show())
}

function winnerDance(p) {
  sound('dance');
  dancer = stamp(p.stamp)
  dancer.dance()
  delay(() => dancer.dance(),1000)
  delay(() => dancer.dance(),2000)
  delay(() => dancer.dance(),3000)
  delay(startGame,4000)
}

function boxTap() {
  let { row, col } = getRowCol(this.x, this.y)
  let opponent = players[getOpposing(current)];
  let dancer;
	if (gameOver) return true
  if (hovering && notSameSquareCoords(this, beginPosition) && player.stampMove === hovering.name && addPiece(row,col,hovering.width_, player.color)) {
      hovering
        .move(this.x + this.width_/2, this.y + this.width_/2)
      	.change(players[current].stamp)
      	.front()
    	sound(sounds[hovering.width_])
    this.change(player.color,player.border)
    let o = this;
    let changeBack= () => o.change('almond','onyx')
    delay(changeBack, 3000)
    player.pieces[pieceClicked].piece.hide = () => {}
    // CHECKING OPPONENT FIRST AS MOVE MIGHT HAVE REVEALED CONNECTION
    if (checkWin(opponent.value)) {
      sound('ninja');
      gameOver = true;
      delay(()=> { winnerDance(opponent)},1000)
      return
    }
    if (checkWin(player.value)) {
      sound('claps');
      gameOver = true;
      hovering.dance();
      delay(()=> { winnerDance(player)},1000)
			return
    }
    hovering = null
    switchPlayers()
  }
  if (hovering && !notSameSquareCoords(this, beginPosition) && player.stampMove === hovering.name) {
    removePiece(row, col)
    return
  }
}

function pieceTapped(p, index) {
  return function () {
    if (current !== p || gameOver || (hovering && isPieceOnGameBoard(hovering)))
      return
    if (hovering && !isPieceOnGameBoard(hovering)) {
      hovering.change(player.stamp)
      hovering.move(DOWN,50)
      hovering = null
      return;
    }
    beginPosition = { x: this.x, y: this.y }
    if (isPieceOnGameBoard(beginPosition)) {
    	let {row, col} = getRowCol(this.x, this.y);
      if (this.width_ !== getTopPiece(row,col)?.size)
      	return
    }
    this.change(player.stampMove)
    hovering = this
    hovering.move(UP,50)
    pieceClicked = index
  }
}
startGame()
