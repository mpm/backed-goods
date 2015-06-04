var Game = function(config) {
  var story = _.map(config.levels, function(index) { return Levels[index]; });
  var currentLevel = null;

  var gameLoop = function() {
    var player = currentLevel.player;
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
    currentLevel.drawMovables();
    currentLevel.drawMaze();
    if (currentLevel.isActive()) {
      requestAnimationFrame(gameLoop);
    }
  };

  var levelCompleted = function(score) {
    if (story.length > 0) {
      startLevel();
    }
  };

  var startLevel = function() {
    currentLevel = new Level(story.shift());
    currentLevel.onExit(levelCompleted);
    currentLevel.drawMaze();
    gameLoop();
  };

  startLevel();
};

window.onload = function() {
  //var game = Game({levels: [4]});
  var game = Game({levels: [0,1,2,3,4,5,6]});
};
