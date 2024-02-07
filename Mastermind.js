// MasterMind
const colors = ["ghost4", "ghost5", "ghost6", "ghost7", "ghost8", "ghost9"];
const floating = ["ghost10", "ghost11", "ghost12", "ghost13", "ghost14", "ghost16"];

function placePeg() {
  if (!tapped) return;
  this.change(tapped.name).size(80)
  this.i = tapped.i
}

function drawTitle() {
  reset();
  fill('parchment');
  stamp('@megamindlogo',260,105,160);
  text("MASTER", 425,100,42, '#342214', 'Saira Stencil One', CENTER);
  text("MIND", 425,160, 69, '#342214', 'Saira Stencil One', CENTER);
}

function areHolesAllFilled(holes) {
  return holes.every(hole => hole.i !== undefined)
}

function instruct(){
  drawTitle();
  stamp('arrow11',700,105,80).tap = () => delay(updateGame, 10);
  stamp('black', 100, 290, 40)
  text("fill each with a colored ghost", 140, 300, 40, '#342214', LEFT);
  stamp('@magnify', 115, 400, 0).rotate(-45).size(100);
  text("to discover feedback", 140, 400, 40, '#342214', LEFT);
  circle(105, 485, 14, 'green', 'black');
  text("color and placement match", 140, 500, 40, '#342214', LEFT);
  circle(105, 585, 16, 'yellow', 'black');
  text("color match only", 140, 600, 40, '#342214', LEFT);
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
    pegs.push(stamp(colors[i], 700, 350 + i * 100, 100));
    pegs[i].i = i;
    pegs[i].tap = selectPeg;
  }
  return pegs;
}

function drawHoles() {
  let holes = [];
  for (let i = 0; i < 4; i++) {
    holes.push(stamp('black', 225 + i * 90, 240, 40));
    holes[i].tap = placePeg;
  }
  submit = stamp('@magnify', 600, 250,0).rotate(-45).size(100).tap = guessSubmitted
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
  drawTitle();
  stamp('question',700,105,80).tap = () => delay(instruct, 10);

  holes = drawHoles();
  pegs = drawPegs(); 
  guesses.forEach(drawGuess)
}

function startGame() {
  tapped = null;
  tap = null;
  guesses = [];
  drawTitle();
  stamp('question',700,105,80).tap = () => delay(instruct, 10);

  secretCode = [
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length)
  ]
  feedback = [];
  holes = drawHoles();
  pegs = drawPegs();
  drawFeedback();
  feedback = [];
}

function guessSubmitted() {
  if (!areHolesAllFilled(holes)) return false
  guesses.push(holes.map(hole => hole.i));
  let feed = getFeedback(secretCode, guesses[guesses.length-1]);
  feedback.push(feed)
  updateGame()
  if (feed.match === 4) return gameWinner();
  if (feedback.length === 8) return gameLoser();
}

function gameOver() {
  reset();
  fill('black');
  delay(
    () => tap = startGame,
    3000
  );
}

function gameWinner() {
  gameOver();
  stamp('@megamindcaught', 382,450, 900);
  text("You caught me! This time...", 382, 980, 50, 'white', CENTER);
}

function gameLoser(){
  gameOver();
  stamp('@megamind', 410,450, 900)
  text("Nice Try! Outsmarted...", 382, 980, 50, 'white', CENTER);
}

startGame()
