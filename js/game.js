var Game = function(config) {
  var story = _.map(config.levels, function(index) { return Levels[index]; });
  var currentLevel = null;
  var frameNeeded = true;

  var gameLoop = function() {
    if (frameNeeded) {
      frameNeeded = false;
      setTimeout(function() { frameNeeded = true; }, 1000 / 50);
      gameStep();
    }
    requestAnimationFrame(gameLoop);
  };

  var gameStep = function() {
    var player = currentLevel.player;
    if (currentLevel.isActive()) {
      if (input.isDown('UP')) {
        player.changeDirection(Direction.UP);
        player.move();
      } else if (input.isDown('DOWN')) {
        player.changeDirection(Direction.DOWN);
        player.move();
      } else if (input.isDown('LEFT')) {
        player.changeDirection(Direction.LEFT);
        player.move();
      } else if (input.isDown('RIGHT')) {
        player.changeDirection(Direction.RIGHT);
        player.move();
      }
    }
    currentLevel.drawMovables();
    currentLevel.drawMaze();
  };

  var levelCompleted = function(score) {
    if (story.length > 0) {
      startLevel();
    }
  };

  var startLevel = function() {
    currentLevel = new Level(story.shift());
    currentLevel.onExit(levelCompleted);
    currentLevel.clearScreen();
    gameLoop();
  };

  startLevel();
};

window.onload = function() {
  //var game = Game({levels: [4]});
  var game = Game({levels: [0,1,2,3,4,5,6]});
};
