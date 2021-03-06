#version 300 es
precision highp float;

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 uv;

layout(location = 3) in vec3 instanceLocation;
out vec3 outPosition;
out vec3 outNormal;
out vec2 outUV;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

void main() {
	mat3 normalMatrix = mat3(inverse(transpose(model)));

	outPosition = (view * model * vec4((position + instanceLocation), 1.0)).xyz;
	outUV = uv;
	outNormal = normalize(normalMatrix * normal);
	gl_Position = projection * view * model * vec4((position + instanceLocation), 1.0);
}