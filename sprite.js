var Sprite = Object.extend({
  init: function (x, y, width, height, image) {
    this.direction = 1;
    this.pos = { x: x, y: 0 };
    this.width = width;
    this.height = height;
    this.vel = { y: 1.5 };
    this.offset = { x: 0, y: 32 };
    this.image = image;
  },

  update: function (delta, matrix) {
    if (this.direction > 0) {
      this.pos.y += this.vel.y * delta;
      if (this.pos.y >= this.height) {
        this.direction = -1;
      }
    }
    else {
      this.pos.y -= this.vel.y * delta;
      if (this.pos.y <= 0) {
        this.direction = 1;
      }
    }

    mat4.translate(matrix, matrix, [0.0, this.pos.y, 0.0]);
  }
});