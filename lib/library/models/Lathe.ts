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


import { Vect2 } from "../maths/Vect2";
import { Vect3 } from "../maths/Vect3";
import { Drawable } from "./Drawable";

"use strict";

/**
 * Lathe class
 * @class Lathe
 */
class Lathe extends Drawable {
    /**
     * Lathe constructor
     * @param {ArrayLike<Vect3>} points List of points that define the lathe model.
     * @param {number} segments [description] Num. of segments.
     * @param {number = 0} phiInit [description]
     * @param {number = 2 * Math.PI} phiRadius [description]
     */
    constructor(points: ArrayLike<Vect3>, segments: number, phiInit: number = 0, phiRadius: number = 2 * Math.PI) {
        super();
        let vertices = [];
        let normals = [];
        let uvs = [];
        let indices = [];

        segments = Math.floor(segments);

        // phiRadius [0, 2PI]

        // vertexSize (in floats) = (segments + 1) * points.length;
        // indexSize (in floats) =  segments * points.length * 2 * 3;

        const inverseSegments = 1.0 / segments;

        let i, j, base, a, b, c, d, size;
        for ( i = 0; i <= segments; ++i) {
            const phi = phiInit + i * inverseSegments * phiRadius;

            const sin = Math.sin(phi);
            const cos = Math.cos(phi);

            for (j = 0, size = points.length - 1; j <= size; ++j) {
                vertices.push(new Vect3(
                    points[j].x * sin,
                    points[j].y,
                    points[j].x * cos
                ));

                uvs.push(new Vect2(
                    i / segments,
                    j / (points.length - 1)
                ));
            }
        }

        for (i = 0; i < segments; ++i) {
            for (j = 0; j < (points.length - 1); ++j) {
                base = j + i * points.length;

                // indices
                a = base;
                b = base + points.length;
                c = base + points.length + 1;
                d = base + 1;

                // face one
                indices.push(new Vect3(a, b, d));

                // face two
                indices.push(new Vect3(b, c, d));
            }
        }

        for (i = 0; i < vertices.length; ++i) {
            normals.push(new Vect3());
        }

        for (i = 0; i < indices.length; ++i) {
            const ia: Vect3 = vertices[indices[i].x];
            const ib: Vect3 = vertices[indices[i].y];
            const ic: Vect3 = vertices[indices[i].z];

            const e1: Vect3 = Vect3.sub(ia, ib);
            const e2: Vect3 = Vect3.sub(ic, ib);
            const no: Vect3 = Vect3.cross(e1, e2);

            normals[indices[i].x] = normals[indices[i].x].add(no);
            normals[indices[i].y] = normals[indices[i].y].add(no);
            normals[indices[i].z] = normals[indices[i].z].add(no);
        }

        for (i = 0; i < normals.length; ++i) {
            normals[i] = normals[i].normalize();
        }


        let vertices2: Array<number> = [];
        for (i = 0; i < vertices.length; ++i) {
            vertices2.push(vertices[i].x, vertices[i].y, vertices[i].z);
        }
        vertices = vertices2;
        let normals2: Array<number> = [];
        for (i = 0; i < normals.length; ++i) {
            normals2.push(normals[i].x, normals[i].y, normals[i].z);
        }
        normals = normals2;
        let uvs2: Array<number> = [];
        for (i = 0; i < uvs.length; ++i) {
            uvs2.push(uvs[i].x, uvs[i].y);
        }
        uvs = uvs2;
        let indices2: Array<number> = [];
        for (i = 0; i < indices.length; ++i) {
            indices2.push(indices[i].x, indices[i].y, indices[i].z);
        }
        indices = indices2;

        // if geometry closed, check average along the seam
        if (phiRadius === Math.PI * 2) {
            let n1 = new Vect3();
            let n2 = new Vect3();
            // let n3 = new Vect3();
            let n = new Vect3();

            base = segments * points.length * 3;
            for (i = 0, j = 0, size = points.length; i < size; ++i, j += 3) {

                // select normal int the first line
                n1.x = normals[j];
                n1.y = normals[j + 1];
                n1.z = normals[j + 2];

                // select normal of last line
                n2.x = normals[base + j];
                n2.y = normals[base + j + 1];
                n2.z = normals[base + j + 2];

                n = Vect3.add(n, Vect3.add(n1, n2)).normalize();

                normals[j] = normals[base + j] = n.x;
                normals[j + 1] = normals[base + j + 1] = n.y;
                normals[j + 2] = normals[base + j + 2] = n.z;

            }
        }

        this._handle = [];
        this._vao.bind();

        this.addElementArray(new Uint16Array(indices));

        this.addBufferArray(0, new Float32Array(vertices), 3);
        this.addBufferArray(1, new Float32Array(normals), 3);
        this.addBufferArray(2, new Float32Array(uvs), 2);

        this._indicesLen = indices.length;
    };
};

export { Lathe };
