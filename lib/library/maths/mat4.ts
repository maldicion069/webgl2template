/// <reference path="../../typings/gl-matrix.d.ts" />
/// <reference path="vect3.ts" />

import Vect3 from "./vect3";

"use strict";

/**
 * mat4 class
 * @class mat4
 */
class mat4 {
    protected _value: Float32Array = new Float32Array(16);
    constructor(values: number[] = null) {
        if(values) {
            this.init(values);
        }
    };
    init(values: number[]): mat4 {
        for (let i = 0; i < 16; ++i) {
            this._value[i] = values[i];
        }
        return this;
    };
    isEquals(mat: mat4, threshold: boolean = false): boolean {
        for (let i = 0; i < 16; ++i) {
            if (threshold) {
                if (Math.abs(this._value[i] - mat._value[i]) > 0.00001) {
                    return false;
                }
            } else {
                if (Math.abs(this._value[i] - mat._value[i]) !== 0) {
                    return false;
                }
            }
        }

        return true;
    };
    transpose(): mat4 {
        return null;
    };
    determinant(): number {
        return 0;
    };
    invert(): mat4 {
        return null;
    };
    add(m: mat4): mat4 {
        for (let i = 0; i < 16; ++i) {
            this._value[i] += m._value[i];
        }
        return this;
    };
    sub(m: mat4): mat4 {
        for (let i = 0; i < 16; ++i) {
            this._value[i] -= m._value[i];
        }
        return this;
    };
    mult(m: mat4): mat4 {
        return null;
    };
    identify(): mat4 {
        this._value[0] = 1;
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;

        this._value[4] = 0;
        this._value[5] = 1;
        this._value[6] = 0;
        this._value[7] = 0;

        this._value[8] = 0;
        this._value[9] = 0;
        this._value[10] = 1;
        this._value[11] = 0;

        this._value[12] = 0;
        this._value[13] = 0;
        this._value[14] = 0;
        this._value[15] = 1;

        return this;
    };
    toString(): string {
        return `mat4(
             ${this._value[0]},  ${this._value[1]},  ${this._value[2]},  ${this._value[3]},
             ${this._value[4]},  ${this._value[5]},  ${this._value[6]},  ${this._value[7]},
             ${this._value[8]},  ${this._value[9]}, ${this._value[10]}, ${this._value[11]},
            ${this._value[12]}, ${this._value[13]}, ${this._value[14]}, ${this._value[15]},
        )`;
    };
    translate(v: Vect3): mat4 {
        return null;
    };
    rotate(angle: number, axis: Vect3): mat4 {
        return null;
    };
    scale(v: Vect3): mat4 {
        const x =
            v[0],
            y = v[1],
            z = v[2];

        this._value[0] *= x;
        this._value[1] *= x;
        this._value[2] *= x;
        this._value[3] *= x;

        this._value[4] *= y;
        this._value[5] *= y;
        this._value[6] *= y;
        this._value[7] *= y;

        this._value[8] *= z;
        this._value[9] *= z;
        this._value[10] *= z;
        this._value[11] *= z;

        return this;
    };
    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): mat4 {
        const
            rl = (right - left),
            tb = (top - bottom),
            fn = (far - near);

        return new mat4([
            (near * 2.0) / rl,
            0.0,
            0.0,
            0.0,

            0.0,
            (near * 2.0) / tb,
            0.0,
            0.0,

            (right + left) / rl,
            (top + bottom) / tb,
            -(far + near) / fn,
            -1.0,

            0.0,
            0.0,
            -(far * near * 2.0) / fn,
            0.0
        ]);
    };
    static perspective(fovy: number, aspect: number, near: number, far: number): mat4 {
        const
            top = near * Math.tan(fovy * Math.PI / 360.0),
            right = top * aspect;

        return mat4.frustum(-right, right, -top, top, near, far);
    };
    static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): mat4 {
        const
            rl = (right - left),
            tb = (top - bottom),
            fn = (far - near);

        return new mat4([
            2.0 / rl,
            0.0,
            0.0,
            0.0,

            0.0,
            2.0 / tb,
            0.0,
            0.0,

            0.0,
            0.0,
            -2.0 / fn,
            0.0,

            -(left + right) / rl,
            -(top + bottom) / tb,
            -(far + near) / fn,
            1.0
        ]);
    };
    // static lookAt(...)
};

export default mat4;
