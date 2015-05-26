function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var Direction = {
  LEFT: 1,
  RIGHT: 2,
  UP: 3,
  DOWN: 4
};

var Block = {
  PLAYER: 1,
  MONSTER: 10,
  BRICK_WHITE: 11,
  BRICK_BLUE: 12,
  BRICK_RED: 13,
  TREE: 14,

  GATE_CLOSED: 15,
  GATE_OPENED: 16,

  SWITCH1_OFF: 17,
  SWITCH1_ON : 18,

  SWITCH2_OFF: 19,
  SWITCH2_ON : 20,

  DOOR1_CLOSED: 21,
  DOOR1_OPENED: 22,

  ITEM_COIN:  23,
  ITEM_LIFE:  24,
  ITEM_SNACK: 25,

  BOX: 26,
  BLUE_TUNNEL_HORIZONTAL: 27,

  ARROW_UP: 28,
  ARROW_DOWN: 29,
  ARROW_LEFT: 30,
  ARROW_RIGHT: 31,

  TILE_BLANK: 32,
  FORCE: 33,
  KEY_RED: 34,
  KEY_GREEN: 35,
  KEY_BLUE: 36,

  TILE_BLUE_FORBIDDEN: 37,

  FLOOR2: 38,

  DOOR2_RED: 39,
  DOOR2_BLUE: 40,
  DOOR2_GREEN: 41,
  DOOR2_OPENED: 42,

  FLOOR3: 43,

  PIPE_HORIZONTAL: 44,
  PIPE_VERTICAL: 45,
  PIPE_LEFT_DOWN: 46,
  PIPE_LEFT_UP: 47,
  PIPE_RIGHT_UP: 48,
  PIPE_RIGHT_DOWN: 49,
  PIPE_JUNCTION: 50,
  PIPE_UP_END: 51,
  PIPE_DOWN_END: 52,
  PIPE_LEFT_END: 53,
  PIPE_RIGHT_END: 54,

  isPipe: function(type) {
    return (type >= this.PIPE_HORIZONTAL && type <= this.PIPE_RIGHT_END);
  }

};

var MonsterBrain = function(monster) {
  //monster.move(getRandomInt(-1, 2),
               //getRandomInt(-1, 2));
};

var Screen = function() {
  var _magnify = 2;
  var sprites = document.getElementById('sprite-library');
  var _maze = document.getElementById('sprites');
  var layers = {
    maze: document.getElementById('maze').getContext('2d'),
    sprites: _maze.getContext('2d')
  };
  var clear = function(layer) {
    layer.clearRect(0, 0, _maze.width, _maze.height);
  };

  var _drawBlock = function(layerName, x, y, index, clearBackground) {
      if (index == 0) { index = 99 };
      var sX = x * 10 * _magnify;
      var sY = y * 10 * _magnify;
      var sWidth = 10 * _magnify;
      var layer = layers[layerName];
      if (clearBackground) {
        var padding = 5;
        layer.clearRect(sX - padding,
                        sY - padding,
                        sWidth + padding * 2,
                        sWidth + padding * 2);
      }
      layer.drawImage(sprites,
          0, (index - 1) * 10,
         10, 10,
          sX, sY, sWidth, sWidth);
  };
  return {
    clearLayer: function(layerName) {
      clear(layers[layerName]);
    },
    drawBlock: function(layerName, x, y, index) {
      _drawBlock(layerName, x, y, index);
    },
    renderMovable: function(x, y, type) {
      _drawBlock('sprites', x, y, type, true);
    }
  };
};

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

var Movable = function(x, y, direction, options, renderCallback) {
  var _options = options;
  var speed = 2;
  var direction = direction;
  var step = 0.1;
  var factor = (1 / step);
  var _x = x * factor;
  var _y = y * factor;
  var _targetX = _x;
  var _targetY = _y;
  var _renderCallback = renderCallback;
  var _moving = false;

  return {
    changeDirection: function(newDirection) {
      direction = newDirection;
    },
    move: function() {
      switch (direction) {
        case Direction.LEFT:
          this._move(-1, 0);
          break;
        case Direction.RIGHT:
          this._move(1, 0);
          break;
        case Direction.UP:
          this._move(0, -1);
          break;
        case Direction.DOWN:
          this._move(0, 1);
          break;
      }
    },
    _move: function(relativeX, relativeY) {
      if (_x != _targetX || _y != _targetY) {
        // dont allow new targets when still moving
      } else {
        var plannedTargetX = _targetX + relativeX * factor;
        var plannedTargetY = _targetY + relativeY * factor;

        var blocked = false;
        if (options.collisionCallback) {
          blocked = options.collisionCallback(plannedTargetX / factor, plannedTargetY / factor);
        }

        if (!blocked) {
          _targetX = plannedTargetX;
          _targetY = plannedTargetY;
          _moving = true;
        }
      }
    },
    animate: function() {
      if (options.onAnimate) {
        options.onAnimate(this);
      }
      if (_moving) {
        if (_x < _targetX) { _x += speed; }
        if (_x > _targetX) { _x -= speed; }
        if (_y < _targetY) { _y += speed; }
        if (_y > _targetY) { _y -= speed }

        if (_moving && _x == _targetX && _y == _targetY) {
          _moving = false;
          // TODO: nur fuer player
          if (options.getBlock) {
            var t = options.getBlock('type', _x / factor, _y / factor);
            if (Block.isPipe(t)) {
              var newDir = null;
              switch(t) {
                case Block.PIPE_LEFT_DOWN:
                  this.changeDirection(
                    direction == Direction.RIGHT ? Direction.DOWN : Direction.LEFT);
                  break;
                case Block.PIPE_LEFT_UP:
                  this.changeDirection(
                    direction == Direction.RIGHT ? Direction.UP : Direction.LEFT);
                  break;
                case Block.PIPE_RIGHT_DOWN:
                  this.changeDirection(
                    direction == Direction.LEFT ? Direction.DOWN : Direction.RIGHT);
                  break;
                case Block.PIPE_RIGHT_UP:
                  this.changeDirection(
                    direction == Direction.LEFT ? Direction.UP : Direction.RIGHT);
                  break;
              }
              this.move();
            }
          }
        }
      }
      renderCallback(_x / factor, _y / factor, options.type);
    }
  };
};

(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        },
        keysUp: function() {
          return pressedKeys == {};
        }
    };
})();
