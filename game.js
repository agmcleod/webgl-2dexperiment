var Game = {
  init: function () {
    me.loader.onload = this.startGame.bind(this);
    me.loader.preload([{
      type: "image", name: "player", src: "data/player.png"
    }]);
  },

  startGame: function () {
    WebGLRenderer.init();
    this.sprite = new Sprite(0, 0, 32, 32, me.loader.getImage('player'));
    this.rect = new Rect(100, 100, 50, 50);
    WebGLRenderer.addChild(this.sprite);
    WebGLRenderer.addChild(this.rect);
    WebGLRenderer.draw();
  }
}