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


/// <reference path="./_decorators.ts" />
/// <reference path="core/core.ts" />
/// <reference path="core/input.ts" />
/// <reference path="resources/resourceMap.ts" />
/// <reference path="extras/timer.ts" />
/// <reference path="../typings/vanilla-toasts/vanilla-toasts.d.ts" />

import Decorators from "./_decorators";
import Core from "./core/core";
import Input from "./core/input";
import ResourceMap from "./resources/resourceMap";
import Timer from "./extras/timer";

"use strict";

/*
TODO
interface IApp {
    title?: string;
    webglVersion?: number;    // TODO: Unused
    loadAssets: () => void;
    initialize: (app_: App) => void;
    update: (app_: App, dt: number) => void;
    draw: (app_: App, dt?: number) => void;
    cameraUpdate: () => void;
    textCB: (gui: dat.GUI) => void;
}*/

@Decorators.sealed
class App {

    protected stats: Stats;
    protected gui: dat.GUI;

    protected cameraUpdateCb;
    constructor(init: any/*IApp*/, text: any) {
        if (!init.webglVersion) {
            init.webglVersion = 2;
        }
        this._appFunctions = init;
        console.log(this._appFunctions);

        document.title = init.title || `WebGL${init.webglVersion} app`;

        this.__init__(text);
    };

    public webglVersion(): number {
        return this._appFunctions.webglVersion;
    }

    private __init__(text) {
        Core.getInstance().initialize([1.0, 0.0, 1.0, 1.0]);

        this.gui = new dat.GUI();

        this._appFunctions.textCB(this.gui);

        let self = this;
        this.gui.add(text, "resume", true).onChange(function(v) {
            if (v === true) {
               self.resume();
            } else {
                self.pause();
            }
        });

        this.stats = new Stats();
        this.stats.setMode(0);
        document.body.appendChild(this.stats.domElement);

        this._appFunctions.loadAssets();
    }

    public start() {
        let self = this;
        ResourceMap.setLoadCompleteCallback(function() {
            console.log("ALL RESOURCES LOADED!!!!");

            self._appFunctions.initialize(self);

            // Remove loader css3 window
            document.getElementById("spinner").remove();

            /*Core.getInstance().canvas().addEventListener("dblclick", function(){
                var el: any = Core.getInstance().canvas();

                if (el.webkitRequestFullScreen) {
                    el.webkitRequestFullScreen();
                }
                else {
                    el.mozRequestFullScreen();
                }
            });*/

            try {
                (function __render__(dt?: number) {
                    requestAnimationFrame(__render__);
                    // console.log(dt);
                    Input.getInstance().update();

                    self.stats.begin();
                    dt *= 0.001; // convert to seconds

                    Timer.update();

                    // self.__resize__();

                    if (self._resume) {
                        self._appFunctions.update(self, dt);
                        self._appFunctions.draw(self, dt);    // Draw user function
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
        console.log("PAUSE");
        this._resume = false;
    };
    public resume() {
        console.log("RESUME");
        this._resume = true;
    };

    protected _resume: boolean = true;

    protected __resize__() {
        let canvas: HTMLCanvasElement = Core.getInstance().canvas();
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
            Core.getInstance().changeViewport(0, 0, canvas.width, canvas.height);

            this.cameraUpdateCb();
        }
    }

    protected _appFunctions: any; //IApp;
};

export default App;
