var Game = {
  init: function () {
    me.loader.onload = this.startGame.bind(this);
    me.loader.preload([{
      type: "image", name: "mobileplayer", src: "data/mobileplayer.png"
    }]);
  },

  startGame: function () {
    WebGLRenderer.init();
    this.sprite = new Sprite();
    WebGLRenderer.addChild(this.sprite);
    WebGLRenderer.draw();
  }
}