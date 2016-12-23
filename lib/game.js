const Pad = require("./pad");
const Poodle = require("./poodle");

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
