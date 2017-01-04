
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

  continualFall(){
    this.setPosition(this.x, (this.y + this.fallSpeed));
    this.fallSpeed = this.fallSpeed + 1;
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
