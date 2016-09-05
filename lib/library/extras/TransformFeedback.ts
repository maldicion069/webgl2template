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


import { Core } from "../core/Core";
import { Program } from "../core/Program";
import { TransfFeedCte } from "../constants/TransfFeedCte";

"use strict";

class TransformFeedback {
    protected _handle: WebGLTransformFeedback;
    constructor() {
        const gl = Core.getInstance().getGL();
        this._handle = gl.createTransformFeedback();
    };
    public destroy() {
        const gl = Core.getInstance().getGL();
        gl.deleteTransformFeedback(this._handle);
    };
    public bind() {
        const gl = Core.getInstance().getGL();
        gl.bindTransformFeedback(TransfFeedCte.Normal, this._handle);
    };
    public unbind() {
        const gl = Core.getInstance().getGL();
        gl.bindTransformFeedback(TransfFeedCte.Normal, null);
    };
    public begin(primitiveMode: number) {
        const gl = Core.getInstance().getGL();
        gl.beginTransformFeedback(primitiveMode);
    };
    public pause() {
        const gl = Core.getInstance().getGL();
        gl.pauseTransformFeedback();
    };
    public resume() {
        const gl = Core.getInstance().getGL();
        gl.resumeTransformFeedback();
    };
    public end() {
        const gl = Core.getInstance().getGL();
        gl.endTransformFeedback();
    };
    public varyings(Program: Program, varyings: Array<string>, bufferMode: number) {
        const gl = Core.getInstance().getGL();
        return gl.transformFeedbackVaryings(Program.id(), varyings, bufferMode);
    };
    public getVarying(Program: Program, idx: number) {
        const gl = Core.getInstance().getGL();
        return gl.getTransformFeedbackVarying(Program.id(), idx);
    };
    public isValid(): boolean {
        const gl = Core.getInstance().getGL();
        return gl.isTransformFeedback(this._handle);
    };
}

export default TransformFeedback;
