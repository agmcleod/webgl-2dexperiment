var Rect = Object.extend({
  init: function (x, y, width, height) {
    this.pos = { x: x, y: y };
    this.width = width;
    this.height = height;
    this.color = {
      r: 0.0,
      g: 1.0,
      b: 0.0
    };
  }
});