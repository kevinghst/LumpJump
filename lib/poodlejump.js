const Game = require("./game.js");
const GameView = require("./game_view.js");



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
