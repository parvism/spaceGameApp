



var gameImages = {
	bg1 : new Image(),
	bg2 : new Image(),
	myShip : new Image(),
	myBullet : new Image(),
	enemyShip : new Image(),
	enemyBullet : new Image(),
	explosion : new Image()
};
gameImages.bg1.src = "images/bg1.png";
gameImages.bg2.src = "images/bg2.png";
gameImages.myShip.src = "images/myShip.png";
gameImages.myBullet.src = "images/bullet.png";
gameImages.enemyShip.src = "images/enemyShip.png";
gameImages.enemyBullet.src = "images/fireBall.png";
gameImages.explosion.src = "images/explosion.png";

var numOfImgs = 7;
var loadedImgs = 0;
function updateLoadedImgs() {
	loadedImgs++;
	if (loadedImgs === numOfImgs) {
		window.init();
	}
}
gameImages.bg1.onload = function() {
	updateLoadedImgs();
};
gameImages.bg2.onload = function() {
	updateLoadedImgs();
};
gameImages.myShip.onload = function() {
	updateLoadedImgs();
};
gameImages.myBullet.onload = function() {
	updateLoadedImgs();
};
gameImages.enemyShip.onload = function() {
	updateLoadedImgs();
};
gameImages.enemyBullet.onload = function() {
	updateLoadedImgs();
};
gameImages.explosion.onload = function() {
	updateLoadedImgs();
};

function Shape() {
	this.init = function(x, y, width, height) {		
		this.x = x;
		this.y = y;	
		this.width = width;
		this.height = height;	
	};
	this.speed = 0;
	this.canvasW = 0;
	this.canvasH = 0;	
	this.collided = false;
		
	this.draw = function() {
	};
	this.move = function() {
	};	
}

function Stars1() {
	this.speed = 1; 
	
	this.draw = function() {		
		this.y += this.speed;
		this.context.drawImage(gameImages.bg1, this.x, this.y);		
		this.context.drawImage(gameImages.bg1, this.x, this.y - this.canvasH);
		
		if (this.y >= this.canvasH)
			this.y = 0;
	};
}

Stars1.prototype = new Shape();

function Stars2() {
	this.speed = 0.5; 
	
	this.draw = function() {		
		this.y += this.speed;
		this.context.drawImage(gameImages.bg2, this.x, this.y);		
		this.context.drawImage(gameImages.bg2, this.x, this.y - 900);
		
		if (this.y >= 900)
			this.y = 0;
	};
}

Stars2.prototype = new Shape();


function Bullet(bType) {
	this.active = false;
	
	this.release = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.active = true;
	};
	
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.y -= this.speed;
		
		if (this.collided) {
			return true;
		}
		else if (bType === "myBullet" && this.y <= 0 - this.height) {
			return true;
		}
		else if (bType === "enemyBullet" && this.y >= this.canvasH) {
			return true;
		}
		else {
			if (bType === "myBullet") {
				this.context.drawImage(gameImages.myBullet, this.x, this.y);
			}
			else if (bType === "enemyBullet") {
				this.context.drawImage(gameImages.enemyBullet, this.x, this.y);				
			}
			return false;
		}	
	};

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.active = false;
		this.collided = false;
	};
}

Bullet.prototype = new Shape();

