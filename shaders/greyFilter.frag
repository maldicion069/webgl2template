#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 uv;

uniform sampler2D tex;

void main() {
	fragColor = texture(tex, uv);
    if (uv.s >= 0.5) {
        float grey = fragColor.r * 0.299 + fragColor.g * 0.587 + fragColor.b * 0.114;
        fragColor.rgb = vec3(grey);
    }
}
