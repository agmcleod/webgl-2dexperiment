var WebGLRenderer = {
  init: function () {
    this.pMatrix = mat4.create();
    this.mvMatrix = mat4.create();
    this.initBuffers();
    this.initShaders();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    this.mvMatrixStack = [];
    this.objects = [];
    
    this.draw();
  },

  addChild: function (object) {
    this.objects.push(object);
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
    
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].update(delta, this.mvMatrix);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.planePositionBuffer);
    gl.vertexAttribPointer(this.shader.shaderProgram.vertexPositionAttribute, this.planePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexColorBuffer);
    gl.vertexAttribPointer(this.shader.shaderProgram.vertexColorAttribute, this.planeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    this.setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.planePositionBuffer.numItems);


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
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.planePositionBuffer.itemSize = 3;
    this.planePositionBuffer.numItems = 4;

    this.planeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexColorBuffer);
    var colors = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 0.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.planeVertexColorBuffer.itemSize = 4;
    this.planeVertexColorBuffer.numItems = 4;
  },

  initShaders: function () {
    this.shader = new Shader("shader");
    var shaderProgram = this.shader.shaderProgram;
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
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