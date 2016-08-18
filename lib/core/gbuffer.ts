/// <reference path="../extras/Vector2.ts" />
/// <reference path="../textures/simpleTexture2D.ts" />
/// <reference path="../textures/renderBufferTexture.ts" />
/// <reference path="core.ts" />
/// <reference path="framebuffer.ts" />

enum gbuffer_type {
	position,
	normal,
	diffuse,
	num_textures
}

class GBuffer {

	protected framebuffer: Framebuffer;

	constructor(size: Vector2<number>) {
		const gl = Core.getInstance().getGL();

		this.framebuffer = new Framebuffer([
			// Position color buffer
			new SimpleTexture2D(size, {
				"internalformat": gl.RGB,
				"format": gl.RGB,
				"type": gl.FLOAT,
				"minFilter": gl.NEAREST,
				"maxFilter": gl.NEAREST
			}),
			// Normal color buffer
			new SimpleTexture2D(size, {
				"internalformat": gl.RGB,
				"format": gl.RGB,
				"type": gl.FLOAT,
				"minFilter": gl.NEAREST,
				"maxFilter": gl.NEAREST
			}),
			// Color + Specular color buffer
			new SimpleTexture2D(size, {
				"internalformat": gl.RGB,
				"format": gl.RGB,
				"type": gl.FLOAT,
				"minFilter": gl.NEAREST,
				"maxFilter": gl.NEAREST
			})
		], size, true, true, {});

		console.log("done");
	}

	public bindForReading() {
		this.framebuffer.onlyBindTextures();
	}

	public bindForWriting() {
		this.framebuffer.bind();
	}

	public destroy() {
		const gl = Core.getInstance().getGL();
		if (this.framebuffer) {
			this.framebuffer.destroy();
		}
	}
}