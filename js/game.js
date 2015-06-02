

var keyPressed = false;

function gameLoop() {
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
  requestAnimationFrame(gameLoop);
}

var currentLevel;
window.onload = function() {
  currentLevel = new Level(levels[2]);
  currentLevel.drawMaze();
  gameLoop();
};
