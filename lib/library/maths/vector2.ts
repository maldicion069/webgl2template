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

/**
 * Vector2<T> class
 * @class Vector2<T>
 */
class Vector2<T> {
    public x: T;
    public y: T;
    /**
     * Vector2<T> constructor
     * @param {T} x: First value
     * @param {T} y: Second value
     */
    constructor(x: T, y: T) {
        this.x = x;
        this.y = y;
    }
    /**
     * Check if two vector2<T> are equals
     * @param  {Vector2<T>} other: Second vector
     * @return {boolean}: True if both equals
     */
    public isEqual(other: Vector2<T>): boolean {
        return this.x === other.x && this.y === other.y;
    }
};

export default Vector2;
