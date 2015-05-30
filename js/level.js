var Level = function(level) {
  var screen = new Screen();
  var _level = level;
  var score = {
    snacks: 0,
    coins: 0,
    lifes: 0
  };

  var monsters = [];

  var getBlock = function(attribute, x, y) {
    return _level.blocks.current[attribute][x * 40 + y];
  };

  var playerCollision = function(x, y) {
    return Flag.isBlockedForPlayer(getBlock('flags', x, y));
  };

  var monsterCollision = function(x, y) {
    return Flag.isBlockedForMonster(getBlock('flags', x, y));
  };

  var playerDestination = function(x, y, player) {
    var block = getBlock('type', x, y);

    if (block == Block.ITEM_COIN) {
      _level.blocks.current.type[x * 40 + y] = Block.EMPTY;
      score.snacks += 1;
      _drawMaze();
    }
  };

  var player = new Movable(level.info.start.x, level.info.start.y,
                           Direction.LEFT, {type: Block.PLAYER,
                            collisionCallback: playerCollision,
                            destinationCallback: playerDestination,
                             getBlock: getBlock},
                           screen.renderMovable);

  level.info.monsters.forEach(function(monster) {
    monsters.push(new Movable(monster.x, monster.y,
                              monster.direction,
                              {
                                type: Block.MONSTER,
                                collisionCallback: monsterCollision,
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
      console.log('switch toggled');
    }
  };

  var _drawMaze = function() {
      screen.clearLayer('maze');
      for(var y = 0; y < 40; y++) {
        for(var x = 0; x < 64; x++) {
          screen.drawBlock('maze', x, y, getBlock('type', x, y));
        }
      }
  };


  return {
    player: player,

    drawMaze: _drawMaze,

    drawMovables: function() {
      monsters.forEach(function(monster) {
        monster.animate();
      });
      player.animate();
    }
  };
};
