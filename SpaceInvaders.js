// Space Invaders (Star Wars Edition)

var textMessage;
var aliens = []
var lasers = []
var ship;
var charging = false; 
var gameOver = false; 
var alienLasers = [];

function startGame() {
 	reset()
  fill('space3')
  textMessage = text('', 380,50, 'white', CENTER)
  //create a spaceship
  ship = stamp('@milennialfalcon', 380, 970,120).rotate(-50)
  //create a row of aliens
  aliens = []
  for (var i = 0; i < 8; i++) {
    //use a random alien image
    var alien = stamp('@tiefighter', i * 70 + 20, 50, 70)
    alien.speedx = 2
    aliens.push(alien)
  }
  for (var i = 0; i < 8; i++) {
    //use a random alien image
    var alien = stamp('@tiefighter', i * 70 + 70, 120, 70)
    alien.speedx = 2
    aliens.push(alien)
  }
    for (var i = 0; i < 8; i++) {
    //use a random alien image
    var alien = stamp('@tiefighter', i * 70 + 20, 190, 70)
    alien.speedx = 2
    aliens.push(alien)
  }
  fire();
  gameOver = false; 
  loop = gameOn
  tap = moveAndShoot
}

function completeCharge() {
	charging = false;
}

function moveAndShoot() {
  if (this.y >850) {
    moveShip(this.x)
  } else {
    shoot()
  }
}

function shoot(){
  if (charging) return
 	let laser = stamp('laser5',ship.x, ship.y, 50);
  laser.back();
  lasers.push(laser);
  charging = true;
  delay(completeCharge, 500)
}

function moveShip(x) {
  if (ship.x < x) {
    ship.rotate(-20).move(x,ship.y,300) 
  }
  if (ship.x > x) {
    ship.rotate(-80).move(x,ship.y,300) 
  }
  delay(()=> ship.rotate(-50),300)
}

startGame()
DIRECTION = RIGHT
function changeDirection() {
  return DIRECTION === LEFT ? RIGHT : LEFT 
}
//update the game every frame
function gameOn() {
 	aliens.forEach((alien, index) => {
    alien.move(DIRECTION, 3)
    //bounce the aliens at the edges
    if (alien.x < 20 || alien.x > 750) {
      console.log(alien.x)
      aliens.forEach(alien => alien.move(alien.x, alien.y + 50))
      DIRECTION = changeDirection()
    }
    //check if the alien is hit by a laser
    if (alien.hits('laser5')) {
      //remove the alien and the laser
      let laserIndex = lasers.findIndex(laser => Math.abs(laser.x - alien.x) <= 30 && laser.y - alien.y <= 20);
      //remove the laser from the array
      if (laserIndex >= 0) {
        lasers[laserIndex].hide();
        lasers.splice(laserIndex, 1);
        alien.explode()
				aliens.splice(index, 1);
	      sound('zap')

      }
    }
    if (ship.hits('laser4')) {
      let hitSome = alienLasers.some(alienLaser => Math.abs(alienLaser.x - ship.x) <= 35 && ship.y - alienLaser.y <= 30);
			if (hitSome) {
        ship.explode()
        textMessage.change('Game Over!','red')
        gameOver = true
        delay(() => loop = null,1000)
        tap = startGame
        return
      }
    }
    //check if the alien reaches the bottom
    if (alien.y > 900 || ship.hits('laser4')) {
       ship.explode()
      textMessage.change('Game Over!','red')
      gameOver = true
      loop = null
      tap = startGame
      return
    }
  })
  
  lasers.forEach(laser => {
    laser.move(UP, 10)
    if (laser.y < 10) {
      laser.hide()
    }
  })

  if (!aliens.length) {
    loop = null
    textMessage.change('You Win!', 'green')
    tap = startGame
  }
}

function fire() {
  if (gameOver) return
  // pick a random alien from the array
  let alien = random(aliens)
  // generate a random number between 1 and 100
  chance = random(1, 100)
  // get the threshold value based on the array length
  threshold = 100 / aliens.length
  // if the random number is less than or equal to the threshold, fire a laser
  if (chance <= threshold) {
    let alienLaser = stamp('laser4', alien.x, alien.y, 60)
    alienLaser.back();
    alienLasers.push(alienLaser);
    alienLaser.move(DOWN, 1000, 1000)
    sound('zap')
  }
  // get the firing frequency based on the array length
  frequency = 2000 - aliens.length * 100
  // repeat the fire function after a random interval
  setTimeout(fire, random(frequency))
}


