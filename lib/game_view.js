const Game = require("./game");
const Poodle = require("./poodle");

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
