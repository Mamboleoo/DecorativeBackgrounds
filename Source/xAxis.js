import Transform from './transform.js'
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
var objStr = document.getElementById('xAxis.obj').innerHTML;
const objReadAsString = objStr;
const meshData = new objLoader.Mesh(objReadAsString);
console.log(meshData)


export default class AxisX
{
	constructor(gl){
		this.vertexPositionData = new Float32Array(
			meshData.vertices
			
		);
		this.vertexIndices = new Uint16Array(
			meshData.indices

        );
        this.gl = gl;
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
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.STATIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, (elementPerVertex) * this.vertexPositionData.BYTES_PER_ELEMENT, 0);

		this.color = color
		const indexBuffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, this.gl.STATIC_DRAW);
        
        var newcolor = new Float32Array([1.0,0.0,0.0,1.0]);
        const u_color = shader.uniform("color");
		this.gl.uniform4fv(u_color, newcolor);
		shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());

		

		this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, indexBuffer);
		// this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, indexBuffer);



		// this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexPositionData.length / elementPerVertex);
	}
}
