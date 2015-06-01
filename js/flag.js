var Flag = {
  isBlockedForPlayer: function(flag) {
    return (flag & 1 == 1);
  },
  isBlockedForMonster: function(flag) {
    return (flag & 2 == 2);
  }
};
