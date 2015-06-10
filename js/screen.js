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

  var _drawBlock = function(layerName, x, y, index, options) {
      if (index == 0) { index = 99 };
      var sX = x * 10 * _magnify;
      var sY = y * 10 * _magnify;
      var sWidth = 10 * _magnify;
      var layer = layers[layerName];
      if (options && options.oldX) {
        var padding = 5;
        layer.clearRect(options.oldX * 10 * _magnify,
                        options.oldY * 10 * _magnify,
                        sWidth,
                        sWidth);
        //layer.clearRect(sX - padding,
                        //sY - padding,
                        //sWidth + padding * 2,
                        //sWidth + padding * 2);
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
    drawBlock: function(layerName, x, y, index, options) {
      _drawBlock(layerName, x, y, index, options);
    },
    renderMovable: function(x, y, type, options) {
      _drawBlock('sprites', x, y, type, options);
    }
  };
};
