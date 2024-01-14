// FROGGER
// TODO CONTINUE TO UPDATE GRAPHICS
// TODO ALLOW FROG To jump different ways

function startGame() {
 	highwayObjects = []
  lakeObjects = []
  lilyPadObjects = []
  lilyPadsOccupied = 0
  createLake()
  createLilyPads()
  createBeams()
  createHighway()
  inPlay = true
  frogger = Object.create({
    stamp: stamp('@frogger', 386, 925, 100)
  })
}
startGame()
                  
function tap() {
    if (inPlay) {
		hopDistance = 90                        
  		frogger.stamp.move(frogger.stamp.x, frogger.stamp.y - hopDistance) 
    }
    
}

function findLocation() {
  	if (frogger.stamp.y < 130) {
      	return 'lilyPad'
    } else if (frogger.stamp.y < 440 && frogger.stamp.y >= 130) {
      	return 'lake'
    } else if (frogger.stamp.y > 440 && frogger.stamp.y < 922) {
  		return 'highway'
    }
}

// Create beam
function createBeams(){
  	box(0, 445, 767, 100, 'lightgreen')
  	box(0, 922, 767, 100, 'lightgreen')
}
                  
// Create lily pads
function createLilyPads() {
    x = 85
  	y = 75
    repeat(function() {
                  lilyPad = {
                  stamp: stamp('@lilypadempty', x, y, 100)}
      lilyPadObjects.push(lilyPad)
      x = x + 150
    }, 5)
}

// Create lake
function createLake() {
  fill('pool')
//  	box(0, 0, 767, 475, 'turquoise')    
    // Add highest row of logs
    addStamps([{startX: -100, startY: 170, endX: 867, type: 'lake', width: 150, directionOfMovement: 'right', name: 'alligator2'}], 3, 2200)
                  
    // Add lowest row of logs
	addStamps([{startX: -100, startY: 320, endX: 867, type: 'lake', width: 150, directionOfMovement: 'right', name: 'alligator2'}], 3, 2200)
    
    // Add highest row of turtles
    addStamps([{startX: 977, startY: 240, endX: -200, type: 'lake', width: 100, directionOfMovement: 'left', name: 'seaturtle2'},
                  {startX: 1087, startY: 240, endX: -100, type: 'lake', width: 100, directionOfMovement: 'left', name: 'seaturtle2'}], 3, 2150)
  
  	// Add lowest row of turtles
    addStamps([{startX: 977, startY: 390, endX: -200, type: 'lake', width: 100, directionOfMovement: 'left', name: 'seaturtle2'},
        {startX: 1087, startY: 390, endX: -100, type: 'lake', width: 100, directionOfMovement: 'left', name: 'seaturtle2'}], 3, 2150)
}

// Create highway
function createHighway(){
	box(0, 547, 767, 375, 'black')
    // Add busses
    addStamps([{startX: -300, startY: 600, endX: 967, type: 'highway', width: 150, directionOfMovement: 'right', name: 'bus'}], 2, 5000)
    
    // Add trucks
    addStamps([{startX: 876, startY: 685, endX: -100, type: 'highway', width: 100, directionOfMovement: 'left', name: 'truck' }], 3, 3000)
    
	// Add busses
    addStamps([{startX: -300, startY: 770, endX: 967, type: 'highway', width: 150, directionOfMovement: 'right', name: 'bus'}], 2, 5000)
    
    // Add trucks
    addStamps([{startX: 876, startY: 855, endX: -100, type: 'highway', width: 100, directionOfMovement: 'left', name: 'truck' }], 3, 3000)
    
}


function addStamps(details, numberOfSets, stagger) {
  index = 0
  repeat(function() {
    details.forEach(function(obj) {
      	// Create a copy of the object and its stamp
      	// based on details given
    	obj = Object.create(obj)
      	obj['stamp'] = stamp(obj.name, obj.startX, obj.startY, obj.width)
    		if (obj.name === 'alligator2') {
          obj['stamp'].rotate(-18) 
        }
        addToTrackers(obj)
    	
        // Add motion at staggered times 
      	determineStartTime(obj, stagger, index)
    })
    
    index = index + 1
  }, numberOfSets)
}

