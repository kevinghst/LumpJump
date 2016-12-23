var Platform = function(x, y, type){
//function takes position and platform type
  var that=this;

  that.firstColor = '#FF8C00';
  that.secondColor = '#EEEE00';
  that.onCollide = function(){
    player.fallStop();
  };
  //if platform type is different than 1, set right color & collision function (in this case just call player's fallStop() method we defined last time
  if (type === 1) {
  //but if type is equal '1', set different color and set jumpSpeed to 50. After such an operation checkJump() method will takes substituted '50' instead of default '17' we set in jump().
    that.firstColor = '#AADD00';
    that.secondColor = '#698B22';

    that.onCollide = function(){
      player.fallStop();
      player.jumpSpeed = 50;
    };
  }

  that.x = ~~x;
  that.y = y;
  that.type = type;

  return that;
};
