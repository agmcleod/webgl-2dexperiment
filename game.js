var Game = {
  init: function () {
    WebGLRenderer.init();
    this.sprite = new Sprite();
    WebGLRenderer.addChild(this.sprite);
    WebGLRenderer.draw();
  }
}