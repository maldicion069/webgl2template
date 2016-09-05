// TODO!!!

import { Core } from "../core/Core";
import { Program } from "../core/Program";
import { ProgramCte } from "../constants/ProgramCte";
import { ProgramManager } from "../resources/ProgramManager";
import { Drawable } from "../models/Drawable";


/*
gl.drawArrays(...)
var vertices = new Float32Array([
    0.0, 0.0, 0.0,
    dim, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, dim, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, dim
]);

var colors = new Float32Array([
    1.0, 0.0, 0.0,
    1.0, 0.6, 0.0,
    0.0, 1.0, 0.0,
    0.6, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.6, 1.0
]);

 */

class Axis extends Drawable {
    public indices = [0, 1, 2, 3, 4, 5];
    public colors = [
        1, 1, 0, 1,
        1, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        0, 0, 1, 1
    ];
    constructor(dim: number = 10) {
        super();

        if (dim < 1) {
            throw new Error("Dim > 1 pls");
        }
        const vertices = this._createVertices(dim);

        this._handle = [];
        this._vao.bind();

        this.addElementArray(new Uint16Array(this.indices));

        this.addBufferArray(0, new Float32Array(vertices), 3);

        this._indicesLen = this.indices.length;

        ProgramManager.addWithFun("axisShader", () : Program => {
            let prog: Program = new Program();

            prog.addShader(`#version 300 es
                precision highp float;

                layout(location = 0) in vec3 position;
                layout(location = 1) in vec3 color;

                uniform mat4 projection;
                uniform mat4 view;
                uniform mat4 model;

                void main() {
                    gl_Position = projection * view * model * vec4(position, 1.0);
                    ourColor = color;
                }
            `, ProgramCte.shader_type.vertex, ProgramCte.mode.read_text);

            prog.addShader(`#version 300 es
                precision highp float;

                in vec3 ourColor;
                out vec4 fragColor;

                void main() {
                    fragColor = vec4(ourColor, 1.0);
                }
            `, ProgramCte.shader_type.fragment, ProgramCte.mode.read_text);

            prog.compile();

            prog.addUniforms(["projection", "view", "model"]);

            return prog;
        });
    };
    // TODO: Usar otro tipo de shader y enviar el color de las líneas de los ejes ...
    private _createVertices(dim: number): Array<number> {
        /* tslint:disable */
        return [
            -dim,    0.0,  0.0,
             dim,    0.0,  0.0,
             0.0, -dim/2,  0.0,
             0.0,  dim/2,  0.0,
             0.0,    0.0, -dim,
             0.0,    0.0,  dim
        ];
        /* tslint:enable */
    };
    public render() {
        const gl = Core.getInstance().getGL();
        this._vao.bind();
        gl.drawElements(gl.LINES, this._indicesLen, gl.UNSIGNED_SHORT, 0);
        this._vao.unbind();
    };
};

export { Axis };
