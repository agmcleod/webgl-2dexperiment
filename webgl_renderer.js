var WebGLRenderer = {
  init: function () {
    this.initShaders();
    this.bindBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.mvMatrix = mat3.create();
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

    this.white1PixelTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.white1PixelTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255]));
  },

  bindBuffers: function () {
    this.planePositionBuffer = gl.createBuffer();
    this.textureBuffer = gl.createBuffer();
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
    
    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var shaderProgram = this.shader.shaderProgram;

    var matrixLocation = gl.getUniformLocation(shaderProgram, "uMatrix");
    
    // TODO: this loop should collect vertices from objects, and do a single drawArrays call instead.
    // first i need to figure out how best to get the textures together.
    for (var i = 0; i < this.objects.length; i++) {
      mat3.identity(this.mvMatrix);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.planePositionBuffer);
      var object = this.objects[i];

      var x1 = object.pos.x;
      var y1 = object.pos.y;
      var x2 = object.pos.x + object.width;
      var y2 = object.pos.y + object.height;

      var vertices = [
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
      
      var textureCoords;
      if (object.image) {
        var dw = (object.width / object.image.image.width);
        var dh = 1.0 - (object.height / object.image.image.height);
        textureCoords = [
          0.0, 1.0,
          dw, 1.0,
          0.0, dh,
          0.0, dh,
          dw, 1.0,
          dw, dh
        ];

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.objects[i].image);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
      }
      else {
        gl.bindTexture(gl.TEXTURE_2D, this.white1PixelTexture);
      }
      

      mat3.multiply(this.mvMatrix, this.mvMatrix, [
        2 / gl.canvas.clientWidth, 0, 0,
        0, -2 / gl.canvas.clientHeight, 0,
        -1, 1, 1
      ]);

      gl.uniformMatrix3fv(matrixLocation, false, this.mvMatrix);

      gl.uniform1i(shaderProgram.samplerUniform, 0);

      var colorLocation = gl.getUniformLocation(shaderProgram, "uColor");
      if (object.color) {
        var color = object.color;
        gl.uniform4f(colorLocation, color.r, color.g, color.b, 1);
      }
      else {
        gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1);
      }

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