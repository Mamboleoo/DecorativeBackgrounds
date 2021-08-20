import Transform from './transform.js'
import { vec3, mat4, vec4} from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
var objStr = document.getElementById('car.obj').innerHTML;
const objReadAsString = objStr;
const meshData = new objLoader.Mesh(objReadAsString);
console.log(meshData)


export default class Car
{
	constructor(gl,scale, del){
		this.vertexPositionData = new Float32Array(
			meshData.vertices
		);

		this.vertexIndices = new Uint16Array(
			meshData.indices

		);
		this.normals = new Float32Array(meshData.vertexNormals);

		this.scale = scale;
		this.del = del;
		this.gl = gl;
		this.buffer = this.gl.createBuffer();
		if (!this.buffer)
		{
			throw new Error("Buffer could not be allocated");
		}
        this.transform = new Transform();
        // var lightingOnOff = 1
		// this.onoff = lightingOnOff;
		this.vectorMovingLight = vec3.create();

	}
	

	draw(shader,color,shadingModel)
	{		
        // this.shadingModel = shadingModel;
		var projectionMatrix = shader.uniform("projection");
        var viewMatrix = shader.uniform("view");

        const projection = mat4.create();
        mat4.perspective(projection,
        1.0472, 1,
        0.1 , 256);

        const view = mat4.create();
        mat4.lookAt(view, vec3.fromValues(1, 1, 1), 
        vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0))

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
		var shininess = 150.0
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
        var temp3  = vec3.create();
        vec3.normalize(temp3,[0, 0, 0]);
        this.gl.uniform3fv(spec, temp2);

        // if(this.onoff != 0 ){
        //     this.gl.uniform3fv(spec, temp2);
        // }
        // else{
        //     this.gl.uniform3fv(spec, temp3);

        // }
          // red light

		shader.setUniformMatrix4fv(
			worldInverseTransposeLocation,
			worldInverseTransposeMatrix);

		 this.gl.uniform4fv(colorLocation, [0.2, 0.0, 0.2, 1]); // green
 
		//  vec3.add(this.vectorMovingLight, [1,2,4], this.vectorMovingLight);
		var copyVec = vec3.create();
		vec3.copy(copyVec,this.transform.getLightTranslate());

		var transcopyvec = vec3.create();
		vec3.copy(transcopyvec,this.transform.getTranslate());
		
		var xList = [];
		var yList = [];
		var zList = [];

		let position = vec4.create();
		let positionT = vec4.create();
		let transVector = mat4.create();
		for(var i = 0;i<this.vertexPositionData.length;i+=3){
			vec4.set(position,this.vertexPositionData[i],this.vertexPositionData[i + 1], this.vertexPositionData[i + 2], 1);
			mat4.copy(transVector, this.transform.modelTransformMatrix);
			vec4.transformMat4(positionT, position, transVector);
			xList.push(positionT[0]);
			yList.push(positionT[1]);
			zList.push(positionT[2]);
		}

		var distanceList = [];
		for(var i = 0;i<xList.length;i+=1){
			distanceList[i] = (copyVec[0]-xList[i])**2 + (copyVec[1]-yList[i])**2 + (copyVec[2]-zList[i])**2
		}

		var boundingBoxMinDistance = Math.min(...distanceList)
		

		if(boundingBoxMinDistance < 2){
			this.gl.uniform3fv(lightWorldPositionLocation, [1+copyVec[0],1+copyVec[1],1+copyVec[2]]);
		}
		else{
			console.log("Violates Constraint: Car")
			this.gl.uniform3fv(lightWorldPositionLocation, [transcopyvec[0],transcopyvec[1],transcopyvec[2]]);
			// console.log(boundingBoxMinDistance)
		}
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
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.STATIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, (elementPerVertex) * this.vertexPositionData.BYTES_PER_ELEMENT, 0);


        const u_color = shader.uniform("u_color");
        

		this.color = color
		if(color == "green"){
			var newcolor = new Float32Array([0.0,1.0,0.0,1.0]);
        }
        else if(color == "black"){
            var newcolor = new Float32Array([0.0,0.0,0.0,1.0]);
            this.gl.uniform3fv(spec, temp3);
            this.gl.uniform4fv(u_color, new Float32Array([0.0,0.0,0.0,1.0]))
            this.gl.uniform4fv(colorLocation, [0, 0, 0, 1]); // green
            var shininess = 1500000000.0
            // console.log("black :(")
        }
		else{
            var newcolor = new Float32Array([1.0,0.0,1.0,1.0]);
        }

        this.gl.uniform4fv(u_color, newcolor);

		const indexBuffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, this.gl.STATIC_DRAW);

		// const u_color = shader.uniform("u_color");
        // this.gl.uniform4fv(u_color, newcolor);
        // if(this.onoff == 0){
        // this.gl.uniform4fv(u_color, new Float32Array([0.0,0.0,0.0,1.0]))
        // }
        

		

		this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, indexBuffer);


	}
}
