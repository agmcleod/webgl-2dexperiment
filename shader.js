var Shader = (function () {
  function getShaderFromId(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      throw "shader dom element not found";
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
          str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      throw "shader dom element did not have a correct type";
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(shader);
      return null;
    }

    return shader;
  }

  var api = function (id) {
    var shaderProgram = gl.createProgram();
    this.linkShaderProgram(id, shaderProgram);

    gl.useProgram(shaderProgram);
    
    this.setShaderAttributes(shaderProgram);

    this.setMatrixUniforms(shaderProgram);
    this.shaderProgram = shaderProgram;
  }

  api.prototype.linkShaderProgram = function (id, shaderProgram) {
    var fragmentShader = getShaderFromId(id + "-fs");
    var vertexShader = getShaderFromId(id + "-vs");
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw "Could not initialize shaders";
    }
  }

  api.prototype.setMatrixUniforms = function (shaderProgram) {
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  }

  api.prototype.setShaderAttributes = function(shaderProgram) {
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  };

  return api;
})();