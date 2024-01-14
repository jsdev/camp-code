// This is where 2 players take turns trying to sink same opposing fleet
// Both can win, we track hits, and sunken ships
// We add options for battleships to be diagonal || default false
// We add options to track own misses || default true
// We add options to check opponent misses || default false

current = 0
squareSize = 76
buffer = {
  x: squareSize/2+2,
  y: 300
}
hasDiagonals = localStorage.battleship_diagonals === undefined ?
  false : JSON.parse(localStorage.battleship_diagonals);
markMisses = localStorage.battleship_mark_misses === undefined ?
  false : JSON.parse(localStorage.battleship_mark_misses);
showOwnMisses = localStorage.battleship_show_own_misses === undefined ?
  true : JSON.parse(localStorage.battleship_show_own_misses);


buoy = ['@buoy','@buoy4']

function switchPlayer() {
  player.avatar.hide();
  if(!markMisses && player.buoys && player.buoys.length)
    player.buoys.forEach(buoy => buoy.hide());
	current = (current + 1) % 2;
  player = players[current];
  player.avatar.show();
  if(showOwnMisses && player.buoys && player.buoys.length)
    player.buoys.forEach(buoy => buoy.show());
}

function showSettings() {
  gameOver = true
  gear.hide()
  b = box(0,0,768,1024,'onyx','onyx')
  toggleBand = box(600,225,100,50,'clear', 'onyx');
  toggle = box(575,200,150,100,'clear', 'onyx');
  diagonalSelector = circle(-1000,-1000,0,'silver','onyx')
  toggleBand2 = box(600,425,100,50,'clear', 'onyx');
  toggle2 = box(575,400,150,100,'clear', 'onyx');
  markMissSelector = circle(-1000,-1000,0,'silver','onyx')
  toggleBand3 = box(600,625,100,50,'clear', 'onyx');
  toggle3 = box(575,600,150,100,'clear', 'onyx');
  showOwnMissSelector = circle(-1000,-1000,0,'silver','onyx')
  text("ALLOW DIAGONALS",525,270, 52, 'pearl', RIGHT)
  text("MARK MISSES",525,470, 52, 'pearl', RIGHT)
  text("MARK OWN MISSES",525,670, 52, 'pearl', RIGHT)
  arrow = stamp('arrow16',768 - 45, 1024-45,80)
  dispose = [b, arrow]
  
  const selectOwnMarker = marker => {
    if (!marker) {
      showOwnMissSelector.change('silver', 'onyx').size(50).move(625,650)
      toggleBand3.change('silver', 'onyx')
	    showOwnMisses = false
  	  localStorage.battleship_show_own_misses = false
      return
    }
    showOwnMissSelector.change('green', 'onyx').size(50).move(675,650)
    toggleBand3.change('green', 'onyx')
    showOwnMisses = true
    localStorage.battleship_show_own_misses = true
  }

  const selectMissMarker = marker => {
    if (!marker) {
      markMissSelector.change('silver', 'onyx').size(50).move(625,450)
      toggleBand2.change('silver', 'onyx')
	    markMisses = false
  	  localStorage.battleship_mark_misses = false
      return
    }
    markMissSelector.change('green', 'onyx').size(50).move(675,450)
    toggleBand2.change('green', 'onyx')
    markMisses = true
    localStorage.battleship_mark_misses = true
  }
  
  const selectDiagonals = diagonal => {
    if (!diagonal) {
      diagonalSelector.change('silver', 'onyx').size(50).move(625,250)
      toggleBand.change('silver', 'onyx')
	    hasDiagonals = false
  	  localStorage.battleship_diagonals = false
      return
    }
    diagonalSelector.change('green', 'onyx').size(50).move(675,250)
    toggleBand.change('green', 'onyx')
    hasDiagonals = true
    localStorage.battleship_diagonals = true
  }
  toggle.tap = () => selectDiagonals(!hasDiagonals)
  toggle2.tap = () => selectMissMarker(!markMisses)
  toggle3.tap = () => selectOwnMarker(!showOwnMisses)
	arrow.tap = () => delay(startGame, 10)
  selectDiagonals(hasDiagonals)
  selectMissMarker(markMisses)
  selectOwnMarker(showOwnMisses)
}

