import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';
import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import GourardFragmentShaderSrc from './gourardfrag.js';
import gourardVertexShaderSrc from './gourardVertex.js';
import Renderer from './renderer.js';
import Mesh from './mesh.js'
import Square from './square.js'
import Circle from './circle.js';
import Teapot from './teapot.js';
import Car from './car.js';
// import ObjLoader from './parser.js';
import AxisX from './xAxis.js';
import AxisY from './yAxis.js';
import AxisZ from './zAxis.js';


import Face from './face.js';
import Neck from './neck.js';
import Body from './body.js';
import Arms from './arms.js';
import Legs from './legs.js';

var red, green, blue, purple;
red    = [1.0, 0.0, 0.0,1.0];
green  = [0.0, 1.0, 0.0,1.0];
blue   = [0.0, 0.0, 1.0,1.0];
purple = [1.0, 0.0, 1.0,1.0];

const renderer = new Renderer();
const gl = renderer.webGlContext();

var quatRot = mat4.create();

// if(mode == 1){
	Trackball.RotationWithQuaternion.onRotationChanged = function (updatedRotationMatrix) {
		// console.log(updatedRotationMatrix)
		mat4.copy(quatRot,updatedRotationMatrix);
		// for(var i = 0; i<figureList.length;i+=1){
			if(movinglist.length>0){
				movinglist[0].transform.rotMat = quatRot;
				movinglist[0].transform.updateMVPMatrixQuat();
			}
			
		// }
	}
// }



var shadermode = 0;
const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
const Gshader = new Shader(gl,gourardVertexShaderSrc,GourardFragmentShaderSrc);


// window.addEventListener("keydown",function(event){
// 	if(event.code=="KeyP"){
// 		shadermode = (shadermode + 1)%2;
// 	}

// })

// if(shadermode == 1){
// 	shader.use();
// 	console.log("Phong")
// 	projectionMatrix = shader.uniform("projection");
// 	viewMatrix = shader.uniform("view");

// }
// if(shadermode == 0){
// 	Gshader.use();
// 	console.log("Gourard")
// }


// var projectionMatrix = Gshader.uniform("projection");
// var viewMatrix = Gshader.uniform("view");

// const projection = mat4.create();
// mat4.perspective(projection,
// 1.0472, 1,
// 0.1 , 256);

// const view = mat4.create();
// mat4.lookAt(view, vec3.fromValues(1, 1, 1), 
// vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0))
// // console.log(view)

// shader.setUniformMatrix4fv(projectionMatrix,projection);
// shader.setUniformMatrix4fv(viewMatrix, view);


var mouseX = 0
var mouseY = 0
var mode = 0
console.log("mode = ", mode)

var angleRotation = 0;
var x,y;
var movinglist = []
var rightButton = 0

window.addEventListener("keydown",function(event){
	if(event.code=="KeyM"){
		mode = (mode + 1)%2
		this.console.log("mode = " , mode)
	}
	if(event.code=="KeyS"){
		shadermode = (shadermode + 1)%2;
	}
})
var drawMode = ""
let exitProgram = false
	window.addEventListener("keydown",function(event){
		if(event.code =="Escape"){
			exitProgram = true;
		} 
		if(mode == 10){
			if (event.code=="KeyR"){
				drawMode = "rect"
			}
			else if (event.code=="KeyS"){
				drawMode = "square"
			}
			else if (event.code=="KeyC"){
				drawMode = "circle"
			}
			this.console.log("Drawing a" , drawMode)

		}	
})

var mousedown = 0;
window.addEventListener("mousedown",function(event){
	mousedown = 1;
})
window.addEventListener("mouseup",function(event){
	mousedown = 0;
})

var selectedList = [];
function Create2DArray(rows) {
	var arr = [];
  
	for (var i=0;i<rows;i+=1) {
	   arr[i] = [];
	}
  
	return arr;
  }

var figureList = [];
var axisList = [];
const xAxis = new AxisX(gl);
// figureList.push(xAxis);
const yAxis = new AxisY(gl);
// figureList.push(yAxis);
const zAxis = new AxisZ(gl);
// figureList.push(zAxis);
axisList.push(xAxis,yAxis,zAxis);

var xList = [];
var yList = [];
var zList = [];

var indexNew = -1;
var distanceListNew = [];
var lightingList = [];

