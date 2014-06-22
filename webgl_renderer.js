var WebGLRenderer = {
  init: function () {
    this.pMatrix = mat4.create();
    this.mvMatrix = mat4.create();
    this.initBuffers();
    this.initShaders();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.mvMatrixStack = [];
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

    mat4.identity(this.mvMatrix);
    mat4.identity(this.pMatrix);
    
    mat4.perspective(this.pMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
    mat4.translate(this.pMatrix, this.pMatrix, [0.0, 0.0, -50.0]);

    var shaderProgram = this.shader.shaderProgram;
    
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].update(delta, this.mvMatrix);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.planePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.planePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    for (var i = 0; i < this.objects.length; i++) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.objects[i].image);
      gl.uniform1i(shaderProgram.samplerUniform, 0);
      this.setMatrixUniforms();
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.planePositionBuffer.numItems);
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

  initBuffers: function () {
    this.planePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.planePositionBuffer);

    var vertices = [
      1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      -1.0, -1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.planePositionBuffer.itemSize = 2;
    this.planePositionBuffer.numItems = 4;

    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    var textureCoords = [
      1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      0.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.textureBuffer.itemSize = 2;
    this.textureBuffer.numItems = 4;
  },

  initShaders: function () {
    this.shader = new Shader("shader");
    var shaderProgram = this.shader.shaderProgram;
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
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
  },

  setMatrixUniforms: function () {
    gl.uniformMatrix4fv(this.shader.shaderProgram.pMatrixUniform, false, this.pMatrix);
    gl.uniformMatrix4fv(this.shader.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
  }
  
};