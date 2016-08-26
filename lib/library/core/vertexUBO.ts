/// Copyright (C) 2016 [MonkeyBrush.js]
///
/// Permission is hereby granted, free of charge, to any person obtaining a copy of this
/// software and associated documentation files (the "Software"), to deal in the Software
/// without restriction, including without limitation the rights to use, copy, modify,
/// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
/// permit persons to whom the Software is furnished to do so, subject to the following
/// conditions:
///
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
///
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
/// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
/// OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
/// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
/// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


/// <reference path="../core/core.ts" />
/// <reference path="../extras/extensions.ts" />

import Core from "../core/core";
import extensions from "../extras/extensions";

"use strict";

const gl = Core.getInstance().getGL();

declare var WebGL2RenderingContext: any;

class VertexUBO {

    protected _handle: WebGLBuffer;
    protected _index: number;
    // TODO: A futuro usar el program y no
    //         WebGLProgram (cachear ubo también en program ...)
    constructor(prog: WebGLProgram, name: string, blockBindIdx: number) {
       if (gl instanceof WebGL2RenderingContext) {
            this._handle = gl.createBuffer();
            const index = gl.getUniformBlockIndex(prog, name);
            if (index === 4294967295) {
                throw new Error("UBO undefined");
            }
            gl.uniformBlockBinding(prog, index, blockBindIdx);
            this._index = blockBindIdx;
        }
    };
    public bind() {
        if (gl instanceof WebGL2RenderingContext) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, this._handle);
            return;
        }
    };
    // TODO: USED??
    public bindBB() {
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this._index, this._handle);
    };
    public update(data: Float32Array) {
        if (gl instanceof WebGL2RenderingContext) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, this._handle);
            gl.bufferData(gl.UNIFORM_BUFFER, data, gl.STATIC_DRAW);
            gl.bindBuffer(gl.UNIFORM_BUFFER, null);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, this._index, this._handle);
        }
    };
    public unbind() {
        if (gl instanceof WebGL2RenderingContext) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, null);
            return;
        }
    };
    public destroy() {
        this.bind();
        if (gl instanceof WebGL2RenderingContext) {
            gl.deleteBuffer(this._handle);
            return;
        }
    };
    public static isSupported(): boolean {
        return gl instanceof WebGL2RenderingContext;
    };
};

export default VertexUBO;