var angle = 0;
window.addEventListener("keydown",function(event){
	if(event.code == "KeyA"){
		if(figureList.length == 0){
			const mesh = new Car(gl,0.0000000000001,0);  // car
			mesh.transform.scale = vec3.fromValues(mesh.scale,mesh.scale,mesh.scale);
			mesh.transform.updateMVPMatrix();
			const square = new Teapot(gl,0.1,0); // teapot
			square.transform.scale = vec3.fromValues(square.scale, square.scale, square.scale);
			square.transform.updateMVPMatrix();
			const newcircle = new Circle(gl,0,0,0.2,1,0); //cuboid
			const mesh1 = new Car(gl,1,0);  // car
			mesh1.transform.scale = vec3.fromValues(mesh1.scale,mesh1.scale,mesh1.scale);
			mesh1.transform.updateMVPMatrix();
			figureList.push(mesh);
			figureList.push(square);
			figureList.push(newcircle);
			figureList.push(mesh1)
	
			figureList[0].transform.translate = vec3.fromValues(-.8,0,0);
			figureList[0].transform.updateMVPMatrix();
			figureList[1].transform.translate = vec3.fromValues(.4,-.6,0);
			figureList[1].transform.updateMVPMatrix();
			figureList[2].transform.translate = vec3.fromValues(.4,.8,0);
			figureList[2].transform.updateMVPMatrix();
			figureList[3].transform.translate = vec3.fromValues(-.8,0,0);
			figureList[3].transform.updateMVPMatrix();
		}
		

	}
	if(event.code=="Digit4"){
		movinglist[0] = figureList[3];
		// this.console.log(movinglist)
		// movinglist[0].draw(Gshader, "green", 0);
	}
	if(event.code=="Digit5"){
		movinglist[0] = figureList[1];
		// this.console.log(movinglist)
		// movinglist[0].draw(Gshader, "green", 0);
	}
	if(event.code=="Digit6"){
		movinglist[0] = figureList[2];
		// this.console.log(movinglist)
		// movinglist[0].draw(Gshader, "green", 0);
	}
	if(event.code=="Digit0"){
		if(movinglist.length>0){
			lightingList.push(movinglist[0])
			movinglist.pop()
		}
		
	}
	if(event.code=="Digit1"){
		if(movinglist.length>0){
			for(var i = 0;i<lightingList.length;i+=1){
				if(lightingList[i]==movinglist[0]){
					lightingList.pop()
				}
			}
			
		}
	}
	if(mode == 1){
		if(event.code=="ArrowRight"){
			this.console.log("Right Arrow Key Pressed")

			let translation = vec3.fromValues(0.05,0,0);
			let finalT = vec3.add(movinglist[0].transform.translate, 
				movinglist[0].transform.translate,
				translation)
			movinglist[0].transform.setTranslate(finalT);
			movinglist[0].transform.updateMVPMatrix();
			// movinglist[0].copyvector[2] += 1

			let finalTLight = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalTLight);
				movinglist[0].transform.updateMVPMatrix();
		}
		else if(event.code=="ArrowLeft"){
			this.console.log("Left Arrow Key Pressed")

			let translation = vec3.fromValues(-0.05,0,0);
			let finalT = vec3.add(movinglist[0].transform.translate, 
				movinglist[0].transform.translate,
				translation)
			movinglist[0].transform.setTranslate(finalT);
			movinglist[0].transform.updateMVPMatrix();

			let finalTLight = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalTLight);
				movinglist[0].transform.updateMVPMatrix();

		}
		else if(event.code=="ArrowUp"){
			this.console.log("Up Arrow Key Pressed")
			let translation = vec3.fromValues(0,0.05,0);
			let finalT = vec3.add(movinglist[0].transform.translate, 
				movinglist[0].transform.translate,
				translation)
			movinglist[0].transform.setTranslate(finalT);
			movinglist[0].transform.updateMVPMatrix();	

			let finalTLight = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalTLight);
				movinglist[0].transform.updateMVPMatrix();

		}
		else if(event.code=="ArrowDown"){
			this.console.log("Down Arrow Key Pressed")
			let translation = vec3.fromValues(0,-0.05,0);
			let finalT = vec3.add(movinglist[0].transform.translate, 
				movinglist[0].transform.translate,
				translation)
			movinglist[0].transform.setTranslate(finalT);					
			movinglist[0].transform.updateMVPMatrix();

			let finalTLight = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalTLight);
				movinglist[0].transform.updateMVPMatrix();
		}
		else if(event.code=="Equal"){
			this.console.log("+ Key Pressed")
			// if(movinglist[0].vectorMovingLight)
			// this.console.log(movinglist[0].vertexPositionData)
			let scale = vec3.fromValues(0.01,0.01,0.01);
			let finalS = vec3.add(movinglist[0].transform.scale, 
				movinglist[0].transform.scale,
				scale)
			movinglist[0].transform.setScale(finalS);
	
			movinglist[0].transform.updateMVPMatrix();
			
		}
		else if(event.code=="Minus"){
			this.console.log("- Key Pressed")

			let scale = vec3.fromValues(-0.01,-0.01,-.01);
			let finalS = vec3.add(movinglist[0].transform.scale, 
				movinglist[0].transform.scale,
				scale)
			movinglist[0].transform.setScale(finalS);
			movinglist[0].transform.updateMVPMatrix();

		}
	}

	if(movinglist.length>0){
		if(event.code == "KeyX"){
			this.console.log("Light Right")
				let translation = vec3.fromValues(0.05,0,0);
				let finalT = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalT);
				movinglist[0].transform.updateMVPMatrix();
		}
		if(event.code == "KeyZ"){
			this.console.log("Light Left")
				let translation = vec3.fromValues(-0.05,0,0);
				let finalT = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalT);
				movinglist[0].transform.updateMVPMatrix();
		}
		if(event.code == "KeyC"){
			this.console.log("Light Down")
				let translation = vec3.fromValues(0,-0.05,0);
				let finalT = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalT);
				movinglist[0].transform.updateMVPMatrix();
		}
		if(event.code == "KeyV"){
			this.console.log("Light Up")
				let translation = vec3.fromValues(0,0.05,0);
				let finalT = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalT);
				movinglist[0].transform.updateMVPMatrix();
		}
		if(event.code == "KeyN"){
			this.console.log("Light Out of plane")
				let translation = vec3.fromValues(0,0,0.05);
				let finalT = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalT);
				movinglist[0].transform.updateMVPMatrix();
		}
		if(event.code == "KeyB"){
			this.console.log("Light inside plane")
				let translation = vec3.fromValues(0,0,-0.05);
				let finalT = vec3.add(movinglist[0].transform.getLightTranslate(), 
					movinglist[0].transform.getLightTranslate(),
					translation)
				movinglist[0].transform.setLightTranslate(finalT);
				movinglist[0].transform.updateMVPMatrix();
		}
	}
	
	// if(event.code == "KeyY"){
	// 	var rotate = figureList[0].transform.rotationAxis;
	// 	var angle = figureList[0].transform.rotationAngle;
	// 	rotate = vec3.fromValues(1,0,0)
	// 	angle += 1.5708;
	// 	figureList[0].transform.setRotate(rotate, angle);
	// 	figureList[0].transform.updateMVPMatrix();

	// 	rotate = figureList[1].transform.rotationAxis;
	// 	angle = figureList[1].transform.rotationAngle;
	// 	rotate = vec3.fromValues(0,1,0)
	// 	angle += 1.5708;
	// 	figureList[1].transform.setRotate(rotate, angle);
	// 	figureList[1].transform.updateMVPMatrix();

	// 	rotate = figureList[2].transform.rotationAxis;
	// 	angle = figureList[2].transform.rotationAngle;
	// 	rotate = vec3.fromValues(0,0,1)
	// 	angle += 1.5708;
	// 	figureList[2].transform.setRotate(rotate, angle);
	// 	figureList[2].transform.updateMVPMatrix();
	// }
	// if(event.code == "KeyX"){
	// 	var rotate = figureList[0].transform.rotationAxis;
	// 	var angle = figureList[0].transform.rotationAngle;
	// 	rotate = vec3.fromValues(0,1,0)
	// 	angle += 1.5708;
	// 	figureList[0].transform.setRotate(rotate, angle);
	// 	figureList[0].transform.updateMVPMatrix();

	// 	rotate = figureList[1].transform.rotationAxis;
	// 	angle = figureList[1].transform.rotationAngle;
	// 	rotate = vec3.fromValues(1,0,0)
	// 	angle += 1.5708;
	// 	figureList[1].transform.setRotate(rotate, angle);
	// 	figureList[1].transform.updateMVPMatrix();

	// 	rotate = figureList[2].transform.rotationAxis;
	// 	angle = figureList[2].transform.rotationAngle;
	// 	rotate = vec3.fromValues(0,0,1)
	// 	angle += 1.5708;
	// 	figureList[2].transform.setRotate(rotate, angle);
	// 	figureList[2].transform.updateMVPMatrix();
	// }
	// if(event.code == "KeyZ"){
	// 	var rotate = figureList[0].transform.rotationAxis;
	// 	var angle = figureList[0].transform.rotationAngle;
	// 	rotate = vec3.fromValues(0,0,1)
	// 	angle += 1.5708;
	// 	figureList[0].transform.setRotate(rotate, angle);
	// 	figureList[0].transform.updateMVPMatrix();

	// 	rotate = figureList[1].transform.rotationAxis;
	// 	angle = figureList[1].transform.rotationAngle;
	// 	rotate = vec3.fromValues(0,0,1)
	// 	angle += 1.5708;
	// 	figureList[1].transform.setRotate(rotate, angle);
	// 	figureList[1].transform.updateMVPMatrix();

	// 	rotate = figureList[2].transform.rotationAxis;
	// 	angle = figureList[2].transform.rotationAngle;
	// 	rotate = vec3.fromValues(0,0,1)
	// 	angle += 1.5708;
	// 	figureList[2].transform.setRotate(rotate, angle);
	// 	figureList[2].transform.updateMVPMatrix();
	// }

	if(event.code=="KeyG"){
		let scale = vec3.fromValues(-0.5,-0.5,-0.5);
		let finalS = vec3.add(figureList[0].transform.scale, 
			figureList[0].transform.scale,
			scale)
		figureList[0].transform.setScale(finalS);
		figureList[0].transform.updateMVPMatrix();

		scale = vec3.fromValues(.2,.2,.2);
		finalS = vec3.add(figureList[1].transform.scale, 
			figureList[1].transform.scale,
			scale)
		figureList[1].transform.setScale(finalS);
		figureList[1].transform.updateMVPMatrix();

		scale = vec3.fromValues(.3,.3,.3);
		finalS = vec3.add(figureList[2].transform.scale, 
			figureList[2].transform.scale,
			scale)
		figureList[2].transform.setScale(finalS);
		figureList[2].transform.updateMVPMatrix();
	}
	if(event.code=="KeyR"){
		let scale = vec3.fromValues(1,1,1);

		figureList[0].transform.setScale(scale);
		figureList[0].transform.updateMVPMatrix();

		figureList[1].transform.setScale(scale);
		figureList[1].transform.updateMVPMatrix();


		figureList[2].transform.setScale(scale);
		figureList[2].transform.updateMVPMatrix();
	}




})
	window.addEventListener("click", function(event){
		if(mode == 10){
			mouseX = this.event.clientX
			mouseY = this.event.clientY
			var midX = renderer.canvas.width/2, midY = renderer.canvas.height/2;
			var rect = event.target.getBoundingClientRect();
			mouseX = ((mouseX - rect.left) - midX) / midX;
			mouseY = (midY - (mouseY - rect.top)) / midY;
			if(drawMode=="rect"){
				const mesh = new Mesh(gl,0,0,0.25,0.5,0.5,0);
				// const mesh = new Manan(gl, 0,0,0);
				mesh.transform.translate = vec3.fromValues(mouseX,mouseY,0);
				mesh.transform.scale = vec3.fromValues(mesh.scale,mesh.scale,mesh.scale);
				mesh.transform.updateMVPMatrix();
				figureList.push(mesh);
			}
			else if(drawMode=="square"){
				const square = new Square(gl,0,0,0.5,0.5,1,0);
				square.transform.translate = vec3.fromValues(mouseX,mouseY,0);
				square.transform.updateMVPMatrix();
				figureList.push(square);
			}
			else if(drawMode=="circle"){
				const newcircle = new Circle(gl,0,0,0.2,1,0);
				newcircle.transform.translate = vec3.fromValues(mouseX,mouseY,0);
				newcircle.transform.updateMVPMatrix();
				figureList.push(newcircle);
			}
			animate();
			// drawPrevious();
			// this.console.log(figureList)
		}
		else if(mode == 4){
			var distanceList =[];
			x = this.event.clientX
			y = this.event.clientY
			var midX = renderer.canvas.width/2, midY = renderer.canvas.height/2;
			var rect = event.target.getBoundingClientRect();
			x = ((x - rect.left) - midX) / midX;
			y = (midY - (y - rect.top)) / midY;

			for(var i = 0; i< figureList.length;i+=1){
				distanceList[i] = Math.sqrt((x - figureList[i].transform.modelTransformMatrix[12])**2 + (y - figureList[i].transform.modelTransformMatrix[13])**2)
			}
			var minDis = Math.min(...distanceList)
			var index = 0;
			for(var i = 0; i< distanceList.length;i+=1){
				if(distanceList[i]==minDis){
					index = i;
					break;
				}
			}

			movinglist[0] = figureList[index];
			// figureList[index].draw(shader,"green")

			this.window.addEventListener("mousedown",function(event){

					let position = vec4.create();
					let positionT = vec4.create();
					let transVector = mat4.create();
					for(var j = 0;j < movinglist[0].FaceVertex.length;j+=3){
						vec4.set(position,movinglist[0].FaceVertex[j],movinglist[0].FaceVertex[j+1], movinglist[0].FaceVertex[j+2], 1);
						mat4.copy(transVector, movinglist[0].transform.modelTransformMatrix);
						vec4.transformMat4(positionT, position, transVector);
						xList.push(positionT[0]);
						yList.push(positionT[1]);
						zList.push(positionT[2]);
					}
					var xMin = Math.min(...xList)
					var yMin = Math.min(...yList)
					var zMin = Math.min(...zList)
					var xMax = Math.max(...xList)
					var yMax = Math.max(...yList)
					var zMax = Math.max(...zList)

					var faceXCentroid = (xMax + xMin)/2
					var faceYCentroid = (yMax + yMin)/2
					var faceZCentroid = (zMax + zMin)/2
					xList = [];
					yList = [];
					zList = [];
					this.console.log(faceXCentroid,faceYCentroid,faceZCentroid)
					//
					for(var j = 0;j < movinglist[0].NeckVertex.length;j+=3){
						vec4.set(position,movinglist[0].NeckVertex[j],movinglist[0].NeckVertex[j+1], movinglist[0].NeckVertex[j+2], 1);
						mat4.copy(transVector, movinglist[0].transform.modelTransformMatrix);
						vec4.transformMat4(positionT, position, transVector);
						xList.push(positionT[0]);
						yList.push(positionT[1]);
						zList.push(positionT[2]);
						// this.console.log("hello")
					}
					var xMin = Math.min(...xList)
					var yMin = Math.min(...yList)
					var zMin = Math.min(...zList)
					var xMax = Math.max(...xList)
					var yMax = Math.max(...yList)
					var zMax = Math.max(...zList)

					var neckXCentroid = (xMax + xMin)/2
					var neckYCentroid = (yMax + yMin)/2
					var neckZCentroid = (zMax + zMin)/2
					xList = [];
					yList = [];
					zList = [];
					this.console.log(neckXCentroid,neckYCentroid,neckZCentroid)

					//body
					for(var j = 0;j < movinglist[0].BodyVertex.length;j+=3){
						vec4.set(position,movinglist[0].BodyVertex[j],movinglist[0].BodyVertex[j+1], movinglist[0].BodyVertex[j+2], 1);
						mat4.copy(transVector, movinglist[0].transform.modelTransformMatrix);
						vec4.transformMat4(positionT, position, transVector);
						xList.push(positionT[0]);
						yList.push(positionT[1]);
						zList.push(positionT[2]);
						// this.console.log("hello")
					}
					var xMin = Math.min(...xList)
					var yMin = Math.min(...yList)
					var zMin = Math.min(...zList)
					var xMax = Math.max(...xList)
					var yMax = Math.max(...yList)
					var zMax = Math.max(...zList)

					var bodyXCentroid = (xMax + xMin)/2
					var bodyYCentroid = (yMax + yMin)/2
					var bodyZCentroid = (zMax + zMin)/2
					xList = [];
					yList = [];
					zList = [];

					this.console.log(bodyXCentroid,bodyYCentroid,bodyZCentroid)
					//Arms
					for(var j = 0;j < movinglist[0].ArmsVertex.length;j+=3){
						vec4.set(position,movinglist[0].ArmsVertex[j],movinglist[0].ArmsVertex[j+1], movinglist[0].ArmsVertex[j+2], 1);
						mat4.copy(transVector, movinglist[0].transform.modelTransformMatrix);
						vec4.transformMat4(positionT, position, transVector);
						xList.push(positionT[0]);
						yList.push(positionT[1]);
						zList.push(positionT[2]);
						// this.console.log("hello")
					}
					var xMin = Math.min(...xList)
					var yMin = Math.min(...yList)
					var zMin = Math.min(...zList)
					var xMax = Math.max(...xList)
					var yMax = Math.max(...yList)
					var zMax = Math.max(...zList)

					var armsXCentroid = (xMax + xMin)/2
					var armsYCentroid = (yMax + yMin)/2
					var armsZCentroid = (zMax + zMin)/2
					xList = [];
					yList = [];
					zList = [];
					this.console.log(armsXCentroid,armsYCentroid,armsZCentroid)
					//legs
					for(var j = 0;j < movinglist[0].LegsVertex.length;j+=3){
						vec4.set(position,movinglist[0].LegsVertex[j],movinglist[0].LegsVertex[j+1], movinglist[0].LegsVertex[j+2], 1);
						mat4.copy(transVector, movinglist[0].transform.modelTransformMatrix);
						vec4.transformMat4(positionT, position, transVector);
						xList.push(positionT[0]);
						yList.push(positionT[1]);
						zList.push(positionT[2]);
						// this.console.log("hello")
					}
					var xMin = Math.min(...xList)
					var yMin = Math.min(...yList)
					var zMin = Math.min(...zList)
					var xMax = Math.max(...xList)
					var yMax = Math.max(...yList)
					var zMax = Math.max(...zList)

					var legsXCentroid = (xMax + xMin)/2
					var legsYCentroid = (yMax + yMin)/2
					var legsZCentroid = (zMax + zMin)/2
					xList = [];
					yList = [];
					zList = [];
					this.console.log(legsXCentroid,legsYCentroid,legsZCentroid)

					var xCentroidList = [];
					var yCentroidList = [];
					var zCentroidList = [];
					xCentroidList.push(faceXCentroid,neckXCentroid,bodyXCentroid,armsXCentroid,legsXCentroid);
					yCentroidList.push(faceYCentroid,neckYCentroid,bodyYCentroid,armsYCentroid,legsYCentroid);
					zCentroidList.push(faceZCentroid,neckZCentroid,bodyZCentroid,armsZCentroid,legsZCentroid);

					for(var i = 0; i<xCentroidList.length;i+=1){
						distanceListNew[i] = Math.sqrt((x-xCentroidList[i])**2 + (y-yCentroidList[i])**2)
					}
					var minDisNew = Math.min(...distanceListNew)
					if(minDisNew<0.1){
					for(var i = 0; i< distanceListNew.length;i+=1){
						if(distanceListNew[i]==minDisNew){
							indexNew = i;
							break;
						}
					}
				}

					this.console.log(indexNew);
					if(indexNew==0){
						movinglist[0].selected = 0;
					}
					else if(indexNew==1){
						movinglist[0].selected = 1;
					}
					else if(indexNew==2){
						movinglist[0].selected = 2;
					}
					else if(indexNew==3){
						movinglist[0].selected = 3;
					}
					else if(indexNew==4){
						movinglist[0].selected = 4;
					}
					// if(indexNew==1){
					// 	const square = new Neck(gl,0,0,0.5,0.5,1,0);
					// 	square.transform.translate = vec3.fromValues(movinglist[0].transform.translate[0],
					// 		movinglist[0].transform.translate[1],
					// 		movinglist[0].transform.translate[2]);
					// 	square.transform.updateMVPMatrix();
					// 	movinglist[0].NeckVertex = [];
					// 	figureList.push(square);
					// }
					// if(indexNew==2){
					// 	const square = new Body(gl,0,0,0.5,0.5,1,0);
					// 	square.transform.translate = vec3.fromValues(movinglist[0].transform.translate[0],
					// 		movinglist[0].transform.translate[1],
					// 		movinglist[0].transform.translate[2]);
					// 	square.transform.updateMVPMatrix();
					// 	movinglist[0].BodyVertex = [];
					// 	figureList.push(square);
					// }
					// if(indexNew==3){
					// 	const square = new Arms(gl,0,0,0.5,0.5,1,0);
					// 	square.transform.translate = vec3.fromValues(movinglist[0].transform.translate[0],
					// 		movinglist[0].transform.translate[1],
					// 		movinglist[0].transform.translate[2]);
					// 	square.transform.updateMVPMatrix();
					// 	movinglist[0].ArmsVertex = [];
					// 	figureList.push(square);
					// }
					// if(indexNew==4){
					// 	const square = new Legs(gl,0,0,0.5,0.5,1,0);
					// 	square.transform.translate = vec3.fromValues(movinglist[0].transform.translate[0],
					// 		movinglist[0].transform.translate[1],
					// 		movinglist[0].transform.translate[2]);
					// 	square.transform.updateMVPMatrix();
					// 	movinglist[0].LegsVertex = [];
					// 	figureList.push(square);
					// }

					
				
			})

			window.addEventListener("keydown",function(event){
				if(event.code=="ArrowRight"){
					this.console.log("Right Arrow Key Pressed")

					let translation = vec3.fromValues(0.05,0,0);
					let finalT = vec3.add(movinglist[0].transform.translate, 
						movinglist[0].transform.translate,
						translation)
					movinglist[0].transform.setTranslate(finalT);
					movinglist[0].transform.updateMVPMatrix();
				}
				else if(event.code=="ArrowLeft"){
					this.console.log("Left Arrow Key Pressed")

					let translation = vec3.fromValues(-0.05,0,0);
					let finalT = vec3.add(movinglist[0].transform.translate, 
						movinglist[0].transform.translate,
						translation)
					movinglist[0].transform.setTranslate(finalT);
					movinglist[0].transform.updateMVPMatrix();

				}
				else if(event.code=="ArrowUp"){
					this.console.log("Up Arrow Key Pressed")

					let translation = vec3.fromValues(0,0.05,0);
					let finalT = vec3.add(movinglist[0].transform.translate, 
						movinglist[0].transform.translate,
						translation)
					movinglist[0].transform.setTranslate(finalT);
					movinglist[0].transform.updateMVPMatrix();	

				}
				else if(event.code=="ArrowDown"){
					this.console.log("Down Arrow Key Pressed")
					let translation = vec3.fromValues(0,-0.05,0);
					let finalT = vec3.add(movinglist[0].transform.translate, 
						movinglist[0].transform.translate,
						translation)
					movinglist[0].transform.setTranslate(finalT);					
					movinglist[0].transform.updateMVPMatrix();
				}
				else if(event.code=="Equal"){
					this.console.log("+ Key Pressed")


					let scale = vec3.fromValues(0.01,0.01,0.01);
					let finalS = vec3.add(movinglist[0].transform.scale, 
						movinglist[0].transform.scale,
						scale)
					movinglist[0].transform.setScale(finalS);
			
					movinglist[0].transform.updateMVPMatrix();
					
				}
				else if(event.code=="Minus"){
					this.console.log("- Key Pressed")

					let scale = vec3.fromValues(-0.01,-0.01,-.01);
					let finalS = vec3.add(movinglist[0].transform.scale, 
						movinglist[0].transform.scale,
						scale)
					movinglist[0].transform.setScale(finalS);
					movinglist[0].transform.updateMVPMatrix();

				}
				else if(event.code == "Backspace"){
					this.console.log("Delete Pressed")
					movinglist[0].del = 1;
				}
				else if(event.code == "KeyX"){
					var rotate = movinglist[0].transform.rotationAxis;
					var angle = movinglist[0].transform.rotationAngle;
					rotate = vec3.fromValues(1,0,0)
              		angle += 0.1;
					movinglist[0].transform.setRotate(rotate, angle);
					movinglist[0].transform.updateMVPMatrix();
				}
				else if(event.code == "KeyY"){
					var rotate = movinglist[0].transform.rotationAxis;
					var angle = movinglist[0].transform.rotationAngle;
					rotate = vec3.fromValues(0,1,0)
              		angle += 0.1;
					movinglist[0].transform.setRotate(rotate, angle);
					movinglist[0].transform.updateMVPMatrix();
				}
				else if(event.code == "KeyZ"){
					var rotate = movinglist[0].transform.rotationAxis;
					var angle = movinglist[0].transform.rotationAngle;
					rotate = vec3.fromValues(0,0,1)
              		angle += 0.1;
					movinglist[0].transform.setRotate(rotate, angle);
					movinglist[0].transform.updateMVPMatrix();
				}
				else{
					return
				}
				

			})

		}

		else if(mode == 5){
			
			this.console.log(mousedown)

			var bodyElement = document.querySelector("body");
			bodyElement.addEventListener("mousemove", getMouseDirection, false);
			
			var xDirection = "";
			var yDirection = "";
			 
			var oldX = 0;
			var oldY = 0;
			 
			function getMouseDirection(e) {
				//deal with the horizontal case
				if (oldX < e.pageX) {
					xDirection = "right";
				} else {
					xDirection = "left";
				}
			 
				//deal with the vertical case
				if (oldY < e.pageY) {
					yDirection = "down";
				} else {
					yDirection = "up";
				}
			 
				oldX = e.pageX;
				oldY = e.pageY;
			 
				// console.log(oldX + " " + oldY);
				var radius = Math.sqrt(2);
				var xRotate,yRotate;
				if(xDirection == "right"){
					if(mousedown == 1){
					angleRotation -=0.01;
					xRotate = radius*Math.cos(angleRotation);
					yRotate = radius*Math.sin(angleRotation);

					var viewRotateX = mat4.create();
					mat4.lookAt(viewRotateX,
						vec3.fromValues(xRotate,1,yRotate),
						vec3.fromValues(0,0,0),
						vec3.fromValues(0,1,0)	
					);
					if(mode == 1){
					shader.setUniformMatrix4fv(viewMatrix, viewRotateX);
					}
				}
					// console.log(angleRotation,xRotate,yRotate)
				}
				else if(xDirection == "left"){
					if(mousedown == 1){
					angleRotation +=0.01;
					xRotate = radius*Math.cos(angleRotation);
					yRotate = radius*Math.sin(angleRotation);

					var viewRotateX = mat4.create();
					mat4.lookAt(viewRotateX,
						vec3.fromValues(xRotate,1,yRotate),
						vec3.fromValues(0,0,0),
						vec3.fromValues(0,1,0)	
					);
					if(mode == 1){
						shader.setUniformMatrix4fv(viewMatrix, viewRotateX);
						}		
								}			// console.log(angleRotation,xRotate,yRotate)
				}
			
				if(yDirection == "down"){
					if(mousedown == 1){
					angleRotation +=0.01;
					xRotate = radius*Math.cos(angleRotation);
					yRotate = radius*Math.sin(angleRotation);

					var viewRotateXy = mat4.create();
					mat4.lookAt(viewRotateXy,
						vec3.fromValues(1,xRotate,yRotate),
						vec3.fromValues(0,0,0),
						vec3.fromValues(0,1,0)	
					);
					if(mode == 2){
						shader.setUniformMatrix4fv(viewMatrix, viewRotateXy);
						}					// console.log(angleRotation,xRotate,yRotate)
					}
				}
				else if(yDirection == "up"){
					if(mousedown == 1){

					angleRotation -=0.01;
					xRotate = radius*Math.cos(angleRotation);
					yRotate = radius*Math.sin(angleRotation);

					var viewRotateXy = mat4.create();
					mat4.lookAt(viewRotateXy,
						vec3.fromValues(1,xRotate,yRotate),
						vec3.fromValues(0,0,0),
						vec3.fromValues(0,1,0)	
					);
					if(mode == 2){
						shader.setUniformMatrix4fv(viewMatrix, viewRotateXy);
						}					// console.log(angleRotation,xRotate,yRotate)
					}
				}

			}


			console.log("Bounding Box Mode")
			//iterate through all objects
			for(var i =0;i<figureList.length;i+=1){
				if (figureList[i].del == 0){
					let position = vec4.create();
					let positionT = vec4.create();
					let transVector = mat4.create();
					for(var j = 0;j < figureList[i].vertexPositionData.length;j+=3){
							if(figureList[i].del == 0){
								vec4.set(position,figureList[i].vertexPositionData[j],figureList[i].vertexPositionData[j + 1], figureList[i].vertexPositionData[j + 2], 1);
					 			mat4.copy(transVector, figureList[i].transform.modelTransformMatrix);
					  			vec4.transformMat4(positionT, position, transVector);
					  			// xList.push(positionT[0]);
								// yList.push(positionT[1]);
								//   zList.push(positionT[2]);
								  
							}
					}	
				}
				
			}
			var xMin = Math.min(...xList)
			var yMin = Math.min(...yList)
			var zMin = Math.min(...zList)
			var xMax = Math.max(...xList)
			var yMax = Math.max(...yList)
			var zMax = Math.max(...zList)

			var xCentroid = (xMax + xMin)/2
			var yCentroid = (yMax + yMin)/2
			var zCentroid = (zMax + zMin)/2

			console.log("CENTROID IS:")
			this.console.log(xCentroid, yCentroid, zCentroid)
			this.window.addEventListener("keydown",function(event){
				if(event.code=="Period"){
					this.console.log("Moving Anti-Clockwise")

					for(var i =0;i<figureList.length;i+=1){
						var rotate = figureList[i].transform.rotationAxis;
						var angle = figureList[i].transform.rotationAngle;
						rotate = vec3.fromValues(0,0.5,1)
              			angle += 0.1;

						  let xTranslate = Math.cos(0.1) * (figureList[i].transform.translate[0] - xCentroid) 
						  - Math.sin(0.1) * (figureList[i].transform.translate[1] - yCentroid) + xCentroid;

						  let yTranslate = Math.sin(0.1) * (figureList[i].transform.translate[0] - xCentroid)
						   + Math.cos(0.1) * (figureList[i].transform.translate[1] - yCentroid) + yCentroid;

						figureList[i].transform.translate[0] = xTranslate;
						figureList[i].transform.translate[1] = yTranslate;
						figureList[i].transform.setRotate(rotate, angle);
						figureList[i].transform.updateMVPMatrix();

					}
				}
				else if(event.code=="Comma"){

					this.console.log("Moving Clockwise")

					for(var i =0;i<figureList.length;i+=1){
						var rotate = figureList[i].transform.rotationAxis;
						var angle = figureList[i].transform.rotationAngle;
						
						rotate = vec3.fromValues(1,1,0);
						angle -= 0.1;

						  let xTranslate = Math.cos(-0.1) * (figureList[i].transform.translate[0] - xCentroid)
						   - Math.sin(-0.1) * (figureList[i].transform.translate[1] - yCentroid) + xCentroid;
						   
						  let yTranslate = Math.sin(-0.1) * (figureList[i].transform.translate[0] - xCentroid)
						   + Math.cos(-0.1) * (figureList[i].transform.translate[1] - yCentroid) + yCentroid;

						   

						figureList[i].transform.translate[0] = xTranslate;
						figureList[i].transform.translate[1] = yTranslate;

						figureList[i].transform.setRotate(rotate, angle);
						figureList[i].transform.updateMVPMatrix();
					}
				}
				else{
					return
				}
				
			})
			

			

		}/////////
		else{
			return
		}
	});



	// if(shadermode == 1){
	// 	shader.use();
	// 	console.log("Phong")
	// 	projectionMatrix = shader.uniform("projection");
	// 	viewMatrix = shader.uniform("view");
	
	// }
	// if(shadermode == 0){
	// 	Gshader.use();
	// 	console.log("Gourard")
	// }

