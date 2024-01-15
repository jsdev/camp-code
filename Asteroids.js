// Asteroids
// The first game I ever changed the images on an Amiga 64
// 4 levels
// TODO have a winning sequence
// TODO Add damage to ship, so can survive up to 3 hits
// add powerups to shoot at

level = 1
function startGame() {
  reset()
  fill('stars')
  shooter = stamp('spaceship4',100)
  lasers = []
  
  mediumAsteroids = []
  smallAsteroids = []
  shooterHit = false
  tap = shoot
  if (level===1){
    bigAsteroids = [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()]
		return
  }
  if (level===2){
    bigAsteroids = [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()]
		return
  }
  if (level===3){
    bigAsteroids = [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(), spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()]
		return
  }
  if (level===4){
    bigAsteroids = [spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(), spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid(),spawnBigAsteroid()]
		return
  }
}

startGame()

function spawnBigAsteroid() {
  let x = random(0,750)
  let y1 = random(0,350)
  let y2 = random(650,1000)
  let y = random([y1,y2])
  asteroid = stamp('@asteroidbig',x, y, 200);
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
	
  asteroid = stamp('@asteroidbig',x1, y1, 50);
	asteroid.speed = 9
  asteroid.rotate(0,270).aim(newX,newY)
  return asteroid
}

function spawnMediumAsteroid(x,y) {
  let x1 = x + random(-5,5)
  let y1 = x + random(-5,5)

  asteroid = stamp('@asteroidbig',x, y, 100);
  asteroid.speed = 8
  asteroid.rotate(165,190)
  return asteroid
}

function bigHit(asteroid) {
  asteroid.explode()
  asteroid.hit = true
  mediumAsteroids.push(spawnMediumAsteroid(asteroid.x,asteroid.y))
  mediumAsteroids.push(spawnMediumAsteroid(asteroid.x,asteroid.y))
  sound('hits')
}

function mediumHit(asteroid) {
  asteroid.explode()
  asteroid.hit = true
  smallAsteroids.push(spawnSmallAsteroid(asteroid.x,asteroid.y))
  smallAsteroids.push(spawnSmallAsteroid(asteroid.x,asteroid.y))
  sound('hits')
}

function smallHit(asteroid) {
  asteroid.explode()
  asteroid.hit = true
  sound('hits')
}

function shoot() {
  if (shooterHit) {
    startGame()
    return
  }
 	shooter.aim(this.x,this.y)
  let laser = stamp('laser3',shooter.x+0, shooter.y+0, 40)
 	laser.back().aim(this.x,this.y)
  lasers.push(laser)
  sound('zap')
}

function loop() {
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
    tap = startGame
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
          smallHit(asteroid)
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


