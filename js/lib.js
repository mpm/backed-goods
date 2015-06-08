function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var MonsterBrain = function(monster) {
  if (monster.move() === false) {
    monster.changeDirection(getRandomInt(1,5));
  }
};

var Score = {
  refresh: function(score) {
    console.log(score);
    $('#coins').html(score.coins);
    $('#snacks').html(score.snacks);
    $('#lifes').html(score.lifes);
  }
};

var Func = {
  SWITCH: 6,

  // not really necessary to check, but part of the original sources
  SWITCHABLE: 7,

  EXIT: 8
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