function Pool(size) {	
	var array = [];
	
	this.init = function(objType) {
		if(objType == "myBullet"){
			for (var i = 0; i < size; i++) {			
				var bullet = new Bullet("myBullet");
				bullet.init(0,0, gameImages.myBullet.width, gameImages.myBullet.height);
				bullet.clear();				
				array[i] = bullet;
			}
		}
		else if (objType == "enemyShip") {
			for (var i = 0; i < size; i++) {
				var eShip = new EnemyShip();
				eShip.init(0,0, gameImages.enemyShip.width, gameImages.enemyShip.height);
				eShip.clear();
				array[i] = eShip;
			}
		}
		else if (objType == "enemyBullet") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("enemyBullet");
				bullet.init(0,0, gameImages.enemyBullet.width, gameImages.enemyBullet.height);
				bullet.clear();				
				array[i] = bullet;
			}
		}
	};
	
	this.getObj = function(x, y, speed) {
		if(!array[size - 1].active) {
			array[size - 1].release(x, y, speed);
			array.unshift(array.pop());
		}
	};
	
	this.get2Obj = function(x1, y1, speed1, x2, y2, speed2) {		
		this.getObj(x1, y1, speed1);
		this.getObj(x2, y2, speed2);			 
	};

	this.animate = function() {
		for (var i = 0; i < size; i++) {			
			if (array[i].active) {
				if (array[i].draw()) {
					array[i].clear();
					array.push((array.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
	// **** För collection detecting ****
	this.getActivePool = function() {
		var objects = [];
		for (var i = 0; i < size; i++) {
			if (array[i].active) {
				objects.push(array[i]);
			}
		}
		return objects;
	};
}

function SoundPool(maxSize) {
	var size = maxSize;
	var pool = [];
	this.pool = pool;
	var currSound = 0;

	this.init = function(object) {
		if (object == "laser") {
			for (var i = 0; i < size; i++) {
				laser = new Audio("sounds/shoot.mp3");
				laser.volume = .25;
				laser.load();
				pool[i] = laser;
			}
		}
		else if (object == "explosion") {
			for (var i = 0; i < size; i++) {
				var explosion = new Audio("sounds/explosion.mp3");
				explosion.volume = .55;
				explosion.load();
				pool[i] = explosion;
			}
		}
	};

	this.get = function() {
		if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
			pool[currSound].play();
		}
		currSound = (currSound + 1) % size;
	};
}

function MyShip() {
	this.speed = 3;
	this.bulletPool = new Pool(30);
	this.bulletPool.init("myBullet");
	var fireRate = 15;
	var counter = 0;
	this.active = true;
		
	this.draw = function() {
		this.context.drawImage(gameImages.myShip, this.x, this.y);
	};
	this.move = function() {
		counter++;
		
		if (KEYS.left || KEYS.right || KEYS.down || KEYS.up) 
		{			
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
			if (KEYS.left) {
				this.x -= this.speed;
				if (this.x <= 0)
					this.x = 0;
			} 
			if (KEYS.right) {
				this.x += this.speed;
				if (this.x >= this.canvasW - this.width)
					this.x = this.canvasW - this.width;
			} 
			if (KEYS.up) {
				this.y -= this.speed;
				if (this.y <= this.canvasH/2)
					this.y = this.canvasH/2;
			} 
			if (KEYS.down) {
				this.y += this.speed;
				if (this.y >= this.canvasH - this.height)
					this.y = this.canvasH - this.height;
			}				
		}
		
		if (!this.collided) {
			this.draw();
		}
		else{
			this.active = false;
			game.gameOver();
		}
		if (KEYS.space && counter >= fireRate && !this.collided) {
			this.fire();
			counter = 0;
		}
	};

	this.fire = function() {
		this.bulletPool.get2Obj(this.x+10, this.y, 7, this.x+37, this.y, 7);
		game.laser.get();
	};
}

MyShip.prototype = new Shape();

KEY_NUM = { 32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down'};

KEYS = {};
for (num in KEY_NUM) {
  KEYS[ KEY_NUM[ num ]] = false;
}

document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var key = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_NUM[key]) {
    e.preventDefault();
    KEYS[KEY_NUM[key]] = true;
  }
};

document.onkeyup = function(e) {
  var key = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_NUM[key]) {
    e.preventDefault();
    KEYS[KEY_NUM[key]] = false;
  }
};

function EnemyShip() {
	var percent = .001;
	var fireRate = 0;
	this.active = false;
	
	this.release = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = speed;
		this.active = true;
		this.leftStop = this.x - 140;
		this.rightStop = this.x + 140;
		this.bottomStop = this.y + 170;
	};
	
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.x <= this.leftStop) {
			this.speedX = this.speed;
		}
		else if (this.x >= this.rightStop + this.width) {
			this.speedX = -this.speed;
		}
		else if (this.y >= this.bottomStop) {
			this.speed = 3;
			this.speedY = 0;
			this.y -= 5;
			this.speedX = -this.speed;
		}
		
		if (!this.collided) {
			this.context.drawImage(gameImages.enemyShip, this.x, this.y);
			
			fireRate = Math.floor(Math.random()*101);
			if (fireRate/100 < percent) {
				this.fire();
			}
			return false;
		}
		else {
			game.playerScore += 10;
			game.explosion.get();			
			return true;
		}
	};
	
	this.fire = function() {
		game.enemyBulletPool.getObj(this.x+this.width/2, this.y+this.height, -3);
	};

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.active = false;
		this.collided = false;
	};
}

