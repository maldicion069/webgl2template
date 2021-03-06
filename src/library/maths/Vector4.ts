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
     * Vector4<T> class
     * @class Vector4<T>
     */
    export class Vector4<T> {
        protected _x: T;
        protected _y: T;
        protected _z: T;
        protected _w: T;
        /**
         * Vector4<T> constructor
         * @param {T} x: First value
         * @param {T} y: Second value
         * @param {T} z: Third value
         * @param {T} z: Fourth value
         */
        constructor(x: T, y: T, z: T, w: T) {
            this._x = x;
            this._y = y;
            this._z = z;
            this._w = w;
        };
        public copy(v: Vector4<T>): Vector4<T> {
            this._x = v._x;
            this._y = v._y;
            this._z = v._z;
            this._w = v._w;

            return this;
        }
        public clone(): Vector4<T> {
            return new Vector4<T>(this.x, this.y, this.z, this.w);
        };
        /**
         * Check if two Vector4<T> are equals
         * @param  {Vector4<T>} other: Second vector
         * @return {boolean}: True if both equals
         */
        public isEqual(other: Vector4<T>): boolean {
            return this.x === other.x && this.y === other.y
                && this.z === other.z && this.w === other.w;
        };
        /**
         * Return x value.
         * @return {T}
         */
        get x(): T {
            return this._x;
        };
        /**
         * Return y value.
         * @return {T}
         */
        get y(): T {
            return this._y;
        };
        /**
         * Return z value.
         * @return {T}
         */
        get z(): T {
            return this._z;
        };
        /**
         * Return w value.
         * @return {T}
         */
        get w(): T {
            return this._w;
        };
        /**
         * Set x value.
         * @param {T} x New value.
         */
        set x(x: T) {
            this._x = x;
        };
        /**
         * Set y value.
         * @param {T} y New value.
         */
        set y(y: T) {
            this._y = y;
        };
        /**
         * Set z value.
         * @param {T} z New value.
         */
        set z(z: T) {
            this._z = z;
        };
        /**
         * Set w value.
         * @param {T} w New value.
         */
        set w(w: T) {
            this._w = w;
        };
    };
};
