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
     * Vect3 class
     * @class Vect3
     */
    export class Vect3 {
        protected _value: Float32Array;

        static xAxis = new Vect3(1.0, 0.0, 0.0);
        static yAxis = new Vect3(0.0, 1.0, 0.0);
        static zAxis = new Vect3(0.0, 0.0, 1.0);
        static up    = new Vect3(0.0, 1.0, 1.0);

        /**
         * Vect3 constructor
         * @param {number = 0.0} x
         * @param {number = 0.0} y
         * @param {number = 0.0} z
         */
        constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            this._value = new Float32Array([x, y, z]);
        };

        /**
         * Create a new Vect3 initialized with the given values
         * @param  {ArrayLike<number>} values Array of values (minLength 3)
         * @return {Vect3} a new Vect3
         */
        static create(value: ArrayLike<number>): Vect3 {
            return new Vect3(value[0], value[1], value[2]);
        };
        /**
         * Create a new Vect3 initialized with the given value.
         * All Vect3 component set with same value.
         * @param  {number = 0.0} value Simple value
         * @return {Vect3} a new Vect3
         */
        static createFromScalar(value: number = 0.0): Vect3 {
            return new Vect3(value, value, value);
        };
        /**
         * Create a new Vect3 initialized with values from current Vect3
         * @return {Vect3} a new Vect3
         */
        public clone(): Vect3 {
            return new Vect3(this.x, this.y, this.z);
        };
        /**
         * Adds current Vect3 with another Vect3
         * @param  {Vect3} v Second vector
         * @return {Vect3} a new Vect3
         */
        public add(v: Vect3): Vect3 {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;

            return this;
        };
        /**
         * Substracts current Vect3 with another Vect3
         * @param  {Vect3} v Second vector
         * @return {Vect3} a new Vect3
         */
        public sub(v: Vect3): Vect3 {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;

            return this;
        };
        /**
         * Multiplies current Vect3 with another Vect3
         * @param  {Vect3} v Second vector
         * @return {Vect3} a new Vect3
         */
        public mult(v: Vect3): Vect3 {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;

            return this;
        };
        /**
         * Multiplies current Vect3 with scalar
         * @param  {number} s Scalar value.
         * @return {Vect3} a new Vect3
         */
        public multByScalar(s: number): Vect3 {
            this.x *= s;
            this.y *= s;
            this.z *= s;

            return this;
        };
        /**
         * Divides current Vect3 with another Vect3
         * @param  {Vect3} v Second vector
         * @return {Vect3} a new Vect3
         */
        public div(v: Vect3): Vect3 {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.y;

            return this;
        };
        /**
         * Scales a Vect3 by a scalar number
         * @param  {number} value Amount to scale the vector by
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {Vect3} a new Vect3
         */
        public scale(value: number, dest: Vect3 = null): Vect3 {
            if (!dest) dest = this;

            dest.x *= value;
            dest.y *= value;
            dest.z *= value;

            return dest;
        };
        /**
         * Add two Vect3 after scaling the Vect3 given by a scalar value
         * @param  {Vect3} v Second vector
         * @param  {number} scale Amount to scale v by before adding
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {Vect3} a new Vect3
         */
        static scaleAndAdd(a: Vect3, b: Vect3, scale: number, dest: Vect3 = null): Vect3 {
            if (!dest) dest = new Vect3();

            dest.x = a.x + (b.x * scale);
            dest.y = a.y + (b.y * scale);
            dest.z = a.z + (b.z * scale);

            return dest;
        };
        /**
         * Calculate the euclidian distance between two Vect3s
         * @param  {Vect3}  v First Vect3 operand
         * @param  {Vect3}  v2 Second Vect3 operand
         * @return {number} Distance between Vect3s
         */
        static distance(v: Vect3, v2: Vect3): number {
            return Math.sqrt(this.squaredDistance(v, v2));
        };
        /**
         * Calculate the squared euclidian distance between two Vect3s
         * @param  {Vect3}  v First Vect3 operand
         * @param  {Vect3}  v2 Second Vect3 operand
         * @return {number} Distance between Vect3s
         */
        static squaredDistance(v: Vect3, v2: Vect3): number {
            const
                x = v2.x - v.x,
                y = v2.y - v.y,
                z = v2.z - v.z;

            return (x * x + y * y + z * z);
        };
        /**
         * Negates the components of current Vect3
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {Vect3} a new Vect3
         */
        public negate(dest: Vect3 = null): Vect3 {
            if (!dest) dest = this;

            dest.x = -this.x;
            dest.y = -this.y;
            dest.z = -this.z;

            return dest;
        };
        /**
         * Inverse of the components of current Vect3
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {Vect3} a new Vect3
         */
        public inverse(dest: Vect3 = null): Vect3 {
            if (!dest) dest = this;

            dest.x = 1 / this.x;
            dest.y = 1 / this.y;
            dest.z = 1 / this.z;

            return dest;
        };
        /**
         * Normalize current Vect3
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {Vect3} a new Vect3
         */
        public normalize(dest: Vect3 = null): Vect3 {
            if (!dest) dest = this;

            let length = this.length();

            if (length === 1) {
                return this;
            }

            if (length === 0) {
                dest.x = 0;
                dest.y = 0;
                dest.z = 0;

                return dest;
            }

            length = 1.0 / length;

            dest.x *= length;
            dest.y *= length;
            dest.z *= length;

            return dest;
        };
        /**
         * Calculate the dot product of two Vect3´s
         * @param  {Vect3}  v  First Vect3 operand
         * @param  {Vect3}  v2 Second Vect3 operand
         * @return {number} a new Vect3
         */
        static dot(v: Vect3, v2: Vect3): number {
            const
                x = v.x,
                y = v.y,
                z = v.z;

            const
                x2 = v2.x,
                y2 = v2.y,
                z2 = v2.z;

            return (x * x2 + y * y2 + z * z2);
        };
        /**
         * Return a string representation of Vect3
         * @return {String} String representation of Vect3
         */
        public toString = () : string => {
            return `Vect3(${this.x}, ${this.y}, ${this.z})`;
        };
        /**
         * Get internal values of Vect3
         * @return {Float32Array} Interval Vect3 values
         */
        get value(): Float32Array {
            return this._value;
        };
        /**
         * Return x component of Vect3
         * @return {number} First component of Vect3
         */
        get x(): number { return this._value[0]; };
        /**
         * Return y component of Vect3
         * @return {number} Second component of Vect3
         */
        get y(): number { return this._value[1]; };
        /**
         * Return z component of Vect3
         * @return {number} Third component of Vect3
         */
        get z(): number { return this._value[2]; };
        /**
         * Set x component of Vect3
         * @param {number} value New first component value
         */
        set x(value: number) {
            this._value[0] = value;
        };
        /**
         * Set y component of Vect3
         * @param {number} value New seond component value
         */
        set y(value: number) {
            this._value[1] = value;
        };
        /**
         * Set z component of Vect3
         * @param {number} value New third component value
         */
        set z(value: number) {
            this._value[2] = value;
        };
        /**
         * Returns whether or not current Vect3 and another Vect3 have exactly the same elements
         *     in the same position.
         * @param  {Vect3}   other The second vector
         * @return {boolean} True if the vectors are equals, false otherwise
         */
        public exactEquals(other: Vect3): boolean {
            return this.x === other.x && this.y === other.y  && this.z === other.z;
        }
        /**
         * Returns whether or not current Vect3 and another Vect3 have approximately the same elements
         *     in the same position.
         * @param  {Vect3}   other The second vector
         * @param  {boolean} Enable or disable threshold epsilon in values comparison
         * @return {boolean} True if the vectors are equals, false otherwise
         */
        public isEquals(vec: Vect3, threshold: boolean = false): boolean {
            for (let i = 0; i < 3; ++i) {
                if (threshold) {
                    if (Math.abs(this._value[i] - vec._value[i]) > 0.00001) {
                        return false;
                    }
                } else {
                    if (Math.abs(this._value[i] - vec._value[i]) !== 0) {
                        return false;
                    }
                }
            }

            return true;
        };
        /**
         * Compute the cross produt of two Vect3´s
         * @param  {Vect3}    v  First Vect3 operand
         * @param  {Vect3}    v2 Second Vect3 operand
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {number} a new Vect3
         */
        static cross(v: Vect3, v2: Vect3, dest: Vect3 = null): Vect3 {
            if (!dest) dest = new Vect3();

            const
                x = v.x,
                y = v.y,
                z = v.z;

            const
                x2 = v2.x,
                y2 = v2.y,
                z2 = v2.z;

            dest.x = y * z2 - z * y2;
            dest.y = z * x2 - x * z2;
            dest.z = x * y2 - y * x2;

            return dest;
        };
        /**
         * Adds two Vect3´s
         * @param  {Vect3}    v  First Vect3 operand
         * @param  {Vect3}    v2 Second Vect3 operand
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {number} a new Vect3
         */
        static add(v: Vect3, v2: Vect3, dest: Vect3 = null): Vect3 {
            if (!dest) dest = new Vect3();

            dest.x = v.x + v2.x;
            dest.y = v.y + v2.y;
            dest.z = v.z + v2.z;

            return dest;
        };
        /**
         * Subtracts two Vect3´s
         * @param  {Vect3}    v  First Vect3 operand
         * @param  {Vect3}    v2 Second Vect3 operand
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {number} a new Vect3
         */
        static sub(v: Vect3, v2: Vect3, dest: Vect3 = null): Vect3 {
            if (!dest) dest = new Vect3();

            dest.x = v.x - v2.x;
            dest.y = v.y - v2.y;
            dest.z = v.z - v2.z;

            return dest;
        };
        /**
         * Multiplies two Vect3´s
         * @param  {Vect3}    v  First Vect3 operand
         * @param  {Vect3}    v2 Second Vect3 operand
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {number} a new Vect3
         */
        static mult(v: Vect3, v2: Vect3, dest: Vect3 = null): Vect3 {
            if (!dest) dest = new Vect3();

            dest.x = v.x * v2.x;
            dest.y = v.y * v2.y;
            dest.z = v.z * v2.z;

            return dest;
        };
        /**
         * Divides two Vect3´s
         * @param  {Vect3}    v  First Vect3 operand
         * @param  {Vect3}    v2 Second Vect3 operand
         * @param  {Vect3 = null} dest Destiny Vect3 (optional)
         * @return {number} a new Vect3
         */
        static div(v: Vect3, v2: Vect3, dest: Vect3 = null): Vect3 {
            if (!dest) dest = new Vect3();

            dest.x = v.x / v2.x;
            dest.y = v.y / v2.y;
            dest.z = v.z / v2.z;

            return dest;
        };
        /**
         * Calculate Vect3 length
         * @return {number} Length of Vect3
         */
        public length(): number {
            return Math.sqrt(this.squaredLength());
        };
        /**
         * Calculate Vect3 squared length
         * @return {number} Length of Vect3
         */
        public squaredLength(): number {
            const
                x = this.x,
                y = this.y,
                z = this.z;

            return (x * x + y * y + z * z);
        };
        /**
         * Return minimum Vect3 between two Vect3's
         * @param  {Vect3} v0   First Vect3 operand
         * @param  {Vect3} v2   Second Vect3 operand
         * @return {Vect3} a new Vect3 equals to minimum Vect3 entries
         */
        public static min(v0: Vect3, v2: Vect3): Vect3 {
            const x = (v0.x < v2.x) ? v0.x : v2.x;
            const y = (v0.y < v2.y) ? v0.y : v2.y;
            const z = (v0.z > v2.z) ? v0.z : v2.z;

            return new Vect3(x, y, z);
        };
        /**
         * Return maximum Vect3 between two Vect3's
         * @param  {Vect3} v0   First Vect3 operand
         * @param  {Vect3} v2   Second Vect3 operand
         * @return {Vect3} a new Vect3 equals to maximum Vect3 entries
         */
        public static max(v0: Vect3, v2: Vect3): Vect3 {
            const x = (v0.x > v2.x) ? v0.x : v2.x;
            const y = (v0.y > v2.y) ? v0.y : v2.y;
            const z = (v0.z > v2.z) ? v0.z : v2.z;

            return new Vect3(x, y, z);
        };
        /**
         * Perform a linear interpolation between two Vect3's
         * @param  {Vect3}  init First Vec2 operand
         * @param  {Vect3}  end  Second Vec2 operand
         * @param  {number} t    Interpolation amount between the two inputs
         * @return {Vect3}  Interpolant Vect3
         */
        public static lerp(init: Vect3, end: Vect3, t: number): Vect3 {
            const x = init.x + ((end.x - init.x) * t);
            const y = init.y + ((end.y - init.y) * t);
            const z = init.z + ((end.z - init.z) * t);

            return new Vect3(x, y, z);
        };
        /**
         * Limiting Vect3 between min and max value
         * @param  {Vect3} value Entry vector
         * @param  {Vect3} min   Minimum Vect3 vector
         * @param  {Vect3} max   Maximum Vect3 vector
         * @return {Vect3}       a new Vect3
         */
        public static clamp(value: Vect3, min: Vect3, max: Vect3): Vect3 {
            const x = (value.x > max.x) ? max.x : (value.x < min.x) ? min.x : value.x;
            const y = (value.y > max.y) ? max.y : (value.y < min.y) ? min.y : value.y;
            const z = (value.z > max.z) ? max.z : (value.z < min.z) ? min.z : value.z;

            return new Vect3(x, y, z);
        };


        public set(vx: number, vy: number, vz: number): MB.Vect3 {
            this.x = vx;
            this.y = vy;
            this.z = vz;

            return this;
        };

        /*public reset(v: Vect3): Vect3 {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;

            return this;
        }*/

        public applyQuat(q: Quat, dest: Vect3 = null): Vect3 {
            if (!dest) dest = new Vect3();

            // calculate quat * vector
            const ix =  q.w * this.x + q.y * this.z - q.z * this.y;
            const iy =  q.w * this.y + q.z * this.x - q.x * this.z;
            const iz =  q.w * this.z + q.x * this.y - q.y * this.x;
            const iw = -q.x * this.x - q.y * this.y - q.z * this.z;

            // calculate result * inverse quat
            dest.x = ix * q.w + iw * - q.x + iy * - q.z - iz * - q.y;
            dest.y = iy * q.w + iw * - q.y + iz * - q.x - ix * - q.z;
            dest.z = iz * q.w + iw * - q.z + ix * - q.y - iy * - q.x;

            return dest;
        };

        public applyMatrix3(mat: MB.Mat3): MB.Vect3 {
            let x = this.x,
                y = this.y,
                z = this.z;

            this.x = mat._value[0] * x + mat._value[4] * y + mat._value[8]  * z;
            this.y = mat._value[1] * x + mat._value[5] * y + mat._value[9]  * z;
            this.z = mat._value[2] * x + mat._value[6] * y + mat._value[10] * z;

            return this;
        };

        public applyMat4(mat: MB.Mat4): MB.Vect3 {
            let x = this.x,
                y = this.y,
                z = this.z;

            this.x = mat._value[0] * x + mat._value[4] * y + mat._value[8]  * z + mat._value[12];
            this.y = mat._value[1] * x + mat._value[5] * y + mat._value[9]  * z + mat._value[13];
            this.z = mat._value[2] * x + mat._value[6] * y + mat._value[10] * z + mat._value[14];

            return this;
        };

        public copy(v: MB.Vect3): MB.Vect3 {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;

            return this;
        };

        public setFromMatrixPosition(mat: MB.Mat4): MB.Vect3 {
            return this.setFromMatColumn(mat, 3);
        };
        public setFromMatColumn(mat: MB.Mat4, idx: number): MB.Vect3 {
            return this.fromArray(mat._value, idx * 4);
        };
        public fromArray(array: Float32Array, offset: number = 0): MB.Vect3 {
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];

            return this;
        }
    };
};
