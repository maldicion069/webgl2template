/// <reference path="../core/context.ts" />
/// <reference path="../extras/extensions.ts" />

import Context from "../core/context";
import extensions from "../extras/extensions";

"use strict";

const gl = Context.getContext();

const ext = extensions.get("EXT_blend_minmax");

// Blending ecuation
enum BlendingEq {
    FuncAdd = gl.FUNC_ADD,
    FuncSub = gl.FUNC_SUBTRACT,
    FuncRevSub = gl.FUNC_REVERSE_SUBTRACT,

    Min = (<any>gl).MIN || ext.MIN_EXT,
    Max = (<any>gl).MAX || ext.MAX_EXT
}
export default BlendingEq;
