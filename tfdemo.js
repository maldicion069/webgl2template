/// <reference path="./src/typings/dat-gui.d.ts" />
/// <reference path="./src/typings/gl-matrix.d.ts" />
/// <reference path="./src/typings/log4javascript.d.ts" />
/// <reference path="./src/typings/stats.d.ts" />
/// <reference path="./src/typings/webgl2.d.ts" />
/// <reference path="./dist/monkeybrush.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleConfig = function () {
    return {
        resume: true
    };
};
var MyScene = (function (_super) {
    __extends(MyScene, _super);
    function MyScene() {
        _super.call(this, SimpleConfig(), "EY", 2);
        this.drawTick = true;
        this.mainShader = "prog";
        this.angle = 0;
    }
    MyScene.prototype.loadAssets = function () { };
    ;
    MyScene.prototype.initialize = function () {
        var _this = this;
        MB.ProgramManager.addWithFun("prog", function () {
            var prog = new MB.Program();
            prog.addShader("#version 300 es\n            precision highp float;\n            layout(location = 0) in vec3 vertPosition;\n            out vec2 uv;\n            uniform mat4 viewProj;\n            void main(void) {\n                uv = vec2(vertPosition.xy * 0.5) + vec2(0.5);\n                vec3 pos = vertPosition;\n                pos *= 50.0;\n                gl_Position = viewProj * vec4(pos, 1.0);\n            }", MB.ctes.ShaderType.vertex, MB.ctes.ReadMode.read_text);
            prog.addShader("#version 300 es\n            precision highp float;\n            precision highp sampler2DArray;\n\n            out vec4 fragColor;\n            in vec2 uv;\n\n            uniform sampler2DArray tex;\n\n            void main() {\n                if (uv.x < 0.5) {\n                    if (uv.y < 0.5) {\n                        fragColor = texture(tex, vec3(uv, 0.0));\n                    } else {\n                        fragColor = texture(tex, vec3(uv, 2.0));\n                    }\n                } else {\n                    if (uv.y > 0.5) {\n                        fragColor = texture(tex, vec3(uv, 1.0));\n                    } else {\n                        fragColor = texture(tex, vec3(uv, 3.0));\n                    }\n                }\n            }", MB.ctes.ShaderType.fragment, MB.ctes.ReadMode.read_text);
            prog._compile();
            prog._link();
            prog.use();
            prog.addUniforms(["viewProj", "tex"]);
            return prog;
        });
        var texSize = 1024;
        var gl = MB.Core.getInstance().getGL();
        var bb1 = new Uint8Array(texSize * texSize * 3);
        var checkSize = 5;
        var n = 0;
        // Generate some checker board pattern
        for (var y = 0; y < texSize; ++y) {
            for (var x = 0; x < texSize; ++x) {
                if (((x / checkSize + y / checkSize) % 2) == 0) {
                    bb1[n++] = 255;
                    bb1[n++] = 255;
                    bb1[n++] = 255;
                }
                else {
                    bb1[n++] = 0;
                    bb1[n++] = 0;
                    bb1[n++] = 0;
                }
            }
        }
        var bb2 = new Uint8Array(texSize * texSize * 3);
        n = 0;
        // Generate some diagonal lines for the second layer
        for (var y = 0; y < texSize; y++) {
            for (var x = 0; x < texSize; x++) {
                if ((x + y) / 3 % 3 == 0) {
                    bb2[n++] = 255;
                    bb2[n++] = 255;
                    bb2[n++] = 255;
                }
                else {
                    bb2[n++] = 128;
                    bb2[n++] = 128;
                    bb2[n++] = 128;
                }
            }
        }
        var bb3 = new Uint8Array(texSize * texSize * 3);
        n = 0;
        // Generate some diagonal lines for the second layer
        for (var y = 0; y < texSize; y++) {
            for (var x = 0; x < texSize; x++) {
                if ((x + y) / 4 % 4 == 1) {
                    bb3[n++] = 128;
                    bb3[n++] = 128;
                    bb3[n++] = 128;
                }
                else {
                    bb3[n++] = 255;
                    bb3[n++] = 255;
                    bb3[n++] = 255;
                }
            }
        }
        var bb4 = new Uint8Array(texSize * texSize * 3);
        n = 0;
        // Generate some checker board pattern
        for (var y = 0; y < texSize; ++y) {
            for (var x = 0; x < texSize; ++x) {
                if (((x / checkSize + y / checkSize) % 2) == 1) {
                    bb4[n++] = 0;
                    bb4[n++] = 0;
                    bb4[n++] = 0;
                }
                else {
                    bb4[n++] = 255;
                    bb4[n++] = 255;
                    bb4[n++] = 255;
                }
            }
        }
        this.tex2 = new MB.Texture2DArray(new MB.Vector2(texSize, texSize), [
            bb1, bb2, bb3, bb4
        ], {
            autoMipMap: true,
            minFilter: gl.LINEAR,
            magFilter: gl.LINEAR,
            internalFormat: gl.RGB8,
            level: 0,
            format: gl.RGB,
            type: gl.UNSIGNED_BYTE
        });
    };
    ;
    MyScene.prototype.update = function (dt) {
        this.angle += MB.Timer.deltaTime() * 0.001;
        this.__resize__();
    };
    ;
    MyScene.prototype.draw = function (dt) {
        if (this.drawTick === false) {
            return;
        }
        MB.Core.getInstance().clearColorAndDepth();
        var prog = MB.ProgramManager.get(this.mainShader);
        prog.use();
        var gl = MB.Core.getInstance().getGL();
        var viewProj = mat4.create();
        var proj = mat4.create();
        var canvas = gl.canvas;
        mat4.perspective(proj, MB.Mathf.degToRad(60.0), canvas.width / canvas.height, 0.01, 100.0);
        var view = mat4.create();
        mat4.lookAt(view, new Float32Array([0.0, 1.0, 5.0]), new Float32Array([0.0, 0.0, 0.0]), new Float32Array([0.0, 1.0, 0.0]));
        mat4.mul(viewProj, proj, view);
        this.tex2.bind(0);
        prog.sendUniform1i("tex", 0);
        prog.sendUniformMat4("viewProj", viewProj);
        MB.PostProcess.render();
    };
    ;
    MyScene.prototype.cameraUpdate = function () {
    };
    ;
    MyScene.prototype.textCB = function (gui) {
    };
    ;
    return MyScene;
}(MB.Scene));
;
var myScene;
window.onload = function () {
    myScene = new MyScene();
    myScene.start();
};
