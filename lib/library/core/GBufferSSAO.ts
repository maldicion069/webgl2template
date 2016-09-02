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


/// <reference path="Core.ts" />
/// <reference path="../maths/Vector2.ts" />
/// <reference path="../textures/SimpleTexture2D.ts" />
/// <reference path="../textures/Texture2D.ts" />
/// <reference path="../textures/RenderBufferTexture.ts" />

import { Core } from "./Core";
import { Vect2 } from "../maths/Vect2";
import { Vect3 } from "../maths/Vect3";
import { SimpleTexture2D } from "../textures/SimpleTexture2D";
import { RenderBufferTexture } from "../textures/RenderBufferTexture";

"use strict";

enum GBufferSSAOType {
    position,
    normal,
    diffuse,
    num_textures
};

// TODO: Find a good random uniform number generator

class GBufferSSAO {
    protected _fbo: WebGLFramebuffer;

    protected kernelSize: number;
    protected ssaoKernel: Array<Vect3> = [];
    protected ssaoNoise: Array<number> = [];

    protected _depthTexture; RenderBufferTexture;
    protected _textures: Array<SimpleTexture2D> = new Array(GBufferSSAOType.num_textures);
    constructor(size: Vect2) {
        const gl = Core.getInstance().getGL();

        this._textures = new Array(3);

        this._fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);

        const _width = size.x;
        const _height = size.y;

        // Position color buffer
        (this._textures[GBufferSSAOType.position] = new SimpleTexture2D(size, {
            internalFormat: (gl).RGBA,
            format: gl.RGBA,
            type: gl.FLOAT,
            minFilter: gl.NEAREST,
            magFilter: gl.NEAREST,
            wrapS: gl.CLAMP_TO_EDGE,
            wrapT: gl.CLAMP_TO_EDGE
        })).unbind();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, this._textures[GBufferSSAOType.position].handle(), 0);

        // Normal color buffer
        (this._textures[GBufferSSAOType.normal] = new SimpleTexture2D(size, {
            internalFormat: gl.RGB,
            format: gl.RGB,
            type: gl.FLOAT,
            minFilter: gl.NEAREST,
            magFilter: gl.NEAREST
        })).unbind();
        this._textures[GBufferSSAOType.normal].unbind();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1,
            gl.TEXTURE_2D, this._textures[GBufferSSAOType.normal].handle(), 0);

        // Color + Specular color buffer
        (this._textures[GBufferSSAOType.diffuse] = new SimpleTexture2D(size, {
            internalFormat: gl.RGBA,
            format: gl.RGBA,
            type: gl.FLOAT,
            minFilter: gl.NEAREST,
            magFilter: gl.NEAREST
        })).unbind();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2,
            gl.TEXTURE_2D, this._textures[GBufferSSAOType.diffuse].handle(), 0);

        // create a renderbuffer object to store depth info

        this._depthTexture = new RenderBufferTexture(
            size,
            gl.DEPTH_COMPONENT16,
            gl.DEPTH_ATTACHMENT
        );

        gl.drawBuffers([
            gl.COLOR_ATTACHMENT0,
            gl.COLOR_ATTACHMENT1,
            gl.COLOR_ATTACHMENT2
        ]);
        let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            // console.log(`Framebuffer error. Status: ${status}`);
            switch (status) {
                case gl.FRAMEBUFFER_UNSUPPORTED:
                    throw new Error("Framebuffer: Framebuffer unsupported");
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    throw new Error("Framebuffer: Framebuffer incomplete attachment");
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    throw new Error("Framebuffer: Framebuffer incomplete dimensions");
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    throw new Error("Framebuffer: Framebuffer incomplete missing attachment");
                default:
                    throw new Error("Framebuffer: Framebuffer failed for unspecified reason");
            }
            // throw new Error("GBuffer error");
        }
        console.log("done");

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);


        function _lerp(a: number, b: number, f: number): number {
            return a + f * (b - a);
        }

        this.kernelSize = 128;

        function randomFloats(min, max) {
            return Math.random() * (max - min) + min;
        }

        for (let i = 0; i < this.kernelSize; ++i) {
            let sample = new Vect3(
                randomFloats(0.0, 1.0) * 2.0 - 1.0,
                randomFloats(0.0, 1.0) * 2.0 - 1.0,
                randomFloats(0.0, 1.0)
            ).normalize();
            sample[0] *= randomFloats(0.0, 1.0);
            sample[1] *= randomFloats(0.0, 1.0);
            sample[2] *= randomFloats(0.0, 1.0);

            // Scale samples s.t. they're more aligned to center of kernel
            let scale = (i * 1.0) / (this.kernelSize * 1.0);
            sample[0] *= scale;
            sample[1] *= scale;
            sample[2] *= scale;

            this.ssaoKernel.push(sample);
        }

        // Noise texture
        for (let i = 0; i < 16; ++i) {
            // rotate around z-axis (in tangent space)
            let noise = new Vect3(
                randomFloats(0.0, 1.0) * 2.0 - 1.0,
                randomFloats(0.0, 1.0) * 2.0 - 1.0,
                0.0
            );
            this.ssaoNoise.push(noise[0]);
            this.ssaoNoise.push(noise[1]);
            this.ssaoNoise.push(noise[2]);
        }
        // let noiseTexture = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
        // gl.texImage2D(gl.TEXTURE_2D, 0, /*gl.RGB16F*/ /*gl.RGBA,
        //     4, 4, 0, gl.RGB, gl.FLOAT, new Float32Array(this.ssaoNoise));
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        //     gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
        //     gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
        //     gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
        //     gl.REPEAT);

    }

    public bindForReading() {
        const gl = Core.getInstance().getGL();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this._textures.forEach((tex: SimpleTexture2D, idx: number) => {
            tex.bind(idx);
        });
    }

    public bindForWriting() {
        const gl = Core.getInstance().getGL();

        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
    }

    public bindForSSAO() {
        // TODO
    }
    public sendSamplesSSAOTexture(progName: string) {
        // TODO
    }

    public destroy() {
        const gl = Core.getInstance().getGL();
        if (this._fbo) {
            gl.deleteFramebuffer(this._fbo);
        }
        if (this._textures) {
            this._textures.forEach((tex: SimpleTexture2D) => {
                tex.destroy();
            });
        }
        if (this._depthTexture) {
            this._depthTexture.destroy();
        }
    }
};

export { GBufferSSAO };