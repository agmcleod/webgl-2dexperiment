var Sprite = Object.extend({
  init: function (x, y, width, height, image) {
    this.direction = 1;
    this.pos = { x: x, y: 0 };
    this.width = width;
    this.height = height;
    this.vel = { x: 100, y: 100 };
    this.offset = { x: 0, y: 0 };
    this.image = image;

    // heavily hardcoded frame positions
    this.frames = [
      {x: 0, y: 0},
      {x: 32, y: 0},
      {x: 64, y: 0},
      {x: 92, y: 0},
      {x: 0, y: 32},
      {x: 32, y: 32},
      {x: 64, y: 32},
      {x: 92, y: 32},
      {x: 0, y: 64},
      {x: 32, y: 64}
    ];

    this.anims = {
      "walk": [1,2,3,4,5,6,7,8,9],
      "idle": [0]
    };

    this.currentAnim = "idle";
    this.frameSpeed = 20 / 1000;
    this.currentFrame = { idx: 0, speed: this.frameSpeed };
  },

  update: function (delta) {
    this.currentFrame.speed -= delta;
    var anim = this.anims[this.currentAnim];
    if (this.currentFrame.speed <= 0) {
      this.currentFrame.speed = this.frameSpeed;
      this.currentFrame.idx++;
      if (this.currentFrame.idx >= anim.length) {
        this.currentFrame.idx = 0;
      }
      this.offset.x = this.frames[anim[this.currentFrame.idx]].x;
      this.offset.y = this.frames[anim[this.currentFrame.idx]].y;
    }

    if (input.isPressed(input.KEY.RIGHT)) {
      this.pos.x += this.vel.x * delta;
      if (this.currentAnim !== "walk") {
        this.currentFrame.idx = 0;
        this.currentAnim = "walk";
      }
    }
    else {
      if (this.currentAnim !== "idle") {
        this.currentFrame.idx = 0;
        this.currentAnim = "idle";
      }
    }
  }
});