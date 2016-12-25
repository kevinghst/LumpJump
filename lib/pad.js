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
    if(num < 0.2) { type }

    if(type === "ord"){
      this.color = "#F5F5F5";
    }
    else if (type === "hype"){
      this.color = "#F7F817";
    }
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    this.roundRect(ctx, this.x, this.y, this.length, this.thick, 5, true);
  }

  onCollide(poodle){
    poodle.fallStop();
    if(this.type === "hype"){
      poodle.jumpSpeed = 50;
    }
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke){
    if (typeof stroke == 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }
}

module.exports = Pad;
