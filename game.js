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
    WebGLRenderer.addChild(this.sprite);
    WebGLRenderer.draw();
  }
}