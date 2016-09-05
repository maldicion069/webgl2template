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


import { Light } from "./Light";
import { Vect3 } from "../maths/Vect3";
import { Color3 } from "../extras/Color3";

"use strict";

/**
 * Hemispheric light represents a simple and easy way to
 *     simulate realistic ambient light.
 * An hemispheric light is defined by a direction to the
 *     sky and by 3 colors: one for the diffuse (the sky color),
 *     one for the ground (the color when the pixel is not towards
 *     the sky) and one for the specular.
 */
/**
 * Ambient light class
 * @class AmbientLight
 */
class AmbientLight extends Light {
    /**
     * Ambient light constructor
     */
    constructor() {
        super();
    }
};

export { AmbientLight };