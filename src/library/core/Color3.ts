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
     * Color3 class
     * @class Color3
     */
    export class Color3 {
        public toVec3(): MB.Vect3 {
            return this._color;
        }
        /**
         * Internal array that identifies the color values
         */
        protected _color: MB.Vect3 = new MB.Vect3();
        /**
         * Color3 constructor
         * @param {number} r Red channel
         * @param {number} g Green channel
         * @param {number} b Blue channel
         */
        constructor(r: number, g: number, b: number) {
            this._color.x = Mathf.clamp01(r);
            this._color.y = Mathf.clamp01(g);
            this._color.z = Mathf.clamp01(b);
        };
        /**
         * Check if another color is equals than current color.
         * @param  {Color3}  c Another color
         * @return {boolean}
         */
        public isEquals(c: Color3): boolean {
            return this._color.exactEquals(c._color);
        };
        /**
         * [clone description]
         * @return {Color3} [description]
         */
        public clone(): Color3 {
            return new Color3(this.r, this.g, this.b);
        };
        /**
         * [copy description]
         * @param  {Color3} c [description]
         * @return {Color3}   [description]
         */
        public copy(c: Color3): Color3 {
            this.r = c.r;
            this.g = c.g;
            this.b = c.b;

            return this;
        };
        /**
         * Return red channel
         * @return {number}
         */
        get r(): number {
            return this._color.x;
        };
        /**
         * Return green channel
         * @return {number}
         */
        get g(): number {
            return this._color.y;
        };
        /**
         * Return blue channel
         * @return {number}
         */
        get b(): number {
            return this._color.z;
        };
        /**
         * Set red channel
         * @param {number} r New red channel value.
         */
        set r(r: number) {
            this._color.x = Mathf.clamp01(r);
        };
        /**
         * Set green channel
         * @param {number} g New green channel value.
         */
        set g(g: number) {
            this._color.y = Mathf.clamp01(g);
        };
        /**
         * Set blue channel
         * @param {number} b New blue channel value.
         */
        set b(b: number) {
            this._color.z = Mathf.clamp01(b);
        };
        /**
         * Create color for RGB value.
         * @param  {number} r Red channel value.
         * @param  {number} g Green channel value.
         * @param  {number} b Blue channel value.
         * @return {Color3}    New color
         */
        public setRGB(r: number, g: number, b: number): Color3 {
            this.r = Mathf.clamp01(r);
            this.g = Mathf.clamp01(g);
            this.b = Mathf.clamp01(b);

            return this;
        }
        /**
         * Lerp color between two colors using alpha value.
         * The parameter alpha is clamped to the range [0, 1].
         * @param  {Color3} minColor Minimum color.
         * @param  {Color3} maxColor Maximum color.
         * @param  {number} alpha    Alpha. Clamped to the range [0, 1].
         * @return {Color3}          New color generated.
         */
        public static lerp(minColor: Color3, maxColor: Color3, alpha: number): Color3 {
            const r = minColor.r + (maxColor.r - minColor.r) * alpha;
            const g = minColor.g + (maxColor.g - minColor.g) * alpha;
            const b = minColor.b + (maxColor.b - minColor.b) * alpha;

            return new Color3(r, g, b);
        };
        /**
         * Create new color using hexadecimal value.
         * @param  {number} hex Hexadecimal value.
         * @return {Color3}          New color generated.
         */
        static createFromHex(hex: number): Color3 {
            return new Color3(
                (hex >> 16 & 255) / 255,
                (hex >> 8 & 255) / 255,
                (hex & 255) / 255
           );
        };
        /**
         * Create random color
         * @return {Color3} New color generated.
         */
        static getRandomColor(): Color3 {
            const r: number = RandomGenerator.random();
            const g: number = RandomGenerator.random();
            const b: number = RandomGenerator.random();
            return new Color3(r, g, b);
        };
        /**
         * Convert current color from gamma to linear range.
         * @param  {number = 2.2} gammaFactor Gamma factor value
         * @return {Color3}          New color generated.
         */
        public gammaToLinear(gammaFactor: number = 2.2): Color3 {
            this.r = Math.pow(this.r, gammaFactor);
            this.g = Math.pow(this.g, gammaFactor);
            this.b = Math.pow(this.b, gammaFactor);

            return this;
        };
        /**
         * Convert current color from linear to gamma range.
         * @param  {number = 2.2}         gammaFactor Gamma factor value
         * @return {Color3}          New color generated.
         */
        public linearToGamma(gammaFactor: number = 2.2): Color3 {
            const invGamma: number = (gammaFactor > 0) ? (1.0 / gammaFactor) : 1.0;

            this.r = Math.pow(this.r, invGamma);
            this.g = Math.pow(this.g, invGamma);
            this.b = Math.pow(this.b, invGamma);

            return this;
        };
        /**
         * Return hexadecimal value from current color.
         * @return {number} Hexadecimal representation of current color.
         */
        public getHexadecimal(): number {
            return (this.r * 255) << 16
                 ^ (this.g * 255) << 8
                 ^ (this.b * 255) << 0;
        }
        /**
         * Convert current color to HSL representation.
         * @return {Color3} New color using HSL representation.
         */
        public toHSL(): Color3 {
            const max = Math.max(this.r, this.g, this.b),
                min = Math.min(this.r, this.g, this.b);

            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;  // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case this.r: h = (this.g - this.b) / d +
                        (this.g < this.b ? 6 : 0); break;
                    case this.g: h = (this.b - this.r) / d + 2; break;
                    case this.b: h = (this.r - this.g) / d + 4; break;
                }
                h /= 6;
            }
            return new Color3(h, s, l);
        };
        public toHSV(): Color3 {
            // let h = MB.Mathf.euclideanModulo(h, 1);
            // let s = MB.Mathf.clamp01(s);
            // let v = MB.Mathf.clamp01(v);
            // TODO
            return null;
            // return this.setHSL(h, (s * v) / ((h = (2 - s) * v) < 1 ? h : (2 - h)), h * 0.5);
        }
        public static fromColor4(color: Color4): Color3 {
            return new Color3(color.r, color.g, color.b);
        };
        /**
         * Aqua color
         * @param {Color3} 0x00FFFF
         */
        public static Aqua: Color3 = Color3.createFromHex(0x00FFFF);
        /**
         * Beige color
         * @param {Color3} 0xF5F5DC
         */
        public static Beige: Color3 = Color3.createFromHex(0xF5F5DC);
        /**
         * Black color
         * @param {Color3} 0x000000
         */
        public static Black: Color3 = Color3.createFromHex(0x000000);
        /**
         * Blue color
         * @param {Color3} 0x0000FF
         */
        public static Blue: Color3 = Color3.createFromHex(0x0000FF);
        /**
         * Brown color
         * @param {Color3} 0xA52A2A
         */
        public static Brown: Color3 = Color3.createFromHex(0xA52A2A);
        /**
         * Cyan color
         * @param {Color3} 0x00FFFF
         */
        public static Cyan: Color3 = Color3.createFromHex(0x00FFFF);
        /**
         * Gold color
         * @param {Color3} 0xFFD700
         */
        public static Gold: Color3 = Color3.createFromHex(0xFFD700);
        /**
         * Green color
         * @param {Color3} 0x008000
         */
        public static Green: Color3 = Color3.createFromHex(0x008000);
        /**
         * Indigo color
         * @param {Color3} 0x4B0082
         */
        public static Indigo: Color3 = Color3.createFromHex(0x4B0082);
        /**
         * Lavender color
         * @param {Color3} 0xE6E6FA
         */
        public static Lavender: Color3 = Color3.createFromHex(0xE6E6FA);
        /**
         * Orange color
         * @param {Color3} 0xFFA500
         */
        public static Orange: Color3 = Color3.createFromHex(0xFFA500);
        /**
         * Pink color
         * @param {Color3} 0xFFC0CB
         */
        public static Pink: Color3 = Color3.createFromHex(0xFFC0CB);
        /**
         * Purple color
         * @param {Color3} 0x800080
         */
        public static Purple: Color3 = Color3.createFromHex(0x800080);
        /**
         * Red color
         * @param {Color3} 0xFF0000
         */
        public static Red: Color3 = Color3.createFromHex(0xFF0000);
        /**
         * Yellow color
         * @param {Color3} 0xFFFF00
         */
        public static Yellow: Color3 = Color3.createFromHex(0xFFFF00);
        /**
         * White color
         * @param {Color3} 0xFFFFFF
         */
        public static White: Color3 = Color3.createFromHex(0xFFFFFF);
    };
};