function generateBoardWithDiagonals() {
    let board = Array(10).fill().map(() => Array(10).fill(0));
    let ships = [5, 4, 3, 3, 2];  // Sizes of the ships
    let shipValues = [5, 4, 3, 2, 1];  // Unique values for each ship

    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        let shipValue = shipValues[i];
        let valid = false;
        while (!valid) {
            let orientation = Math.random() < 0.5 ? (Math.random() < 0.5 ? 'horizontal' : 'vertical') : (Math.random() < 0.5 ? 'diagonal1' : 'diagonal2');
            let x, y;
            if (orientation === 'horizontal') {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * (10 - ship + 1));
                if (board[x].slice(y, y + ship).every(val => val === 0)) {
                    valid = true;
                    for (let j = 0; j < ship; j++) {
                        board[x][y + j] = shipValue;
                    }
                }
            } else if (orientation === 'vertical') {
                x = Math.floor(Math.random() * (10 - ship + 1));
                y = Math.floor(Math.random() * 10);
                if (board.slice(x, x + ship).map(row => row[y]).every(val => val === 0)) {
                    valid = true;
                    for (let j = 0; j < ship; j++) {
                        board[x + j][y] = shipValue;
                    }
                }
            } else if (orientation === 'diagonal1') {  // Diagonal from top-left to bottom-right
                x = Math.floor(Math.random() * (10 - ship + 1));
                y = Math.floor(Math.random() * (10 - ship + 1));
                let diagonal = [];
                for (let j = 0; j < ship; j++) {
                    diagonal.push(board[x + j][y + j]);
                }
                if (diagonal.every(val => val === 0)) {
                    valid = true;
                    for (let j = 0; j < ship; j++) {
                        board[x + j][y + j] = shipValue;
                    }
                }
            } else {  // Diagonal from top-right to bottom-left
                x = Math.floor(Math.random() * (10 - ship + 1));
                y = Math.floor(Math.random() * (10 - ship + 1)) + ship - 1;
                let diagonal = [];
                for (let j = 0; j < ship; j++) {
                    diagonal.push(board[x + j][y - j]);
                }
                if (diagonal.every(val => val === 0)) {
                    valid = true;
                    for (let j = 0; j < ship; j++) {
                        board[x + j][y - j] = shipValue;
                    }
                }
            }
        }
    }
    return board;
}

function generateBoard() {
    let board = Array(10).fill().map(() => Array(10).fill(0));
    let ships = [5, 4, 3, 3, 2];  // Sizes of the ships
    let shipValues = [5, 4, 3, 2, 1];  // Unique values for each ship

    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        let shipValue = shipValues[i];
        let valid = false;
        while (!valid) {
            let orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            if (orientation === 'horizontal') {
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * (10 - ship + 1));
                if (board[x].slice(y, y + ship).every(val => val === 0)) {
                    valid = true;
                    for (let j = 0; j < ship; j++) {
                        board[x][y + j] = shipValue;
                    }
                }
            } else {
                let x = Math.floor(Math.random() * (10 - ship + 1));
                let y = Math.floor(Math.random() * 10);
                if (board.slice(x, x + ship).map(row => row[y]).every(val => val === 0)) {
                    valid = true;
                    for (let j = 0; j < ship; j++) {
                        board[x + j][y] = shipValue;
                    }
                }
            }
        }
    }
    return board;
}
function hitTotals() {
  reset()
  fill('black')
  if (players[0].strikes > players[1].strikes) {
    text('MOST SHIPS',250,100,60, 'pearl', LEFT);
    text(`HIT: ${players[0].strikes}`,250,200,120, 'pearl', LEFT);
    stamp('@aura', 105, 125,200)
  } else {
    text('MOST SHIPS',70,100,60, 'pearl', LEFT);
    text(`HIT: ${players[1].strikes}`,70,200,120, 'pearl', LEFT);
    stamp('@elias', 664, 125,200)
  }
  tap = shipTotals
}

