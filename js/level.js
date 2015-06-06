var Level = function(level) {
  var _active = true;
  var screen = new Screen();
  var _level = level;
  var _onExit = null;
  var score = {
    snacks: 0,
    coins: 0,
    lifes: 0,

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
    return _level.blocks.current[attribute][x * 40 + y];
  };

  var setBlock = function(attribute, x, y, value) {
    _level.blocks.current[attribute][x * 40 + y] = value;
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
      }
    }
    return blocked;
  };

  var monsterCollision = function(x, y) {
    return Flag.isBlockedForMonster(getBlock('flags', x, y));
  };

  var handleBlock = function(x, y) {
    var block = getBlock('type', x, y);
    var func = getBlock('func', x, y);

    switch (block) {
      case Block.ITEM_COIN:
      case Block.ITEM_COIN_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.coins += 1;
        triggerRedraw();
        break;
      case Block.ITEM_SNACK:
      case Block.ITEM_SNACK_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.snacks += 1;
        triggerRedraw();
        break;
      case Block.ITEM_LIFE:
      case Block.ITEM_LIFE_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.lifes += 1;
        triggerRedraw();
        break;
      case Block.KEY_RED:
      case Block.KEY_RED_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.redKey = true;
        triggerRedraw();
        break;
      case Block.KEY_GREEN:
      case Block.KEY_GREEN_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.greenKey = true;
        triggerRedraw();
        break;
      case Block.KEY_BLUE:
      case Block.KEY_BLUE_BG2:
        setBlock('type', x, y, Block.getBackground(block));
        score.blueKey = true;
        triggerRedraw();
        break;
    }

    if (func == Func.EXIT && _onExit) {
      _active = false;
      _onExit(score);
    }

    if (func == Func.SWITCH) {
      triggerSwitch(x, y);
      triggerRedraw();
    }
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

  var _drawMaze = function() {
    screen.clearLayer('maze');
    for(var y = 0; y < 40; y++) {
      for(var x = 0; x < 64; x++) {
        screen.drawBlock('maze', x, y, getBlock('type', x, y));
      }
    }
    _needsRedraw = false;
  };


  return {
    player: player,

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
    },

    onExit: function(callback) {
      _onExit = callback;
    },

    isActive: function() {
      return _active;
    }
  };
};
