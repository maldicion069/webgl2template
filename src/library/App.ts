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

"use strict";
/// <reference path="../typings/dat-gui.d.ts" />
/// <reference path="../typings/stats.d.ts" />
/// <reference path="../typings/vanilla-toasts/vanilla-toasts.d.ts" />

namespace MB {
    @Decorators.sealed
    export abstract class App {

        protected _stats: Stats;
        protected _gui: dat.GUI;
        protected _webglVersion: number;
        protected _state: GlobalState;

        protected text: any;
        protected _context: GLContext;
        public get context(): GLContext {
            return this._context;
        };
        constructor(title: string = null, context: GLContext, text: Object = {}) {
            console.info("init app");
            this._context = context;
            this._state = new GlobalState(context);

            this._webglVersion = context.version;
            this.text = text;

            document.title = title || `WebGL${this._webglVersion} app`;

            this.__init__(text);
        };
        public get state(): GlobalState {
            return this._state;
        }

        public webglVersion(): number {
            return this._webglVersion;
        }
        public loadAssets()  {
            // Empty methods. Override if necessary
        }
        public cameraUpdate() {
            // Empty methods. Override if necessary
        }
        public textCB(g: dat.GUI) {
            // Empty methods. Override if necessary
        }

        abstract initialize();
        abstract update(dt: number);
        abstract draw();

        public clearColorAndDepth() {
            this._state.clearBuffers();
        };
        private __init__(text) {
            let bgColor = Color4.fromColor3(Color3.Black);
            Input.initialize();

            this._state.depth.setStatus(true);
            this._state.depth.setFunc(ctes.ComparisonFunc.Less);

            this._state.culling.setStatus(true);
            this._state.blending.setStatus(false);
            this._state.color.setClearColor(bgColor);

            this._gui = new dat.GUI();
            text["resume"] = true;

            this.textCB(this._gui);

            let self = this;
            this._gui.add(text, "resume", true).onChange(function(v) {
                if (v === true) {
                   self.resume();
                } else {
                    self.pause();
                }
            });

            this._stats = new Stats();
            this._stats.setMode(0);
            this._stats.domElement.style.top = "24px";

            let statDOM = document.getElementById("stats") || document.body;
            statDOM.appendChild(this._stats.domElement);

            this.loadAssets();
        }

        get stats(): Stats {
            return this._stats;
        }

        public start() {
            let self: App = this;
            MB.ResourceMap.setLoadCompleteCallback(function() {
                console.info("ALL RESOURCES LOADED!!!!");

                self.initialize();

                // Remove loader css3 window
                let spinner = document.getElementById("spinner");
                if (spinner) spinner.remove();

                // MB.Core.getInstance().canvas().addEventListener("dblclick", function(){
                //     var el: any = MB.Core.getInstance().canvas();
                //     if (el.webkitRequestFullScreen) {
                //         el.webkitRequestFullScreen();
                //     }
                //     else {
                //         el.mozRequestFullScreen();
                //     }
                // });

                try {
                    (function __render__(dt?: number) {
                        requestAnimationFrame(__render__);
                        // console.debug(dt);
                        MB.Input.update();

                        self.stats.begin();
                        dt *= 0.001; // convert to seconds

                        MB.Timer.update();

                        if (self._resume) {
                            self.update(MB.Timer.deltaTime() * 0.1);
                            self.draw();    // Draw user function
                        }

                        self.stats.end();
                    })(0.0);
                } catch (e) {
                    VanillaToasts.create({
                        title: "Error:",
                        text: `${e}`,
                        type: "error"
                    });
                    throw e;
                }
            });
            return this;
        };

        public pause() {
            console.debug("PAUSE");
            this._resume = false;
        };
        public resume() {
            console.debug("RESUME");
            this._resume = true;
        };
        get canvas(): HTMLCanvasElement {
            return this.context.canvas;
        };
        protected _resume: boolean = true;
        protected __resize__() {
            let canvas: HTMLCanvasElement = this.canvas;
            let realToCSSPixels = window.devicePixelRatio || 1;

            // Lookup the size the browser is displaying the canvas in CSS pixels
            // and compute a size needed to make our drawingbuffer match it in
            // device pixels.
            let displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
            let displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

            // Check if the canvas is not the same size.
            if (canvas.width  !== displayWidth ||
                canvas.height !== displayHeight) {

                // Make the canvas the same size
                canvas.width  = displayWidth;
                canvas.height = displayHeight;

                // Set the viewport to match
                this.state.setViewport(new Vector4<number>(0, 0, canvas.width, canvas.height));

                this.cameraUpdate();
            }
        }
    };
};
