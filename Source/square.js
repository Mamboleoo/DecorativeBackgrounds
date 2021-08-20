import Transform from './transform.js'
import { vec3, mat4, mat3} from 'https://cdn.skypack.dev/gl-matrix';

import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';

var face = document.getElementById('Face.obj').innerHTML;
const faceData = new objLoader.Mesh(face);

var neck = document.getElementById('Neck.obj').innerHTML;
const neckData = new objLoader.Mesh(neck);

var body = document.getElementById('Body.obj').innerHTML;
const bodyData = new objLoader.Mesh(body);

var arms = document.getElementById('Arms.obj').innerHTML;
const armsData = new objLoader.Mesh(arms);

var legs = document.getElementById('Legs.obj').innerHTML;
const legsData = new objLoader.Mesh(legs);
// console.log(meshData)

export default class Square
{
	constructor(gl, mouseX, mouseY, rectHeight, rectWidth,scale,del, selected)
	{
		// this.fullbody = [];
		// this.fullbody.push(faceData,neckData,bodyData,
		// 	armsData,legsData);
			this.selected = -1;
			this.FaceVertex = new Float32Array(faceData.vertices);
			this.NeckVertex = new Float32Array(neckData.vertices);
			this.BodyVertex = new Float32Array(bodyData.vertices);
			this.ArmsVertex = new Float32Array(armsData.vertices);
			this.LegsVertex = new Float32Array(legsData.vertices);

			this.vertexData = [];
			this.vertexData.push(this.FaceVertex,this.NeckVertex, this.BodyVertex, this.ArmsVertex, this.LegsVertex);


			this.faceIndex = new Uint16Array(faceData.indices);
			this.neckIndex = new Uint16Array(neckData.indices);
			this.bodyIndex = new Uint16Array(bodyData.indices);
			this.armsIndex = new Uint16Array(armsData.indices);
			this.legsIndex = new Uint16Array(legsData.indices);

			this.normals = new Float32Array(meshData.vertexNormals);


		// this.vertexPositionData = new Float32Array(
		// 	this.fullbody.vertices
		// );
		// this.vertexIndices = new Uint16Array(
		// 	this.fullbody.indices

		// );

        this.gl = gl;
        this.del = del;
        this.mouseX = mouseX
		this.mouseY = mouseY
		this.rectHeight = rectHeight
        this.rectWidth = rectWidth
        this.scale = scale
		this.buffer = this.gl.createBuffer();
		if (!this.buffer)
		{
			throw new Error("Buffer could not be allocated");
        }
        this.transform = new Transform();

	}

	draw(shader,color)
	{		
        
		var projectionMatrix = shader.uniform("projection");
		var viewMatrix = shader.uniform("view");
		
		const projection = mat4.create();
		mat4.perspective(projection,
		1.0472, 1,
		0.1 , 256);
		
		const view = mat4.create();
		mat4.lookAt(view, vec3.fromValues(1, 1, 1), 
		vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0))
		// console.log(view)
		
		shader.setUniformMatrix4fv(projectionMatrix,projection);
		shader.setUniformMatrix4fv(viewMatrix, view);
		
				this.shadingModel = shadingModel;
		