EnemyShip.prototype = new Shape();

var m;
var s = 0;
var timerInterval;

function Game() {
	var container = document.getElementById('container');
	var container_style = getComputedStyle(container);
			
	this.bgCanvas = document.getElementById('bgCanvas');		
	this.bgCanvas.width = parseInt(container_style.getPropertyValue('width'));
	this.bgCanvas.height = parseInt(container_style.getPropertyValue('height'));
		
	this.mainCanvas = document.getElementById('mainCanvas');		
	this.mainCanvas.width = parseInt(container_style.getPropertyValue('width'));
	this.mainCanvas.height = parseInt(container_style.getPropertyValue('height'));
		
	this.fgCanvas = document.getElementById('fgCanvas');		
	this.fgCanvas.width = parseInt(container_style.getPropertyValue('width'));
	this.fgCanvas.height = parseInt(container_style.getPropertyValue('height'));
	
	this.bgContext;
	this.mainContext;
	this.fgContext;
	
	this.init = function() {
		this.playerScore = 0;
		this.laser = new SoundPool(10);
		this.laser.init("laser");
		this.explosion = new SoundPool(20);
		this.explosion.init("explosion");		
		this.backgroundAudio = new Audio("sounds/background.mp3");
		this.backgroundAudio.loop = true;
		this.backgroundAudio.volume = .25;
		this.backgroundAudio.load();
		this.gameOverAudio = new Audio("sounds/game_over.mp3");
		this.gameOverAudio.loop = true;
		this.gameOverAudio.volume = .25;
		this.gameOverAudio.load();				
		
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
			this.fgContext = this.fgCanvas.getContext('2d');			
						
			Stars1.prototype.context = this.bgContext;
			Stars1.prototype.canvasW = this.bgCanvas.width;
			Stars1.prototype.canvasH = this.bgCanvas.height;			
					
			Stars2.prototype.context = this.bgContext;
			Stars2.prototype.canvasW = this.bgCanvas.width;
			Stars2.prototype.canvasH = this.bgCanvas.height;
			
			MyShip.prototype.context = this.fgContext;
			MyShip.prototype.canvasW = this.fgCanvas.width;
			MyShip.prototype.canvasH = this.fgCanvas.height;
			
			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasW = this.mainCanvas.width;
			Bullet.prototype.canvasH = this.mainCanvas.height;
			
			EnemyShip.prototype.context = this.mainContext;
			EnemyShip.prototype.canvasW = this.mainCanvas.width;
			EnemyShip.prototype.canvasH = this.mainCanvas.height;
			
			this.background1 = new Stars1();
			this.background1.init(0,0);
			
			this.background2 = new Stars2();
			this.background2.init(0,0);
			
			this.myShip = new MyShip();			
			this.initShipX = this.fgCanvas.width/2 - gameImages.myShip.width/2;
			this.initShipY = this.fgCanvas.height/10*9;
			this.myShip.init(this.initShipX, this.initShipY, gameImages.myShip.width, gameImages.myShip.height);
			
			this.enemyPool = new Pool(30);
			this.enemyPool.init("enemyShip");
			this.spawnWave();			
			
			this.enemyBulletPool = new Pool(50);
			this.enemyBulletPool.init("enemyBullet");
			
			this.checkAudio = window.setInterval(function(){checkReadyState();},1000);
			
			return true;
		} else {
			return false;
		}
	};
	
	this.spawnWave = function() {
		var enemyH = gameImages.enemyShip.height;
		var enemyW = gameImages.enemyShip.width;
		var x = 180;
		var y = -enemyH;
		var rowSpace = y * 1.8;
		for (var i = 1; i <= 18; i++) {
			this.enemyPool.getObj(x,y,2);
			x += enemyW + 55;
			if (i % 6 == 0) {
				x = 180;
				y += rowSpace;
			}
		}		
	};
	
	this.start = function() {	
		
		timerInterval = setInterval(function(){			
    		s++;
    		var temps= s%60;
    		m = Math.floor(s/60);
    		document.getElementById("timeBox").innerHTML = " " + m + ":" + (temps>9?"":"0") + temps;}, 1000);
    			
		this.myShip.draw();
		this.backgroundAudio.play();  
		  		
    	animate();
	};	
	
	this.gameOver = function() {
		game.myShip.context.drawImage(gameImages.explosion, game.myShip.x, game.myShip.y);
		game.explosion.get();
		this.backgroundAudio.pause();
		this.gameOverAudio.currentTime = 0;
		this.gameOverAudio.play();
		document.getElementById('gameOver').style.display = "block";
	};

	this.restart = function() {
		s = 0;
		document.getElementById("timeBox").innerHTML = "0:00 ";
		
		this.gameOverAudio.pause();
		document.getElementById('gameOver').style.display = "none";
		this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
		this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
		this.fgContext.clearRect(0, 0, this.fgCanvas.width, this.fgCanvas.height);
		
		this.background1.init(0,0);
		this.background2.init(0,0);
		
		this.myShip.init(this.initShipX, this.initShipY, gameImages.myShip.width, gameImages.myShip.height);
		
		game.myShip.collided = false;
		game.myShip.active = true;
		game.myShip.bulletPool.init("myBullet");
					
		this.enemyPool.init("enemyShip");
		this.spawnWave();
		this.enemyBulletPool.init("enemyBullet");
		this.playerScore = 0;
		this.backgroundAudio.currentTime = 0;
		this.backgroundAudio.play();

		this.start();
	};
}

