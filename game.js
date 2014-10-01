var Game = {
  init: function () {
    me.loader.onload = this.startGame.bind(this);
    me.loader.preload([{
      type: "image", name: "player", src: "data/player.png"
    }]);
    input.init();
    input.bindEventForKey(input.KEY.LEFT);
    input.bindEventForKey(input.KEY.RIGHT);
  },

  startGame: function () {
    WebGLRenderer.init();
    this.sprite = new Sprite(0, 0, 32, 32, me.loader.getImage('player'));
    WebGLRenderer.addChild(this.sprite);
    WebGLRenderer.addChild(new Rect(100, 100, 50, 50, { r: 0.0, g: 1.0, b: 0.0 }));
    WebGLRenderer.addChild(new Rect(150, 300, 80, 80, { r: 1.0, g: 0.0, b: 0.0 }));
    WebGLRenderer.draw();
  }
}