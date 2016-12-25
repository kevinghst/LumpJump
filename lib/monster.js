class Monster{
  constructor(x, y){
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 70;
    this.Ymin = this.y - 15;
    this.Ymax = this.y + this.height + 15;
    this.Xdirection = ~~(Math.random() * 2) ? -1 : 1;
    this.Ydirection = ~~(Math.random() * 2) ? -1 : 1;
    if (this.Xdirection === 1){
      this.image.src = "./assets/iceKingFloatRight.png";
    } else {
      this.image.src = "./assets/iceKingFloatLeft.png";
    }
  }

  draw(ctx){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  setDirection(){
    if (this.Xdirection === 1){
      this.image.src = "./assets/iceKingFloatRight.png";
    } else {
      this.image.src = "./assets/iceKingFloatLeft.png";
    }
  }

  contains(coord){
    let x = coord[0];
    let y = coord[1];
    if (this.x < x
        && this.x + this.width > x
        && this.y < y
        && this.y + this.height > y){
          return true;
        } else {
          return false;
        }
  }

}

module.exports = Monster;
