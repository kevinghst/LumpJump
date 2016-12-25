class Snowflake{
  constructor(x, y, width, height, number){
    this.gameWidth = width;
    this.gameHeight = height;
    this.x = x;
    this.y = y;
    this.r = Math.random()*4+1;
    this.d = Math.random() * number;
    this.angle = 0;
  }

  draw(ctx){
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
    ctx.fill();
    this.update();
  }

  update(){
    this.angle += 0.01;
    this.y += Math.cos(this.angle + this.d) + 1 + this.r/2;
    this.x += Math.sin(this.angle) * 2;

    if(this.x > this.gameWidth || this.x < -5 || this.y > this.gameHeight){
      let num = Math.random();
      if(num < 0.67){
        this.x = Math.random() * this.gameWidth;
        this.y = -10;
      } else {
        if(Math.sin(this.angle) > 0){
          this.x = -5;
          this.y = Math.random()* this.gameHeight;
        } else {
          this.x = this.gameWidth + 5;
          this.y = Math.random() * this.gameHeight;
        }
      }
    }
  }

}

module.exports = Snowflake;
