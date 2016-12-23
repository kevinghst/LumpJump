/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(4);
	
	
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = 500;
	  canvasEl.height = 500;
	
	  width = 500;
	  height = 500;
	  numPads = 6;
	  keyLeft = false;
	  keyRight = false;
	  gameState = false;
	
	  window.addEventListener("keydown", checkKeyPressed, false);
	  window.addEventListener("keyup", checkKeyLifted, false);
	
	  function checkKeyPressed (event) {
	    if(event.keyCode==37){
	      keyLeft = true;
	      keyRight = false;
	    } else if(event.keyCode==39){
	      keyRight = true;
	      keyLeft = false;
	    } else if(event.keyCode==13){
	      gameState = true;
	    }
	
	  }
	
	  function checkKeyLifted (event) {
	    keyLeft = false;
	    keyRight = false;
	  }
	
	  const ctx = canvasEl.getContext("2d");
	  new Game(ctx, width, height, numPads).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Pad = __webpack_require__(2);
	const Poodle = __webpack_require__(3);
	
	class Game{
	  constructor(ctx, width, height, numPads){
	    this.image = new Image();
	    this.image.src = "./assets/background.png";
	    this.pads = [];
	    this.ctx = ctx;
	    this.width = width;
	    this.height = height;
	    this.intervalHeight = (height - 80)/numPads;
	    this.numPads = numPads;
	    // this.state = true;
	    this.poodle = new Poodle(width, height);
	    this.poodle.setPosition(width/2, height/2);
	    this.addPads();
	    this.points = 0;
	    this.intervalID = null;
	    this.lossID = null;
	    this.menuId = null;
	  }
	
	  reset(){
	    this.pads = [];
	    this.poodle = new Poodle(this.width, this.height);
	    this.poodle.setPosition(this.width/2, this.height/2);
	    this.addPads();
	    this.points = 0;
	
	  }
	
	  addPads(){
	    for(let i=0; i<this.numPads; i++){
	      let type = "ord";
	      let move = false;
	
	      let num = Math.random();
	      if(num < 0.1) { type = "hype" };
	
	      let numTwo = Math.random();
	      if(numTwo < 0.02) { move = true };
	
	      this.pads.push(new Pad(this.getRandomInt(0, this.width - 60), 40+(i * this.intervalHeight), type, move));
	    }
	  }
	
	  checkCollision(){
	    const that = this;
	    this.pads.forEach( function(pad){
	      if ((that.poodle.isFalling)
	      && (that.poodle.x + that.poodle.width > pad.x)
	      && (that.poodle.x < pad.x + pad.length)
	      && (that.poodle.y + that.poodle.height > pad.y)
	      && (that.poodle.y < pad.y + pad.thick)){
	          pad.onCollide(that.poodle);
	        }
	    });
	  }
	
	  checkDeath(){
	    if(this.poodle.y + this.poodle.height >= this.height){
	      gameState = false;
	    }
	  }
	
	  movePoodle(){
	    if(keyLeft) {
	      this.poodle.moveLeft();
	    }
	    else if (keyRight){
	      this.poodle.moveRight();
	    }
	  }
	
	  checkJump(){
	    const that = this;
	    if(this.poodle.y > this.height*0.4){
	      this.poodle.setPosition(this.poodle.x, (this.poodle.y - this.poodle.jumpSpeed));
	    } else {
	      this.points = this.points + Math.floor(this.poodle.jumpSpeed * .1);
	      this.pads.forEach( function(pad){
	        pad.y = pad.y + that.poodle.jumpSpeed;
	
	        if(that.pads.length > that.numPads){
	          that.pads = that.pads.slice(0, 6);
	        }
	
	        if(pad.y > that.height){
	          let type = "ord";
	          let move = false;
	          let moveRatio = .02 + (.48/3000) * that.points;
	
	          let num = Math.random();
	          if(num < 0.1) { type = "hype" };
	
	          let numTwo = Math.random();
	          if(numTwo < moveRatio) { move = true };
	
	          that.pads.unshift(new Pad(that.getRandomInt(0, that.width - 60), that.pads[0].y - that.intervalHeight, type, move));
	        }
	
	      });
	    }
	
	    this.poodle.jumpSpeed = this.poodle.jumpSpeed - 1;
	    if (this.poodle.jumpSpeed === 0){
	      this.poodle.isJumping = false;
	      this.poodle.isFalling = true;
	      this.poodle.fallSpeed = 1;
	    }
	  }
	
	  renderMenu(ctx){
	    if (gameState === false){
	      ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
	                                0, 0, this.width, this.height);
	    } else {
	      this.start();
	      clearInterval(this.menuID);
	    }
	
	  }
	
	  renderLoss(ctx){
	    if (gameState === false)
	    {
	      ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
	                                0, 0, this.width, this.height);
	      ctx.fillStyle = "Black";
	      ctx.font = "18pt Calibri";
	      ctx.fillText("GAME OVER", 320, 100);
	      ctx.fillText("YOUR SCORE: " + this.points, 310, 130);
	    } else {
	      this.start();
	      clearInterval(this.lossID);
	    }
	  }
	
	  draw(ctx){
	    if(gameState === false){
	      ctx.clearRect(0, 0, this.width, this.height);
	      this.lossID = setInterval(this.renderLoss.bind(this, this.ctx), 30);
	      clearInterval(this.intervalID);
	    } else {
	      ctx.clearRect(0, 0, this.width, this.height);
	      ctx.fillStyle = "#cccccc";
	      ctx.fillRect(0, 0, this.width, this.height);
	
	      this.movePoodle();
	      this.poodle.jump();
	
	      if(this.poodle.isJumping){
	        this.checkJump();
	      }
	
	      if(this.poodle.isFalling){
	        this.poodle.checkFall();
	        this.checkDeath();
	      }
	
	      this.checkCollision();
	
	      this.poodle.draw(ctx);
	      this.pads.forEach((pad) => {
	        if(pad.isMoving) {
	          if(pad.x < 0){
	            pad.direction = 1;
	          }
	          else if(pad.x + pad.length > this.width){
	            pad.direction = -1;
	          }
	          pad.x = pad.x + pad.direction * 5;
	        }
	        pad.draw(ctx);
	
	        ctx.fillStyle = "Black";
	        ctx.font = "18px Arial";
	        ctx.fillText("POINTS: " + this.points, 10, 20);
	      });
	    }
	  }
	
	  getRandomInt(min, max){
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  }
	
	  start(){
	    if(gameState === false){
	      this.menuID = setInterval(this.renderMenu.bind(this, this.ctx), 30);
	    } else {
	      this.reset();
	      this.intervalID = setInterval(this.draw.bind(this, this.ctx), 30);
	    }
	  }
	}
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Poodle = __webpack_require__(3);
	
	class Pad{
	  constructor(x, y, type, move){
	    this.length = 60;
	    this.thick = 10;
	    this.x = x;
	    this.y = y;
	    this.type = type;
	    this.direction = ~~(Math.random() * 2) ? -1 : 1;
	    this.isMoving = move;
	
	    let num = Math.random();
	    if(num < .2) { type }
	
	    if(type === "ord"){
	      this.color = "#2ECC71";
	    }
	    else if (type === "hype"){
	      this.color = "#F7F817";
	    }
	  }
	
	  draw(ctx){
	    ctx.fillStyle = this.color;
	    ctx.fillRect(this.x, this.y, this.length, this.thick);
	  }
	
	  onCollide(poodle){
	    poodle.fallStop();
	    if(this.type === "hype"){
	      poodle.jumpSpeed = 50;
	    }
	  }
	};
	
	module.exports = Pad;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	class Poodle{
	  constructor(width, height){
	    this.gameWidth = width;
	    this.gameHeight = height;
	    this.image = new Image();
	    this.image.src = "./assets/lumpy.png";
	    this.width = 55;
	    this.height = 60;
	    this.x = 0;
	    this.y = 0;
	    this.isJumping = false;
	    this.isFalling = false;
	    this.jumpSpeed = 0;
	    this.fallSpeed = 0;
	  }
	
	  setPosition(x, y){
	    this.x = x;
	    this.y = y;
	  }
	
	  draw(ctx){
	    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	  }
	
	  jump(){
	    if(this.isJumping === false && this.isFalling === false){
	      this.fallSpeed = 0;
	      this.isJumping = true;
	      this.jumpSpeed = 17;
	    }
	  }
	
	  checkFall(){
	    if(this.y + this.height < this.gameHeight){
	      this.setPosition(this.x, (this.y + this.fallSpeed));
	      this.fallSpeed = this.fallSpeed + 1;
	    }
	  }
	
	  fallStop(){
	    this.isFalling = false;
	    this.fallSpeed = 0;
	    this.jump();
	  }
	
	  moveLeft(){
	    if (this.x >0){
	      this.setPosition(this.x-10, this.y);
	    }
	  }
	
	  moveRight(){
	    if (this.x + this.width < this.gameWidth){
	      this.setPosition(this.x+10, this.y);
	    }
	  }
	
	
	
	}
	
	module.exports = Poodle;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Poodle = __webpack_require__(3);
	
	class GameView {
	  constructor(game, ctx){
	    this.ctx = ctx;
	    this.game = game;
	    this.poodle = new Poodle();
	  }
	
	  start(){
	    this.game.draw(this.ctx);
	  }
	
	
	}
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map