function animate(){
	renderer.clear();
	// console.log(mousedown)
	if(shadermode == 0){
		Gshader.use();
		// console.log("Gourard")
		// for(var i =0; i<3;i+=1){
		// 	axisList[i].draw(Gshader,"",shadermode);
		// }
		for(var i = 0; i < figureList.length;i+=1){
			if(figureList[i].del != 1){
				figureList[i].draw(Gshader,"",shadermode);
				if(movinglist.length>0){
					movinglist[0].draw(Gshader,"green",shadermode);
				}
				if(lightingList.length>0){
					for(var j = 0;j<lightingList.length;j+=1){
						lightingList[j].draw(Gshader,"black",shadermode);

					}
				}
			}
		}
	}
	if(shadermode == 1){
		shader.use();
		// console.log("Phong")

		// for(var i =0; i<3;i+=1){
		// 	axisList[i].draw(shader,"",shadermode);
		// }
		for(var i = 0; i < figureList.length;i+=1){
			if(figureList[i].del != 1){
				figureList[i].draw(shader,"",shadermode);
				if(movinglist.length>0){
					movinglist[0].draw(shader,"green",shadermode);
				}
				if(lightingList.length>0){
					for(var j = 0;j<lightingList.length;j+=1){
						lightingList[j].draw(shader,"black",shadermode);

					}
				}

			}
		}
		
	}
	//draw prev
	
	
	
	if(exitProgram == true){
		window.cancelAnimationFrame(animate);
	}
	else{
		window.requestAnimationFrame(animate);
	}	
}

animate();