// Dots N' Ghosts
// Allows for up to 7 players
// Each turn a player draws a line
// If you trap a ghost you draw another line
// TODO calculate Game Over
// TODO calculate winning player(s)
// TODO add AI as opponent

columns = 9;
rows = 10;
actual = {
  columns: columns - 2,
  rows: rows - 1,
};

finishLine = 2 * actual.columns * actual.rows + actual.columns + actual.rows;
size = 100;
lines = [];
HORIZONTAL = "HORIZONTAL";
VERTICAL = "VERTICAL";
players = [
  { color: "green", stamp: "ghost10", score: 0 },
  { color: "gold", stamp: "ghost15", score: 0 },
  { color: "purple", stamp: "ghost13", score: 0 },
  { color: "pink", stamp: "ghost11", score: 0 },
  { color: "red", stamp: "ghost12", score: 0 },
  { color: "orange", stamp: "ghost14", score: 0 },
  { color: "gray", stamp: "ghost16", score: 0 }
];
function selectPlayers() {
  text("DOTS N' GHOSTS", 368, 320, 60, CENTER);
  x = 0;
  y = 440;
  imageWidth = 80;

  for (i = 2; i <= players.length; i++) {
    textStamp = text(`${i} GHOSTS`, 400, y, 50, "black");
    for (j = 0; j < i; j++) {
      stamp(players[j].stamp, 400 - 50 * (j + 1), y - 20, imageWidth);
    }

    box(0, -70 + y, 1000, 100, "clear").tap = startGame(i)

    y += 100;
  }
}

selectPlayers();

score = {};
resetScore = () => players.forEach((player) => (player.score = 0));

function startGame(num) {
  return () => {
    numberOfPlayers = num;
    reset();
    current = 0;
    player = players[current];
    resetScore();
    currentPlayer = box(0, 952, 1000, 200, player.color).show();

    xy1Stamp = circle(0, 0, 20, player).hide();
    xy2Stamp = circle(0, 0, 20, player).hide();
    boxMade = false;
    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        stamp("chalksquare", i * size, j * size, size);
      }
    }
    tap = firstTap;
    tap();
  };
}

function switchPlayer() {
  current = (current + 1) % numberOfPlayers
  player = players[current]
  currentPlayer.change(player.color);
  xy1Stamp.change(player.color);
  xy2Stamp.change(player.color);
  tap = firstTap;
}

function firstTap() {
  x1 = Math.round(x / size) * size;
  x1 = x1 > x ? x1 - size / 2 : x1 + size / 2;
  y1 = Math.round(y / size) * size;
  y1 = y1 > y ? y1 - size / 2 : y1 + size / 2;
  xy1Stamp.move(x1, y1).show();
  tap = secondTap;
}

function secondTap() {
  x2 = Math.round(x / size) * size;
  x2 = x2 > x ? x2 - size / 2 : x2 + size / 2;
  y2 = Math.round(y / size) * size;
  y2 = y2 > y ? y2 - size / 2 : y2 + size / 2;
  xy2Stamp.move(x2, y2).show();

  sortCoordinates();
  lineType = validLine(x1, y1, x2, y2);
  if (lineType) {
    lines.push(lineStamp(x1, y1, x2, y2));
    line(x1, y1, x2, y2, 10, player);
    sound("cello");
    checkBoxes(lineType);
    if (!boxMade) switchPlayer();
  }
  tap = firstTap;
  xy1Stamp.hide();
  xy2Stamp.hide();
  boxMade = false;
}

function sortCoordinates() {
  if (y1 > y2) [y2, y1] = [y1, y2];
  if (x1 > x2) [x2, x1] = [x1, x2];
}

lineStamp = (x1, y1, x2, y2) => `${x1}${y1}${x2}${y2}`;

function nearest_multiple_of_size(n) {
  z = Math.round(n)
  remainder = z % size
  if (remainder < size / 2) return z - remainder
  return z + size - remainder
}

function validLine(x1, y1, x2, y2) {
  if (lines.includes(lineStamp(x1, y1, x2, y2)))
    return false
  if (Math.floor(x2 - x1) === 0 && Math.ceil(y2 - y1) === size)
    return VERTICAL
  if (Math.ceil(x2 - x1) === size && Math.floor(y2 - y1) === 0)
    return HORIZONTAL
  return false
}

const boxNorth = (x1, x2, _y) =>
    lines.includes(lineStamp(x1, _y, x2, _y)) &&
    lines.includes(lineStamp(x1, _y, x1, _y + size)) &&
    lines.includes(lineStamp(x2, _y, x2, _y + size))
const boxSouth = (x1, x2, _y) =>
    lines.includes(lineStamp(x1, _y, x2, _y)) &&
    lines.includes(lineStamp(x1, _y - size, x1, _y)) &&
    lines.includes(lineStamp(x2, _y - size, x2, _y))
const boxEast = (y1, y2, _x) =>
    lines.includes(lineStamp(_x, y1, _x, y2)) &&
    lines.includes(lineStamp(_x - size, y2, _x, y2)) &&
    lines.includes(lineStamp(_x - size, y1, _x, y1))
const boxWest = (y1, y2, _x) =>
		lines.includes(lineStamp(_x, y1, _x, y2)) &&
  	lines.includes(lineStamp(_x, y1, _x + size, y1)) &&
  	lines.includes(lineStamp(_x, y2, _x + size, y2))

function scorePlayer(player, x, y) {
  stamp(player.stamp, x, y, size)
  player.score = player.score + 1
  boxMade = true
  sound("ahh")
  deg = random(-45, 45)
  text("+1", x, y, size, 'black').rotate(deg).move(UP, 1000, 4000).size(10,5000).size(5,2000)
  text("+1", x-1, y-1, size, player.color).rotate(deg).move(UP, 1000, 4000).size(5,2000)

}

function checkBoxes(line) {
  if (line === HORIZONTAL) {
    if (boxNorth(x1, x2, y1 - size))
      scorePlayer(player, x1 + size / 2, y1 - size / 2)
    if (boxSouth(x1, x2, y1 + size))
      scorePlayer(player, x1 + size / 2, y1 + size / 2)
    return
  }
  if (boxWest(y1, y2, x1 - size))
    scorePlayer(player, x1 - size / 2, y1 + size / 2)
  if (boxEast(y1, y2, x1 + size))
    scorePlayer(player, x1 + size / 2, y1 + size / 2)
}
