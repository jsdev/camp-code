// Asteroids
// The first game I ever changed the images on an Amiga 64
// 4 levels
// TODO have a winning sequence
// TODO Add damage to ship, so can survive up to 3 hits
// add powerups to shoot at
// powerups can change color of laser changes, size and possible bi and tri-directional
// NEED TO ADD data security

const spaceship = 'spaceship4'
const BIG_ONES = ['@asteroidbig','@asteroidbig2', '@asteroid3', '@asteroid4', '@asteroid5']
const SMALL_ONES = ['@asteroidsmall', '@asteroid3', '@asteroid4', '@asteroid5']
let applause = false;
let level = 1;
let mirror = null;

const levels = {
  1: () => [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()],
  2: () => [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()],
  3: () => [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(), spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()],
  4: () => [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(), spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()]
}

function startGame() {
  reset()
  fill('stars')
  
  shooter = stamp(spaceship,100)
  lasers = []

  bigAsteroids = levels[level]()
  mediumAsteroids = []
  smallAsteroids = []
  shooterHit = false
  tap = shoot
  applause = false
  rightLaser = true
  leftLaser = true
  frontLaser = true
  triLaser = true
}

function rotatePoint(cx, cy, x, y, angle) {
  let radians =  angle * (Math.PI / 180);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: Math.round(cos * (x-cx) - sin * (y-cy) + cx),
    y: Math.round(sin * (x-cx) + cos * (y-cy) + cy)
  };
} 

function spawnBigAsteroid() {
  let x = random(0,750)
  let y1 = random(0,350)
  let y2 = random(650,1000)
  let y = random([y1,y2])
  asteroid = stamp(random(BIG_ONES),x, y, 200);
  asteroid.speed = 6
  asteroid.rotate(random(0,290));
  return asteroid
}

function spawnSmallAsteroid(x,y) {
  let x1 = x + random(-5,5)
  let y1 = x + random(-5,5)
  
  let newX = random(0,750)
  let rand1 = random(0,350)
  let rand2 = random(650,1000)
  let newY = random([rand1,rand2])
	
  asteroid = stamp(random(SMALL_ONES),x1, y1, 50);
  asteroid.speed = 9;
  asteroid.rotate(0,270).aim(newX,newY)
  return asteroid
}

function spawnMediumAsteroid(x,y) {
  let x1 = x + random(-5,5)
  let y1 = x + random(-5,5)

  asteroid = stamp(random(BIG_ONES),x, y, 100);
  asteroid.speed = 8;
  asteroid.rotate(165,190);
  return asteroid
}

function showExplosion(asteroid){
  asteroid.explode()
  asteroid.hit = true
  sound('hits')
}

function bigHit(asteroid) {
	showExplosion(asteroid)
  mediumAsteroids.push(spawnMediumAsteroid(asteroid.x,asteroid.y))
  mediumAsteroids.push(spawnMediumAsteroid(asteroid.x,asteroid.y))
}

function mediumHit(asteroid) {
	showExplosion(asteroid)
  smallAsteroids.push(spawnSmallAsteroid(asteroid.x,asteroid.y))
  smallAsteroids.push(spawnSmallAsteroid(asteroid.x,asteroid.y))
}

function rotateSpaceship(angle) {
  // get the current rotation of the spaceship
  var currentRotation = spaceship.rotation

  // calculate the new rotation by adding the angle
  var newRotation = currentRotation + angle

  // rotate the spaceship to the new rotation over 500 milliseconds
  spaceship.rotate(newRotation, 500)
}

function loadFrontLaser() {
  const laser = stamp('laser3',shooter.x+0, shooter.y+0, 40)
 	laser.back().aim(x,y)
  lasers.push(laser)  
}

function loadSideLaser(n, shooterRotation, mirrorRotation) {
  const sideLaser = stamp('laser3',shooter.x + n, shooter.y+0, 30)
  const mirrorLaser = stamp('laser3',mirror.x + n, mirror.y+0, 30).hide()
  const side = rotatePoint(shooter.x, shooter.y, sideLaser.x, sideLaser.y, shooterRotation);
  const mirrorCoords = rotatePoint(mirror.x, mirror.y, mirrorLaser.x, mirrorLaser.y, mirrorRotation);
  mirrorLaser.move(mirrorCoords.x,mirrorCoords.y);
  sideLaser.move(side.x,side.y).aim(mirrorLaser.x, mirrorLaser.y);
  lasers.push(sideLaser)
}

function loadSideLasers() {
  if (mirror) mirror.hide();
  mirror = stamp(spaceship,-1000,-1000,100).hide().move(x,y);
  const shooterRotation = Math.round(shooter.rotation)
  mirror.rotate(shooterRotation);
  const mirrorRotation = Math.round(mirror.rotation)
	if (leftLaser) loadSideLaser(-30, shooterRotation, mirrorRotation)
	if (rightLaser) loadSideLaser(30, shooterRotation, mirrorRotation)
	mirror.rotate(RIGHT, 180)
}

function shoot() {
  if (shooterHit) {
    startGame()
    return
  }
  
  shooter.aim(x,y)
	if (triLaser) loadSideLasers()
	if (frontLaser) loadFrontLaser()
  sound('zap')
}

function laserHit(allAsteroids) {
  return function (laser) {
    allAsteroids.some(asteroid => {
      if (asteroid.hit===true) return
      if (laser.hits(asteroid)) {
        asteroid.hit=true;
        laser.hide();
        if(asteroid.width_ === 200) {
          bigHit(asteroid);
          return true;
        }
        if(asteroid.width_ === 100) {
          mediumHit(asteroid);
          return true;
        }
        showExplosion(asteroid);
        return true;
      }
      return false;
    });
    laser.move(UP, 20,5);
  }
}

function loop() {
  if (applause) return
  if (shooterHit) {
    level = 1
    tap = startGame
    return
  }
  let allAsteroids = smallAsteroids.concat(mediumAsteroids).concat(bigAsteroids);
  let hitAsteroids = allAsteroids.filter(asteroid => asteroid.hit)
  if (hitAsteroids.length === allAsteroids.length) {
    if (level < 4) {
    	level = level + 1 
    }
    sound('claps');
    tap = startGame;
    applause = true;
    return
  }
  lasers.forEach(laserHit(allAsteroids))
  allAsteroids.forEach(asteroid => {
    if (asteroid.hit===true) return
    if (!shooterHit && asteroid.hits(shooter.x, shooter.y)) {
      sound('bomb2')
      shooter.explode()
      shooterHit = true
    }
    asteroid.move(UP, asteroid.speed)
    asteroid.wrap()
  })
}

startGame()
