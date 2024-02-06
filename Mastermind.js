// MasterMind
// ToDo Count Guesses, and declare game over
const colors = ["ghost4", "ghost5", "ghost6", "ghost7", "ghost8", "ghost9"];
const floating = ["ghost10", "ghost11", "ghost12", "ghost13", "ghost14", "ghost16"];

let tapped = null

function placePeg() {
  if (!tapped) return;
  this.change(tapped.name)
  this.i = tapped.i
}

function areHolesAllFilled(holes) {
  return holes.every(hole => hole.i !== undefined)
}

function selectPeg() {
  if (tapped) {
    console.log(tapped);
    tapped.change(colors[tapped.i]);
  }
  tapped = this;
  tapped.change(floating[this.i]);
}

function drawPegs() {
  let pegs = []
  for (let i = 0; i < 6; i++) {
    pegs.push(stamp(colors[i], 700, 350 + i * 110, 100));
    pegs[i].i = i;
    pegs[i].tap = selectPeg;
  }
  return pegs;
}

function drawHoles() {
  let holes = [];
  for (let i = 0; i < 4; i++) {
    holes.push(stamp('black', 225 + i * 90, 260, 70));
    holes[i].tap = placePeg;
  }
  submit = stamp('magnifyingglass', 600, 250,60).tap = guessSubmitted
  return holes;
}

function drawFeedback(n) {
  let color, feed = { ...feedback[n] };
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      color = "clear";
      if (feed.match > 0) {
        color = 'green';
        feed.match--;
      } else if (feed.partialMatch > 0) {
        color = 'yellow';
        feed.partialMatch--;
      } else color = "clear";
    	circle(570 + i * 25, 275 + (n+1) *80 + j *25, 8, color, 'black');
    }
  }
  return feedback;
}

function getFeedback(secretcode, guesses) {
  // Initialize the feedback object
  let feedback = {
    match: 0,
    partialMatch: 0
  };

  // Copy the arrays to avoid modifying the originals
  let code = secretcode.slice();
  let guess = guesses.slice();

  // Loop through the guess array and check for matches
  for (let i = 0; i < guess.length; i++) {
    // If the element is in the same position, increment match and remove it from both arrays
    if (guess[i] === code[i]) {
      feedback.match++;
      guess.splice(i, 1);
      code.splice(i, 1);
      // Adjust the index since the arrays are shorter
      i--;
    }
  }

  // Loop through the remaining guess array and check for partial matches
  for (let i = 0; i < guess.length; i++) {
    // Find the index of the element in the code array
    let index = code.indexOf(guess[i]);
    // If the element is in the code array, increment partialMatch and remove it from the code array
    if (index !== -1) {
      feedback.partialMatch++;
      code.splice(index, 1);
    }
  }

  // Return the feedback object
  return feedback;
}

function drawGuess(guesses, n) {
  let guess = [].concat(guesses);
  for (let i = 0; i < 4; i++) {
    stamp(colors[guess[i]], 225 + i * 90, 290 + (n+1) *80, 75);
  }
  console.log(feedback);
  drawFeedback(n); 
}

function updateGame() {
  reset()
  fill('parchment')
  text("Mastermind", 376,100,80, CENTER);
  text("Fill holes with colors", 376, 160, CENTER);
  holes = drawHoles();
  pegs = drawPegs(); 
  guesses.forEach(drawGuess)
}

function startGame() {
  reset()
  fill('parchment')
  guesses = []
  text("Mastermind", 376,100,80, CENTER);
  text("Fill holes with colors", 376, 160, CENTER);
	secretCode = [
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length)
  ]
    // Initialize other variables
  guessesRemaining = 10;
  currentRow = 0;
  guess = [];
  feedback = [];
  holes = drawHoles();
  pegs = drawPegs();
  drawFeedback();
  feedback = [];
}

function guessSubmitted() {
  if (!areHolesAllFilled(holes)) return false
  guesses.push(holes.map(hole => hole.i));
  feedback.push(getFeedback(secretCode, guesses[guesses.length-1]))
  updateGame()
}

function gameWinner() {
  // Display win message and option to restart
  text("You win!", 50, 20);
  let s = stamp("start2", 80, 40);
  s.tap = startGame()
}

function gameLoser(){
  // Display lose message, reveal code, and option to restart
  text("You lose!", 50, 20);
  text("Secret code:", 30, 40);
  for (let i = 0; i < secretCode.length; i++) {
    stamp(secretCode[i], 60 + i * 30, 60);
  }
  let s = stamp("start2", 80, 40);
  s.tap = startGame()
}

startGame()
