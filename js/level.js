var Level = function(level) {
  var screen = new Screen();
  var _level = level;
  var monsters = [];
  var getBlock = function(attribute, x, y) {
    return _level.blocks.current[attribute][x * 40 + y];
  };
  var playerCollision = function(x, y) {
    return getBlock('type', x, y) ==  Block.BRICK_RED;
  };

  var player = new Movable(level.info.start.x, level.info.start.y,
                           Direction.LEFT, {type: Block.PLAYER,
                            collisionCallback: playerCollision,
                             getBlock: getBlock},
                           screen.renderMovable);

  level.info.monsters.forEach(function(monster) {
    monsters.push(new Movable(monster.x, monster.y,
                              monster.direction,
                              {
                                type: Block.MONSTER,
                                onAnimate: MonsterBrain
                              }, screen.renderMovable)
                 );
  });

  var handleBlock = function(x, y) {
    var fn = getBlock('func', x, y);

    if (fn == Func.EXIT) {
      console.log('exit reached');
    }

    if (fn == Func.SWITCH) {
      // Handle Switch
    }

  };

  return {
    player: player,

    drawMaze: function() {
      screen.clearLayer('maze');
      for(var y = 0; y < 40; y++) {
        for(var x = 0; x < 64; x++) {
          screen.drawBlock('maze', x, y, getBlock('type', x, y));
        }
      }
    },

    drawMovables: function() {
      monsters.forEach(function(monster) {
        monster.animate();
      });
      player.animate();
    }
  };
};
