/// <reference path="core/core.ts" />
/// <reference path="resources/quadToneMap.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="dat-gui.d.ts" />
/// <reference path="models/quad.ts" />
/// <reference path="models/cube.ts" />
/// <reference path="core/shaderProgram.ts" />
/// <reference path="textures/texture2d.ts" />



/// <reference path="core/model.ts" />
/// <reference path="_demoCamera.ts" />
var camera = new Camera(new Float32Array([0.2082894891500473, 1.0681922435760498, 8.870955467224121]));

var gl: WebGLRenderingContext;
var stats: Stats = new Stats();
stats.setMode(0);
document.body.appendChild(stats.domElement);

var FizzyText = function() {
	return {
		message: 'dat.gui',
		speed: 0.8,
		displayOutline: false,
		explode: function() {  }
		// Define render logic ...
	};
};


var cc: Model;
var ss : ShaderProgram;


var view;
var projection;


window.onload = () => {
	gl = Core.getInstance().getGL();
	ToneMap.init(gl);

	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	var text = FizzyText();
	var gui = new dat.GUI();

	for(var index in text) { 
	    gui.add(text, index);
	}

	//cc = new Quad(1.0, 1.0, 1, 1);
	//cc = new Cube(1.0);
	cc = new Model("omg.json");

	ss = new ShaderProgram();
	ss.addShader("./shaders/demoShader.vert", gl.VERTEX_SHADER, mode.read_file);
	ss.addShader("./shaders/demoShader.frag", gl.FRAGMENT_SHADER, mode.read_file);
	ss.compile();

	ss.addAttributes(["position", "normal", "uv"]); //, "normal"]);
	ss.addUniforms(["projection", "view", "model", "normalMatrix", "texSampler"]);//, "demo"]);

	ss.use();

    view = camera.GetViewMatrix();
    projection = camera.GetProjectionMatrix(gl.canvas.width, gl.canvas.height);

    //console.log(view, projection);

    gl.uniformMatrix4fv(ss.uniformLocations['view'], false, view);
    gl.uniformMatrix4fv(ss.uniformLocations['projection'], false, projection);
	//ss.sendUniform("demo", "vec2")([0.0, 0.0], false);


	view = camera.GetViewMatrix();
	projection = camera.GetProjectionMatrix(gl.canvas.width, gl.canvas.height);

	document.addEventListener("keydown", function (ev) {
        if (ev.keyCode === 40 || ev.keyCode === 38) {
            ev.preventDefault();
        }
        var key = String.fromCharCode(ev.keyCode);
        var speed = 0.05;
        switch (key) {
            case "W":
                camera.processKeyboard(4, speed);
                break;
            case "S":
                camera.processKeyboard(5, speed);
                break;
            case "A":
                camera.processKeyboard(2, speed);
                break;
            case "D":
                camera.processKeyboard(3, speed);
                break;
            case "E":
                // - .
                camera.processKeyboard(0, speed);
                break;
            case "Q":
                // + .
                camera.processKeyboard(1, speed);
                break;

            case "X":
                //resetCamera();
                break;
        }

        switch (ev.keyCode) {
            case 38:
                camera.processMouseMovement(0.0, 2.5);
                break;
            case 40:
                camera.processMouseMovement(0.0, -2.5);
                break;
            case 37:
                camera.processMouseMovement(2.5, 0.0);
                break;
            case 39:
                camera.processMouseMovement(-2.5, 0.0);
                break;
        }
        view = camera.GetViewMatrix();
        projection = camera.GetProjectionMatrix(gl.canvas.width, gl.canvas.height);

        //console.log(view, projection);

        gl.uniformMatrix4fv(ss.uniformLocations['view'], false, view);
        gl.uniformMatrix4fv(ss.uniformLocations['projection'], false, projection);
        //gl.uniform3fv(ss.uniformLocations["viewPos"], camera.position);
    });

    initTexture("example.png");
	//tex2d = initTexture("example.png");

    var itv = setInterval(function() {
        console.log(counterTextures);
        if(counterTextures === 0) {
            console.log(tex2d);
            clearInterval(itv);
            requestAnimationFrame(drawScene);
        }        
    }, 100);
}

var counterTextures = 0;

function initTexture(str: string) {
    //var tex2d_;

    counterTextures++;

    //gl.bindTexture(gl.TEXTURE_2D, _tex);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));

    var cubeImage = new Image();
    cubeImage.onload = function () { 
        var size: vector2<number> = new vector2<number>(1000.0, 1000.0);
        tex2d = new Texture2D(cubeImage, size, {
            flipY: true,
            minFilter: gl.LINEAR,
            magFilter: gl.LINEAR,
            wrap: [gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE]
        });
        counterTextures--;
    }
    cubeImage.src = str;
    //return tex2d_;
}
var tex2d: Texture2D;




var lastTime = Date.now();
var deltaTime = 0.0;
var identityMatrix = mat4.create();
mat4.identity(identityMatrix);
var model = mat4.create();
var angle = 0;
function drawScene(dt: number) {
    var currentTime = Date.now();
    var timeElapsed = currentTime - lastTime;

    //camera.timeElapsed = timeElapsed;
    deltaTime = timeElapsed;

    lastTime = currentTime;

	stats.begin();
	dt *= 0.001; // convert to seconds

	dt = deltaTime;
    //console.log(dt);
    camera.timeElapsed = dt / 10.0;

	//resize(gl);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	angle += dt * 0.001;
	if(angle >= 180.0) {
		angle = -180.0;
	}


    ss.use();


    tex2d.bind(0);
    gl.uniform1i(ss.uniformLocations["texSampler"], 0);

    var dd = 1;

    for(var i = -7; i < 7; i += 5.0) {
        for(var j = -7; j < 7; j += 5.0) {
            dd *= -1;
            mat4.translate(model,identityMatrix, vec3.fromValues(j + 0.0, i * 1.0, 0.0));
            mat4.rotateY(model, model, 90.0 * Math.PI / 180);
            mat4.rotateY(model, model, angle * dd);
            mat4.scale(model, model, vec3.fromValues(0.335, 0.335, 0.335));

            gl.uniformMatrix4fv(ss.uniformLocations['model'], false, model);

            cc.render();
        }
    }

	stats.end();

	requestAnimationFrame(drawScene);
}

function resize(gl: WebGLRenderingContext) {
	var realToCSSPixels = window.devicePixelRatio || 1;

	// Lookup the size the browser is displaying the canvas in CSS pixels
	// and compute a size needed to make our drawingbuffer match it in
	// device pixels.
	var displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
	var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

	// Check if the canvas is not the same size.
	if (gl.canvas.width  != displayWidth ||
		gl.canvas.height != displayHeight) {

		// Make the canvas the same size
		gl.canvas.width  = displayWidth;
		gl.canvas.height = displayHeight;

		// Set the viewport to match
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}
}

var url = "config.json";
var request = new XMLHttpRequest();
request.open('GET', url, false);
request.onload = function () {
    if (request.status < 200 || request.status > 299) {
        console.log('Error: HTTP Status ' + request.status + ' on resource ' + url);
        return {};
    } else {
    	var json = JSON.parse(request.responseText);
        console.log(json);
    }
};
request.send();
