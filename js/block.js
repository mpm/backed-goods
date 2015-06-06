var Block = {
  EMPTY: 0,
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
  ITEM_FORCE: 33,
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
  PIPE_RIGHT_END: 53,
  PIPE_LEFT_END: 54,

  BLUE_TUNNEL_VERTICAL: 55,

  ITEM_COIN_BG2: 56,
  ITEM_LIFE_BG2: 57,
  ITEM_SNACK_BG2: 58,
  ITEM_FORCE_BG2: 59,

  KEY_RED_BG2: 60,
  KEY_GREEN_BG2: 61,
  KEY_BLUE_BG2: 62,

  POLE_BG2: 63,

  WIRING: 64,

  getBackground: function(type) {
    return type < Block.ITEM_COIN_BG2 ? Block.EMPTY : Block.FLOOR2;
  },

  isPipe: function(type) {
    return (type >= this.PIPE_HORIZONTAL && type <= this.PIPE_LEFT_END);
  },

  _isPipeVerticallyPassable: function(blockType) {
    return (blockType == Block.PIPE_VERTICAL ||
            blockType == Block.PIPE_UP_END ||
            blockType == Block.PIPE_DOWN_END ||
            blockType == Block.PIPE_JUNCTION);
  },

  _isPipeHorizontallyPassable: function(blockType) {
    return (blockType == Block.PIPE_HORIZONTAL ||
            blockType == Block.PIPE_RIGHT_END ||
            blockType == Block.PIPE_LEFT_END ||
            blockType == Block.PIPE_JUNCTION);
  },

  isPipePassable: function(blockType, direction) {
    switch(direction) {
      case Direction.LEFT:
        return (this._isPipeHorizontallyPassable(blockType) ||
               blockType == Block.PIPE_RIGHT_DOWN ||
               blockType == Block.PIPE_RIGHT_UP);
      case Direction.RIGHT:
        return (this._isPipeHorizontallyPassable(blockType) ||
               blockType == Block.PIPE_LEFT_DOWN ||
               blockType == Block.PIPE_LEFT_UP);
      case Direction.UP:
        return (this._isPipeVerticallyPassable(blockType) ||
               blockType == Block.PIPE_LEFT_DOWN ||
               blockType == Block.PIPE_RIGHT_DOWN);
      case Direction.DOWN:
        return (this._isPipeVerticallyPassable(blockType) ||
               blockType == Block.PIPE_LEFT_UP ||
               blockType == Block.PIPE_RIGHT_UP);
    }
    return false;
  },

  isLockedDoor: function(blockType) {
    return blockType == Block.DOOR2_RED ||
           blockType == Block.DOOR2_BLUE ||
           blockType == Block.DOOR2_GREEN;
  }
};