function checkReadyState() {
	if (game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4) {
		window.clearInterval(game.checkAudio);
		game.start();
	}
}

function detectCollision(){
	var myBullets = [];
	var enemyBullets = [];
	var enemyShips = [];
	
	myBullets = game.myShip.bulletPool.getActivePool();
	enemyBullets = game.enemyBulletPool.getActivePool();
	enemyShips = game.enemyPool.getActivePool();
	
	for(var i = 0; i < myBullets.length; i++){
		
		for(var j = 0; j < enemyShips.length; j++){
			
			if(myBullets[i].x < enemyShips[j].x + enemyShips[j].width &&
				myBullets[i].x + myBullets[i].width > enemyShips[j].x &&
				myBullets[i].y < enemyShips[j].y + enemyShips[j].height &&
				myBullets[i].y + myBullets[i].height > enemyShips[j].y) {
					myBullets[i].collided = true;
					enemyShips[j].collided = true;						
			}			
		}			
	}
	
	for(var i = 0; i < enemyBullets.length; i++){
		
		if(enemyBullets[i].x < game.myShip.x + game.myShip.width &&
				enemyBullets[i].x + enemyBullets[i].width > game.myShip.x &&
				enemyBullets[i].y < game.myShip.y + game.myShip.height &&
				enemyBullets[i].y + enemyBullets[i].height > game.myShip.y) {
					enemyBullets[i].collided = true;
					game.myShip.collided = true;
					game.myShip.active = false;
					clearInterval(timerInterval);					
					
		}			
	}
}

function animate() {
	document.getElementById('score').innerHTML = game.playerScore;
	
	detectCollision();
	
	if (game.enemyPool.getActivePool().length === 0) {
		game.spawnWave();
	}
	if (game.myShip.active){	
		requestAnimationFrame( animate );
	}
	game.background1.draw();
	game.background2.draw();
	game.myShip.move();
	game.myShip.bulletPool.animate();
	game.enemyPool.animate();
	game.enemyBulletPool.animate();
}

var game = new Game();

function init() {
	game.init();	
		
}

document.getElementById('restart').addEventListener("click", function(){game.restart();}, false);