shipNames = [
  '',
  'Destroyer',
  'Submarine',
  'Cruiser',
	'Battleship',
  'Carrier'
]

function getCol(x) {
  return Math.floor((x - buffer.x)/squareSize)
}
function getRow(x) {
  return Math.floor((x - buffer.y)/squareSize)
}

function isShipSunk(board,ship) {
    return !board.some(row => row.includes(ship));
}

function shipTotals() {
  reset()
  fill('black')
  if (players[0].ships > players[1].ships) {
    text('MOST SHIPS',250,100,60, 'pearl', LEFT);
    text(`SUNK: ${players[0].ships}`,250,200,120, 'pearl',LEFT);
    stamp('@aura', 105, 125,200)
  } else {
    text('MOST SHIPS',70,100,60, 'pearl', LEFT);
		text(`SUNK: ${players[1].ships}`,70,200,120, 'pearl', LEFT);
    stamp('@elias', 664, 125,200)
  }
  players[0].ships = 0;
  players[0].strikes = 0;
  players[0].buoys = [];
  players[1].ships = 0;
  players[1].strikes = 0;
  players[1].buoys = [];
  delay(() => tap = startGame, 100)  
}

function compareXY(obj1, obj2) {
  return obj1.x === obj2.x && obj1.y === obj2.y;
}

function missleStrike() {
  gear.hide()
  let col = getCol(this.x);
  let row = getRow(this.y);
  console.log(player.buoys, this);
  if ( gameOver || (this.tapped && player.buoys.some(buoy => compareXY(buoy, this))) ) return

  let target = parseInt(board[row][col]);
  board[row][col] = 0;
  if ( target > 0) {
    sound('hit');
    stamp(buoy[current], buffer.x + col * squareSize, buffer.y + row * squareSize, squareSize);
    player.strikes = player.strikes + 1;
    this.tapped = true

    if (isShipSunk(board, target)) {
      sound('claps');
      player.ships = player.ships + 1;
      let t1 = text(`${shipNames[target]}`, 375,100, 50, 'pearl', CENTER);
      let t2 = text('SUNK!!!', 375,175, 80, 'pearl', CENTER);
			shipCount--
      delay(() => {
        t1.hide();
        t2.hide();
      },2000);
 
      if (shipCount === 0) {
        gameOver = true
	      delay(hitTotals,2001)
      }
    }
  } else {
    sound('splash');
    stamp('splash', buffer.x + col * squareSize, buffer.y + row * squareSize, 100);
    if (markMisses || showOwnMisses) {
      this.tapped = true
      let buoy = stamp('@buoy2', buffer.x + col * squareSize, buffer.y + row * squareSize, squareSize/4);
      if (player.buoys && Array.isArray(player.buoys))
         player.buoys.push(buoy);
      delay(()=> buoy.size(squareSize/2), 100)
      delay(()=> buoy.size(squareSize),300)
    }
    switchPlayer();
  }
}

function startGame(){
  gameOver = false
  reset()
  fill('waves3')
  gear = stamp('@piratesettings2',current ? 45 : 768-45,45,80)
  gear.tap = showSettings
  shipCount = 5
  board = hasDiagonals ?
    generateBoardWithDiagonals() : generateBoard()

  players = [{
    pic: '@aura',
    x: 105,
    y: 125,
    size: 200,
    ships: 0,
    strikes: 0,
    buoys: [],
    avatar: stamp('@aura', 105, 125,200)
  },{
    pic: '@elias',
    x: 664,
    y: 125,
    size: 200,
    ships: 0,
    strikes: 0,
    buoys: [],
    avatar: stamp('@elias', 664, 125,200)
  }]
  players[0].avatar.hide()
  players[1].avatar.hide()
  player = players[current]
	player.avatar.show()

  for(let row = 0; row < 10; row++) {
    for(let col = 0; col < 10; col++) {
	    stamp('chalksquare', buffer.x + col * squareSize, buffer.y + row * squareSize, squareSize).tap = missleStrike
    }
  }
  tap = null
}
startGame()
