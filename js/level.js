var Level = function(level, options) {
  var _active = true;
  var screen = new Screen();
  var _level = level;
  var fog = new Array(Config.level.width * Config.level.height);
  var score = {
    snacks: 0,
    coins: 0,
    lifes: 1,

    redKey: false,
    greenKey: false,
    blueKey: false
  };

  var monsters = [];

  var _needsRedraw = true;

  var triggerRedraw = function() {
    _needsRedraw = true;
  };

  var getBlock = function(attribute, x, y) {
    return _level.blocks.current[attribute][x * Config.level.height + y];
  };

  var setBlock = function(attribute, x, y, value) {
    _level.blocks.current[attribute][x * Config.level.height + y] = value;
  };

  var switchBlocksById = function(flags) {
    var switchId = Flag.getSwitchId(flags);
    var currentBlocks = _level.blocks.current;
    var altBlocks = _level.blocks.alternate;

    var switchBlock = function(blockNr, field) {
      _.each(['type', 'func', 'flags'], function(field) {
        var current = _.clone(currentBlocks[field][blockNr]);
        currentBlocks[field][blockNr] = _.clone(altBlocks[field][blockNr]);
        altBlocks[field][blockNr] = current;
      });
    };

    for (blockNr = 0; blockNr < currentBlocks.type.length; blockNr++) {
      if (altBlocks.func[blockNr] == Func.SWITCHABLE &&
        Flag.getSwitchId(altBlocks.flags[blockNr]) == switchId) {
        switchBlock(blockNr);
      }
    }
  };

  var triggerSwitch = function(x, y) {
    var flags = getBlock('flags', x, y);
    switchBlocksById(flags);

    var type = getBlock('type', x, y);
    switch (type) {
      case Block.SWITCH1_ON:
        type = Block.SWITCH1_OFF;
        break;
      case Block.SWITCH1_OFF:
        type = Block.SWITCH1_ON;
        break;
      case Block.SWITCH2_ON:
        type = Block.SWITCH2_OFF;
        break;
      case Block.SWITCH2_OFF:
        type = Block.SWITCH2_ON;
        break;
    }
    setBlock('type', x, y, type);
    triggerRedraw();
  };

  var unlockDoor = function(blockType, x, y) {
    var unlocked = false;
    if ((blockType == Block.DOOR2_RED && score.redKey) ||
        (blockType == Block.DOOR2_GREEN && score.greenKey) ||
        (blockType == Block.DOOR2_BLUE && score.blueKey)) {

      setBlock('type', x, y, Block.DOOR2_OPENED);
      setBlock('flags', x, y, 0);
      triggerRedraw();
      return true;
    } else {
      return false;
    }
  };

  var playerCollision = function(x, y, direction) {
    var blockType = getBlock('type', x, y);
    var blocked = Flag.isBlockedForPlayer(getBlock('flags', x, y));

    if (blocked) {
      if (Block.isPipe(blockType)) {
        return !Block.isPipePassable(blockType, direction);
      } else if (Block.isLockedDoor(blockType)) {
        return !unlockDoor(blockType, x, y);
      } else if (player.isInPipe()) {
        // some parts of certain level require that you exit a pipe onto
        // a blocked field. this allows the player to move on that field,
        // but once you slide off you cannot go back there.
        return false;
      }
    }
    return blocked;
  };

  var monsterCollision = function(x, y) {
    if (player.getPosition().x == x &&
        player.getPosition().y == y) {
      if (score.lifes-- < 1) {
        options.onGameOver(score);
      } else {
        options.onDeath(score);
      }
      Score.refresh(score);
    }

    return Flag.isBlockedForMonster(getBlock('flags', x, y));
  };

  var snackAnimation = function() {
    player.setSpriteAnimation([1,1,2,2,3,3,4,4]);
  };

  var handleBlock = function(x, y) {
    var block = getBlock('type', x, y);
    var func = getBlock('func', x, y);

    switch (block) {
      case Block.ITEM_COIN:
      case Block.ITEM_COIN_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        snackAnimation();
        score.coins += 1;
        triggerRedraw();
        Score.refresh(score);
        break;
      case Block.ITEM_SNACK:
      case Block.ITEM_SNACK_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        snackAnimation();
        score.snacks += 1;
        triggerRedraw();
        Score.refresh(score);
        break;
      case Block.ITEM_LIFE:
      case Block.ITEM_LIFE_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.lifes += 1;
        triggerRedraw();
        Score.refresh(score);
        break;
      case Block.KEY_RED:
      case Block.KEY_RED_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.redKey = true;
        triggerRedraw();
        Score.refresh(score);
        break;
      case Block.KEY_GREEN:
      case Block.KEY_GREEN_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.greenKey = true;
        triggerRedraw();
        Score.refresh(score);
        break;
      case Block.KEY_BLUE:
      case Block.KEY_BLUE_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.blueKey = true;
        triggerRedraw();
        Score.refresh(score);
        break;
    }

    if (func == Func.EXIT) {
      _active = false;
      options.onExit(score);
    }

    if (func == Func.SWITCH) {
      triggerSwitch(x, y);
      triggerRedraw();
    }
  };

  var _drawMaze = function() {
    screen.clearLayer('maze');
    for(var y = 0; y < Config.level.height; y++) {
      for(var x = 0; x < Config.level.width; x++) {
        screen.drawBlock('maze', x, y, getBlock('type', x, y));
      }
    }
    _needsRedraw = false;
  };


  var player = new Movable(level.info.start.x, level.info.start.y,
                           Direction.LEFT, {type: Block.PLAYER,
                            collisionCallback: playerCollision,
                            destinationCallback: handleBlock,
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
  Score.refresh(score);

  return {
    player: player,

    clearScreen: function() {
      screen.clearLayer('sprites');
      screen.clearLayer('maze');
    },

    drawMaze: function(forceRedraw) {
      if (_needsRedraw || forceRedraw) {
        _drawMaze();
      }
    },

    drawMovables: function() {
      monsters.forEach(function(monster) {
        monster.animate();
      });
      player.animate();
      // Calculation:
      // padding - (viewport width / 2) = puts the tile at 0,0 in the center of the viewport
      // so after this, substract player coordinates
      $('#viewport').scrollLeft((Config.level.width * Config.viewPort.blockSize) - (Config.viewPort.width / 2) + player.getPosition().currentX * 20);
      $('#viewport').scrollTop((Config.level.height * Config.viewPort.blockSize) - (Config.viewPort.height / 2) + player.getPosition().currentY * 20);
    },

    isActive: function() {
      return _active;
    }
  };
};
