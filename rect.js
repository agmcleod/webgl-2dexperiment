var Rect = Object.extend({
  init: function (x, y, width, height, color) {
    this.pos = { x: x, y: y };
    this.width = width;
    this.height = height;
    this.color = color;
  },

  update: function () {}
});