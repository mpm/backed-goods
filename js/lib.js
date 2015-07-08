function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var MonsterBrain = function(monster) {
  if (monster.move() === false) {
    monster.changeDirection(getRandomInt(1,5));
  }
};

var Score = {
  _showKey: function(score, color) {
    if (score[color + 'Key']) {
      $('#' + color + '-key').addClass('key-found');
    } else {
      $('#' + color + '-key').removeClass('key-found');
    }
  },
  refresh: function(score) {
    $('#coins').html(score.coins);
    $('#snacks').html(score.snacks);
    $('#lifes').html(score.lifes);
    this._showKey(score, 'red');
    this._showKey(score, 'green');
    this._showKey(score, 'blue');
  }
};

var Func = {
  SWITCH: 6,

  // not really necessary to check, but part of the original sources
  SWITCHABLE: 7,

  EXIT: 8
};

var Resizer = {
  init: function() {
  }
};

(function() {
    Resizer.init();
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
        },
        wasPressed: function(key) {
          var pressed = pressedKeys[key.toUpperCase()];
          if (pressed) {
            pressedKeys[key.toUpperCase()] = false;
            return true;
          }
          return false;
        }
    };

})();