// Keep track of whether the object is highway or lake
function addToTrackers(obj) {
    if (obj.type === 'highway') {
      highwayObjects.push(obj)
    }
    
    if (obj.type === 'lake') {
      lakeObjects.push(obj)
    }
}

// This allows us to create a number of
// object groups from the same set of details
// (e.g. turtle pair starts at 0ms, another pair at 1500ms)
function determineStartTime(obj, stagger, index) {
  waitTime = stagger * index
  
  setTimeout(function() {
    addMotion(obj)
  }, waitTime)
}

function addMotion(obj){ 
  	obj.stamp.move(obj.endX, obj.startY, 8000)
    checkOffscreen(obj)
}

// Check if the object is out of viewport every 1000ms
function checkOffscreen(obj) {
  setInterval(function(){
    isOffscreen(obj)
  }, 100)
};

// Check if the object is offscreen using current x, y coords
function isOffscreen(obj) {  
  if (obj.stamp.name === '@frogger' && (obj.stamp.x < -50 || obj.stamp.x > 817)) {
    theEnd('lose')
    frogger.stamp.hide()
    return true
  }
  
  if (obj.stamp.x === obj.endX) {
  	moveToBeginning(obj)
  }
}

// Move the object to its starting coords
function moveToBeginning(obj) {
  obj.stamp.move(obj.startX, obj.startY)
  obj.stamp.move(obj.endX, obj.startY, 8000)
}

function loop(){
  if (inPlay || !isOffscreen(frogger)) {
    if (findLocation() === 'lilyPad') {
      	detectOnLilyPad()
    } else if (findLocation() === 'lake') {
      	detectFallingIntoWater()
    } else if (findLocation() === 'highway') {
      detectHighwayCollisions()
  	}
  }
}

function detectHighwayCollisions() {
  for (i = 0; i < highwayObjects.length; i++) {
    halfWidth = 0.5 * highwayObjects[i].stamp.width_
    if (distance(frogger.stamp, highwayObjects[i].stamp) < halfWidth) {
    	frogger.stamp.change('pepperoni')
      theEnd('lose')
    }
  }
}

function detectFallingIntoWater() {
  inWater = true
  for (i = 0; i < lakeObjects.length; i++) {
    halfWidth = 0.5 * lakeObjects[i].stamp.width_
    if (distance(frogger.stamp, lakeObjects[i].stamp) < 50) {
		inWater = false
    	frogger.stamp.move(lakeObjects[i].stamp.x, lakeObjects[i].stamp.y)
        frogger.stamp.front()
    }
  }
  
  if (inWater) {
		madeSplash();
  }
}

function madeSplash() {
  if(inPlay) {
    delay(()=>sound('splash'), 10);
    frogger.stamp.splash();
  	theEnd('lose')
  }
}

function detectOnLilyPad() {
	for (i = 0; i < lilyPadObjects.length; i++) {
    console.log(lilyPadObjects[i].stamp.name)
    if (lilyPadObjects[i].stamp.name === '@lilypadempty' && distance(frogger.stamp, lilyPadObjects[i].stamp) < 50) {
      lilyPadObjects[i].stamp.change('@lilypadon');
      lilyPadsOccupied++;
      frogger.stamp.move(386, 925);
      if (lilyPadsOccupied === 5) {
        theEnd('win')
      }
      return;
    }
  }
  madeSplash();
}

function theEnd(status) {
  if (status === 'win') {
    text('YOU WIN!!!', 50, 540, 'blue', 120)
  } else {
  	text('GAME OVER', 50, 540, 'red', 120)
  }
  inPlay = false
}
