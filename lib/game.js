const Pad = require("./pad");
const Poodle = require("./poodle");
const Monster = require("./monster");
const Snowflake = require("./snowflake");

class Game{
  constructor(ctx, width, height, numPads){
    this.image = new Image();
    this.image.src = "./assets/background.png";
    this.snowflakes = [];
    this.pads = [];
    this.monsters = [];
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.intervalHeight = (height - 80)/numPads;
    this.numPads = numPads;
    this.poodle = new Poodle(width, height);
    this.poodle.setPosition(width/2, height/2);
    this.addPads();
    this.addSnowflakes();
    this.points = 0;
    this.intervalID = null;
    this.lossID = null;
    this.menuId = null;
    this.immune = false;
  }

  reset(){
    this.snowflakes = [];
    this.pads = [];
    this.monsters = [];
    this.poodle = new Poodle(this.width, this.height);
    this.poodle.setPosition(this.width/2, this.height/2);
    this.addPads();
    this.addSnowflakes();
    this.points = 0;
  }

  addSnowflakes(){
    let number = 40;
    for(let i=0; i<number; i++){
      let x = Math.random() * this.width;
      let y = Math.random() * this.height;
      this.snowflakes.push(new Snowflake(x, y, this.width, this.height, number));
    }
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
          if(pad.type === "hype"){
            that.immune = true;
          }
          else if(pad.type === "ord"){
            that.immune = false;
          }
        }
    });
  }

  checkMonsterStep(){
    const that = this;
    this.monsters.forEach( function(monster){
      if((that.poodle.isFalling)
      && (that.poodle.x + that.poodle.width > monster.x)
      && (that.poodle.x < monster.x + monster.width)
      && (that.poodle.y + that.poodle.height > monster.y)
      && (that.poodle.y < monster.y + monster.height/5)){
        that.poodle.fallStop();
        that.poodle.jumpSpeed = 25;
        that.immune = true;
        monster.state = "dead";
      }
    });
  }

  checkMonsterCollision(){
    const that = this;
    if (this.immune === false){
      this.monsters.forEach( function(monster){
        if(monster.contains([that.poodle.x, that.poodle.y])
          || monster.contains([that.poodle.x + that.poodle.width, that.poodle.y])
          || monster.contains([that.poodle.x, that.poodle.y + that.poodle.height])
          || monster.contains([that.poodle.x + that.poodle.width, that.poodle.y + that.poodle.height])){
            gameState = false;
          }
      });
    }
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
      this.points = this.points + Math.floor(this.poodle.jumpSpeed * 0.1);
      this.pads.forEach( function(pad){
        pad.y = pad.y + that.poodle.jumpSpeed;

        if(that.pads.length > that.numPads){
          that.pads = that.pads.slice(0, 6);
        }

        if(pad.y > that.height){
          let type = "ord";
          let move = false;
          let moveRatio = 0.02 + (0.48/3000) * that.points;

          let num = Math.random();
          if(num < 0.1) { type = "hype" };

          let numTwo = Math.random();
          if(numTwo < moveRatio) { move = true };

          that.pads.unshift(new Pad(that.getRandomInt(0, that.width - 60), that.pads[0].y - that.intervalHeight, type, move));

          let monsterRatio = 0.02 + (0.18/10000) * that.points;
          if (monsterRatio > 0.2) { monsterRatio = 0.2 };
          let numThree = Math.random();
          if(numThree < monsterRatio) {
            that.monsters.unshift(new Monster(that.getRandomInt(0, that.width - 60), -70));
          }
        }
      });

      let monstersDup = [].concat(this.monsters);
      this.monsters.forEach( function(monster, idx){
        if(monster.state === "dead"){
          monster.y = monster.y + 40;
        } else {
          monster.y = monster.y + that.poodle.jumpSpeed;
          monster.Ymin = monster.Ymin + that.poodle.jumpSpeed;
          monster.Ymax = monster.Ymax + that.poodle.jumpSpeed;
          if (monster.y > that.height){
            monstersDup.splice(idx, 1);
          }
        }
      });

      this.snowflakes.forEach( (snowflake)=>{
        snowflake.y = snowflake.y + that.poodle.jumpSpeed;
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
      ctx.fillText("GAME OVER", 300, 100);
      ctx.fillText("YOUR SCORE: " + this.points, 280, 130);
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
      ctx.fillStyle = "#6b92b9";

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

      this.checkMonsterStep();
      this.checkCollision();
      this.checkMonsterCollision();
      this.poodle.draw(ctx);

      this.snowflakes.forEach((snowflake) => {
        snowflake.draw(ctx);
      });

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
      });

      this.monsters.forEach((monster) => {
        if(monster.x < 0){
          monster.Xdirection = 1;
          monster.setDirection();
        }
        else if (monster.x + monster.width > this.width){
          monster.Xdirection = -1;
          monster.setDirection();
        }
        monster.x = monster.x + monster.Xdirection * 4;

        if(monster.y < monster.Ymin){
          monster.Ydirection = 1;
        }
        else if (monster.y + monster.height > monster.Ymax){
          monster.Ydirection = -1;
        }
        monster.y = monster.y + monster.Ydirection * 3;
        monster.draw(ctx);
      });

      ctx.fillStyle = "Black";
      ctx.font = "23px Arial";
      ctx.fillText("POINTS: " + this.points, 10, 30);
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
