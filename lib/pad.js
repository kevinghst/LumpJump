const Poodle = require("./poodle");

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
      this.color = "#F5F5F5";
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
}

module.exports = Pad;
