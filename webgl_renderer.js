var WebGLRenderer = {
  init: function () {
    this.initShaders();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.mvMatrixStack = [];
    this.mvMatrix = mat3.create();
    console.log(this.mvMatrix);
    this.objects = [];
    this.bindAllTextures();    
    this.draw();
  },

  addChild: function (object) {
    this.objects.push(object);
  },

  bindAllTextures: function () {
    var list = me.loader.getImageList();
    for (var i in list) {
      if (list.hasOwnProperty(i)) {
        var image = list[i];
        this.bindTexture(image);
      }
    };
  },

  bindTexture: function (texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
  },

  draw: function () {
    this.resize();
    var delta = this.getDeltaTime();
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var shaderProgram = this.shader.shaderProgram;
    
    // TODO: this loop should collect vertices from objects, and do a single drawArrays call instead.
    // first i need to figure out how best to get the textures together.
    for (var i = 0; i < this.objects.length; i++) {
      var planePositionBuffer = gl.createBuffer();
      mat3.identity(this.mvMatrix);
      gl.bindBuffer(gl.ARRAY_BUFFER, planePositionBuffer);
      var object = this.objects[i];

      var x = object.pos.x;
      var y = object.pos.y;
      var lx = object.pos.x + object.width;
      var by = object.pos.y + object.height;

      var vertices = [
        object.pos.x, object.pos.y,
        lx, y,
        x, by,
        x, by,
        lx, y,
        lx, by
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

      var textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      var textureCoords = [
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
      gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.objects[i].image);
      gl.uniform1i(shaderProgram.samplerUniform, 0);
      var matrixLocation = gl.getUniformLocation(shaderProgram, "uMatrix");
      gl.uniformMatrix3fv(matrixLocation, false, this.mvMatrix);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
    }
    
    requestAnimationFrame(this.draw.bind(this));
  },

  getDeltaTime: function () {
    var delta;
    if (this.time) {
      var t = this.time;
      this.time = Date.now();
      delta = (this.time - t) / 1000;
    }
    else {
      delta = 0;
      this.time = Date.now();
    }
    return delta;
  },

  initShaders: function () {
    this.shader = new Shader("shader");
    var shaderProgram = this.shader.shaderProgram;
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  },

  mvPopMatrix: function () {
    if (this.mvMatrixStack.length === 0) {
      throw "Invalid popMatrix!";
    }
    this.mvMatrix = mvMatrixStack.pop();
  },

  mvPushMatrix: function () {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
  },

  resize: function () {
    var width = gl.canvas.clientWidth;
    var height = gl.canvas.clientHeight;
    if (gl.canvas.width != width ||
      gl.canvas.height != height) {
      gl.canvas.width = width;
      gl.canvas.height = height;
    }
  }
  
};