				const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
				var worldInverseTransposeLocation = shader.uniform("u_worldInverseTranspose");
				var colorLocation = shader.uniform("u_color");
				var lightWorldPositionLocation = shader.uniform("u_lightWorldPosition");
				// var worldLocation = shader.uniform("u_world");
				var viewWorldPositionLocation = shader.uniform("u_viewWorldPosition");
				var shininessLocation = shader.uniform("u_shininess");
				var shininess = 5.0
				this.gl.uniform1f(shininessLocation, shininess);
				shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());
				// shader.setUniformMatrix4fv(worldLocation, this.transform.getMVPMatrix());
				var uModelTransformMatrix1 = mat4.create()
				mat4.invert(uModelTransformMatrix1,this.transform.getMVPMatrix());
				var worldInverseTransposeMatrix = mat4.create()
				mat4.transpose(worldInverseTransposeMatrix,uModelTransformMatrix1);
				var spec = shader.uniform("u_specularColor");
				var temp2 = vec3.create();
				vec3.normalize(temp2,[1, 1, 1]);
				this.gl.uniform3fv(spec, temp2);  // red light
		
				shader.setUniformMatrix4fv(
					worldInverseTransposeLocation,
					worldInverseTransposeMatrix);
		
				 this.gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green
		 
				 this.gl.uniform3fv(lightWorldPositionLocation, [1,2,4]);
				 this.gl.uniform3fv(viewWorldPositionLocation, [1,1,1]);
		
				 var normalLocation = shader.attribute("a_normal");
				 var normalBuffer = this.gl.createBuffer();
				 this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
				 this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.STATIC_DRAW);
				  this.gl.enableVertexAttribArray(normalLocation);
		  
		 this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
		  
		 // Tell the attribute how to get data out of normalBuffer (ARRAY_BUFFER)
		 var size = 3;          // 3 components per iteration
		 var type = this.gl.FLOAT;   // the data is 32bit floating point values
		 var normalize = false; // normalize the data (convert from 0-255 to 0-1)
		 var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		 var offset = 0;        // start at the beginning of the buffer
		 this.gl.vertexAttribPointer(
			 normalLocation, size, type, normalize, stride, offset)
				

		const elementPerVertex = 3;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.FaceVertex, this.gl.STATIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, (elementPerVertex) * this.FaceVertex.BYTES_PER_ELEMENT, 0);

		this.color = color
		if(color == "green"){
			var newcolor = new Float32Array([0.0,1.0,0.0,1.0]);
		}
		else{
			var newcolor = new Float32Array([1.0,0.0,1.0,1.0]);
		}

		const indexBuffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.faceIndex, this.gl.STATIC_DRAW);


		if(this.selected == 0){
			var newcolor = new Float32Array([1.0,0.0,1.0,1.0]);
		}
		const u_color = shader.uniform("color");
		this.gl.uniform4fv(u_color, newcolor);

		
		shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());

		this.gl.drawElements(this.gl.TRIANGLES, this.faceIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		// neck start
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.NeckVertex, this.gl.STATIC_DRAW);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.neckIndex, this.gl.STATIC_DRAW);

		this.gl.drawElements(this.gl.TRIANGLES, this.neckIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		// Neck end

		//body
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.BodyVertex, this.gl.STATIC_DRAW);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.bodyIndex, this.gl.STATIC_DRAW);

		this.gl.drawElements(this.gl.TRIANGLES, this.bodyIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);

		//arms

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.ArmsVertex, this.gl.STATIC_DRAW);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.armsIndex, this.gl.STATIC_DRAW);

		this.gl.drawElements(this.gl.TRIANGLES, this.armsIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);

		//legs

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.LegsVertex, this.gl.STATIC_DRAW);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.legsIndex, this.gl.STATIC_DRAW);

		this.gl.drawElements(this.gl.TRIANGLES, this.legsIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);

		if(this.selected == 0){
			var newcolor = new Float32Array([0.0,1.0,1.0,1.0]);
			this.gl.uniform4fv(u_color, newcolor);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.FaceVertex, this.gl.STATIC_DRAW);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.faceIndex, this.gl.STATIC_DRAW);
			this.gl.drawElements(this.gl.TRIANGLES, this.faceIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		}
		else if(this.selected == 1){
			var newcolor = new Float32Array([0.0,1.0,1.0,1.0]);
			this.gl.uniform4fv(u_color, newcolor);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.NeckVertex, this.gl.STATIC_DRAW);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.neckIndex, this.gl.STATIC_DRAW);
			this.gl.drawElements(this.gl.TRIANGLES, this.neckIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		}
		else if(this.selected == 3){
			var newcolor = new Float32Array([0.0,1.0,1.0,1.0]);
			this.gl.uniform4fv(u_color, newcolor);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.ArmsVertex, this.gl.STATIC_DRAW);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.armsIndex, this.gl.STATIC_DRAW);
			this.gl.drawElements(this.gl.TRIANGLES, this.armsIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		}
		else if(this.selected == 2){
			var newcolor = new Float32Array([0.0,1.0,1.0,1.0]);
			this.gl.uniform4fv(u_color, newcolor);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.BodyVertex, this.gl.STATIC_DRAW);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.bodyIndex, this.gl.STATIC_DRAW);
			this.gl.drawElements(this.gl.TRIANGLES, this.bodyIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		}
		else if(this.selected == 4){
			var newcolor = new Float32Array([0.0,1.0,1.0,1.0]);
			this.gl.uniform4fv(u_color, newcolor);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.LegsVertex, this.gl.STATIC_DRAW);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.legsIndex, this.gl.STATIC_DRAW);
			this.gl.drawElements(this.gl.TRIANGLES, this.legsIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		}







	}
}
