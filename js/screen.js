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
