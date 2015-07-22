var Screen = function() {
  // when using lo res (original) sprites:
  //var _magnify = 2;
  //var _spriteDim = 10;
  var _magnify = 1;
  var _spriteDim = 20;
  var sprites = document.getElementById('sprite-library');
  var _maze = document.getElementById('sprites');
  var map = document.getElementById('map');
  var layers = {
    maze: document.getElementById('maze').getContext('2d'),
    sprites: _maze.getContext('2d')
  };
  var clear = function(layer) {
    layer.clearRect(0, 0, _maze.width, _maze.height);
  };

  var _drawBlock = function(layerName, x, y, index, options) {
      if (index === 0) { index = 99; }
      var layer = layers[layerName];
      layer.save();
      layer.scale(_magnify, _magnify);
      var sX = x * _spriteDim;
      var sY = y * _spriteDim;
      var sWidth = _spriteDim;
      if (options && options.oldX) {
        layer.fillStyle = "rgb(200,0,0)";
        layer.fillRect(Math.max(0, options.oldX * _spriteDim),
                        Math.max(0, options.oldY * _spriteDim),
                        sWidth,
                        sWidth);
      }
      layer.translate(sX + (_spriteDim / 2), sY + (_spriteDim / 2));
      if (options && options.direction) {
        var angle = 0;
        var scale = 1;
        switch (options.direction) {
          case Direction.UP:
            angle = -90;
            break;
          case Direction.DOWN:
            angle = 90;
            break;
          case Direction.LEFT:
            scale = -1;
            break;
        }
        layer.rotate(angle * Math.PI / 180);
        layer.scale(scale, 1);
      }
      layer.drawImage(sprites,
          0, (index - 1) * _spriteDim,
         sWidth, sWidth,
          -(sWidth / 2), -(sWidth / 2), sWidth, sWidth);
      layer.restore();
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
