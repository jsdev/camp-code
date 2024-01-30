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
  triLaser = true

  bigAsteroids = levels[level]()
  mediumAsteroids = []
  smallAsteroids = []
  shooterHit = false
  tap = shoot
  applause = false
}

function rotateGuns(spaceship, leftWingGun, rightWingGun) {
  var {x, y, rotation } = spaceship
  // set the distance of the guns from the center of the spaceship
  var distance = 30;
  // set the initial position of the left wing gun
  var leftX = x - distance;
  var leftY = y;
  // set the initial position of the right wing gun
  var rightX = x + distance;
  var rightY = y;
  // use the rotatePoint function to get the new position of the guns after rotation
  var left = rotatePoint(x, y, leftX, leftY, rotation);
  var right = rotatePoint(x, y, rightX, rightY, rotation);
  // set the x, y position of the left wing gun
  leftWingGun.x = left.x;
  leftWingGun.y = left.y;
  // set the x, y position of the right wing gun
  rightWingGun.x = right.x;
  rightWingGun.y = right.y;
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


startGame()

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
	asteroid.speed = 9
  asteroid.rotate(0,270).aim(newX,newY)
  return asteroid
}

function spawnMediumAsteroid(x,y) {
  let x1 = x + random(-5,5)
  let y1 = x + random(-5,5)

  asteroid = stamp(random(BIG_ONES),x, y, 100);
  asteroid.speed = 8
  asteroid.rotate(165,190)
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

function shoot() {
  if (shooterHit) {
    startGame()
    return
  }
  
 	console.log(x,y)
  shooter.aim(x,y)
  const shooterRotation = Math.round(shooter.rotation)
  let laser = stamp('laser3',shooter.x+0, shooter.y+0, 40)
  let sideLaserLeft = stamp('laser3',shooter.x-30, shooter.y+0, 30)
  let sideLaserRight = stamp('laser3',shooter.x+30, shooter.y+0, 30)
 	laser.back().aim(x,y)
  lasers.push(laser)
	if (triLaser) {
    if (mirror) mirror.hide();
    mirror = stamp(spaceship,x,y,100).hide();
    mirror.aim(shooter.x,shooter.y);
    const mirrorRotation = Math.round(mirror.rotation)
    let mirrorLaserLeft = stamp('laser3',mirror.x-30, mirror.y+0, 30).hide()
    let mirrorLaserRight = stamp('laser3',mirror.x+30, mirror.y+0, 30).hide()
    const left = rotatePoint(shooter.x, shooter.y, sideLaserLeft.x, sideLaserLeft.y, shooterRotation);
    const right = rotatePoint(shooter.x, shooter.y, sideLaserRight.x, sideLaserRight.y, shooterRotation);
    const mirrorLeftCoords = rotatePoint(mirror.x, mirror.y, mirrorLaserLeft.x, mirrorLaserLeft.y, mirrorRotation);
    const mirrorRightCoords = rotatePoint(mirror.x, mirror.y, mirrorLaserRight.x, mirrorLaserRight.y, mirrorRotation);

    mirrorLaserLeft.move(mirrorLeftCoords.x,mirrorLeftCoords.y);
    mirrorLaserRight.move(mirrorRightCoords.x,mirrorRightCoords.y);
    sideLaserLeft.move(left.x,left.y).aim(mirrorLaserRight.x, mirrorLaserRight.y);
    sideLaserRight.move(right.x,right.y).aim(mirrorLaserLeft.x, mirrorLaserLeft.y);

    lasers.push(sideLaserRight)
    lasers.push(sideLaserLeft)
  }
  

  sound('zap')
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
  lasers.forEach(laser => {
    if (
      allAsteroids.some(asteroid => {
        if (asteroid.hit===true) return
        if (laser.hits(asteroid)) {
          asteroid.hit===true
          laser.hide()
          if(asteroid.width_ === 200) {
            bigHit(asteroid)
            return true 
          }
          if(asteroid.width_ === 100) {
            mediumHit(asteroid)
            return true 
          }
          showExplosion(asteroid)
        	return true 
        }
       return false
      })
     ) {
     }
    laser.move(UP, 20,5)
  })
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
