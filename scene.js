var Scene = {
  init: function () {
    this.pMatrix = mat4.create();
    this.mvMatrix = mat4.create();
    this.initBuffers();
    this.initShaders();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    this.direction = 1;
    this.y = 0;
    this.draw();
  },

  draw: function () {
    requestAnimationFrame(this.draw.bind(this));
    var delta = this.getDeltaTime();
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(this.mvMatrix);
    mat4.identity(this.pMatrix);
    
    if (this.direction > 0) {
      this.y += 0.05 * delta;
      if (this.y > 1) {
        this.direction = -1;
      }
    }
    else {
      this.y -= 0.05 * delta;
      if (this.y < -1) {
        this.direction = 1;
      }
    }

    mat4.perspective(this.pMatrix, 45 * Math.PI / 180, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.translate(this.pMatrix, this.pMatrix, [0.0, 0.0, -50.0]);
    mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, this.y, 0.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.planePositionBuffer);
    gl.vertexAttribPointer(this.shader.shaderProgram.vertexPositionAttribute, this.planePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexColorBuffer);
    gl.vertexAttribPointer(this.shader.shaderProgram.vertexColorAttribute, this.planeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    this.setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.planePositionBuffer.numItems);
  },

  getDeltaTime: function () {
    var delta;
    if (this.time) {
      var t = this.time;
      this.time = Date.now();
      delta = this.time - t;
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

  setMatrixUniforms: function () {
    gl.uniformMatrix4fv(this.shader.shaderProgram.pMatrixUniform, false, this.pMatrix);
    gl.uniformMatrix4fv(this.shader.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
  }
  
};