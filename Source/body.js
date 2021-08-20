import Transform from './transform.js'

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

export default class Body
{
	constructor(gl, mouseX, mouseY, rectHeight, rectWidth,scale,del)
	{
		// this.fullbody = [];
		// this.fullbody.push(faceData,neckData,bodyData,
		// 	armsData,legsData);
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
        const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");

		const elementPerVertex = 3;
		// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		// this.gl.bufferData(this.gl.ARRAY_BUFFER, this.FaceVertex, this.gl.STATIC_DRAW);
		
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

		// this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		// this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.faceIndex, this.gl.STATIC_DRAW);

		const u_color = shader.uniform("color");
		this.gl.uniform4fv(u_color, newcolor);
		shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());

		// // this.gl.drawElements(this.gl.TRIANGLES, this.faceIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		// // neck start
		// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		// this.gl.bufferData(this.gl.ARRAY_BUFFER, this.NeckVertex, this.gl.STATIC_DRAW);

		// this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		// this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.neckIndex, this.gl.STATIC_DRAW);

		// this.gl.drawElements(this.gl.TRIANGLES, this.neckIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		// // Neck end

		//body
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.BodyVertex, this.gl.STATIC_DRAW);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.bodyIndex, this.gl.STATIC_DRAW);

		this.gl.drawElements(this.gl.TRIANGLES, this.bodyIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);

		//arms

		// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		// this.gl.bufferData(this.gl.ARRAY_BUFFER, this.ArmsVertex, this.gl.STATIC_DRAW);

		// this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		// this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.armsIndex, this.gl.STATIC_DRAW);

		// this.gl.drawElements(this.gl.TRIANGLES, this.armsIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);

		// //legs

		// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		// this.gl.bufferData(this.gl.ARRAY_BUFFER, this.LegsVertex, this.gl.STATIC_DRAW);

		// this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		// this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.legsIndex, this.gl.STATIC_DRAW);

		// this.gl.drawElements(this.gl.TRIANGLES, this.legsIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);







	}
}
