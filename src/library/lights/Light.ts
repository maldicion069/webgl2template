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

namespace MB {
    /**
     * Light abstract class
     * @class Light
     */
    export abstract class Light {
        /**
         * Light source intensity [0, 1]
         * @type {number}
         */
        protected _intensity: number;
        /**
         * Light diffuse color.
         * @type {MB.Color3}
         */
        protected _color: MB.Color3;
        /**
         * Light specular color.
         * @type {MB.Color3}
         */
        protected _specColor: MB.Color3;
        protected _enable: boolean;
        /**
         * Attenuations light constants
         * @type {MB.Vect3}
         */
        protected _attenuation: MB.Vect3;
        /**
         * Light constructor
         */
        constructor() {
            this._intensity = 1.0;
            this._color = new MB.Color3(1.0, 1.0, 1.0);
            this._specColor = new MB.Color3(1.0, 1.0, 1.0);
            this._enable = true;
            this._attenuation = new MB.Vect3(
                1.0,        // Constant
                0.014,      // Linear
                0.0007      // Quadratic
           );
        }

        /**
         * Set constant attenuation value.
         * @param {number} v: Constant attenuation value.
         */
        public setConstantAtt(value: number) {
            this._attenuation.x = value;
        }
        /**
         * Set linear attenuation value.
         * @param {number} v Linear attenuation value.
         */
        public setLinearAtt(value: number) {
            this._attenuation.y = value;
        }
        /**
         * Set quadratic attenuation value.
         * @param {number} v Quadratic attenuation value.
         */
        public setQuadraticAtt(value: number) {
            this._attenuation.z = value;
        }
        /**
         * Return light attenuation value.
         * @return {MB.Vect3}
         */
        get attenuation(): MB.Vect3 { return this._attenuation; }

        /**
         * Get light intensity.
         * @return {number}
         */
        get intensity(): number { return this._intensity; }
        /**
         * Set light intensity.
         * @param {number} intensity Light intensity.
         */
        set intensity(intensity: number) { this._intensity = intensity; }

        /**
         * Return light diffuse color.
         * @return {MB.Color3}
         */
        get color(): MB.Color3 { return this._color; }
        /**
         * Set light diffuse color
         * @param {MB.Color3} color Color value
         */
        set color(color: MB.Color3) { this._color = color; }
        /**
         * Return light specular color.
         * @return {MB.Color3}
         */
        get specularColor(): MB.Color3 { return this._specColor; }
        /**
         * Set light specular color
         * @param {MB.Color3} color Color value
         */
        set specularColor(color: MB.Color3) { this._specColor = color; }
    };
};

// (Shaders)
//     - Directional Lights:
//         * vec3 direction
//         * vec3 color
//     - Spot Light:
//         * vec3 position
//         * vec3 direction
//         * vec3 color
//         * float cutoff
//     - Point Light:
//         * vec3 position
//         * vec3 color
//     - Hemisphere Light
//         * vec3 direction
//         * vec3 skyColor
//         * vec3 groundColor
//
//
//  Spotlight and directional can produce shadows:
//      * bool shadow = false
//      * float shadowBias = 0
//      * float shadowRadius = 1
//      * vec2 shadowMapSize (512, 512)
