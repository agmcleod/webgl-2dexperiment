var Sprite = Object.extend({
  init: function () {
    this.direction = 1;
    this.pos = { y: 0 };
    this.vel = { y: 1.5 };
  },

  update: function (delta, matrix) {
    if (this.direction > 0) {
      this.pos.y += this.vel.y * delta;
      if (this.pos.y > 5) {
        this.direction = -1;
      }
    }
    else {
      this.pos.y -= this.vel.y * delta;
      if (this.pos.y < -5) {
        this.direction = 1;
      }
    }

    mat4.translate(matrix, matrix, [0.0, this.pos.y, 0.0]);
  }
});