import { vec3, mat4} from 'https://cdn.skypack.dev/gl-matrix';
// import Renderer from './renderer.js';
// const renderer = new Renderer();
// const gl = renderer.webGlContext();


export default class Transform
{
	constructor()
	{
		this.translate = vec3.fromValues( 0, 0, 0);
		this.scale = vec3.fromValues( 1, 1, 1);
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues( 0, 0, 0);

		// this.projection = mat4.create();
		// mat4.perspective(this.projection,
		// 1.0472, 1,
		// 0.1 , 256);


		// this.view = mat4.create();
		// mat4.lookAt(this.view, vec3.fromValues(1, 1, 1.5), 
		// vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0))

		this.modelTransformMatrix = mat4.create();
        mat4.identity(this.modelTransformMatrix);
        
        this.newmodelTransformMatrix = mat4.create();
		mat4.identity(this.newmodelTransformMatrix);

        this.mvpMatrix = this.modelTransformMatrix;
		this.updateMVPMatrix();
		
		this.rotMat = mat4.create();
		mat4.identity(this.rotMat)

		this.lightTranslate = vec3.create();
	}

	getMVPMatrix()
	{
		return this.modelTransformMatrix;
	}

	// Keep in mind that modeling transformations are applied to objects in the opposite of the order in which they occur in the code
	updateMVPMatrix()
	{
        mat4.identity(this.modelTransformMatrix);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle, this.rotationAxis);
		// mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.rotMat);
        mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}
	
	updateMVPMatrixQuat()
	{
        mat4.identity(this.modelTransformMatrix);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		// mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle, this.rotationAxis);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.rotMat);
        mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
    }
    
    updateRotation(xCentroid,yCentroid){
        // mat4.identity(this.modelTransformMatrix);
        this.newmodelTransformMatrix = this.modelTransformMatrix;
		mat4.translate(this.newmodelTransformMatrix, this.newmodelTransformMatrix, vec3.fromValues( xCentroid, yCentroid, 0));
        mat4.rotate(this.newmodelTransformMatrix, this.newmodelTransformMatrix, this.rotationAngle, this.rotationAxis);
		mat4.translate(this.newmodelTransformMatrix, this.newmodelTransformMatrix, vec3.fromValues( -xCentroid, -yCentroid, 0));
        // mat4.identity(this.modelTransformMatrix);
    }



	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}
	setLightTranslate(TransVec){
		this.lightTranslate = TransVec;
	}

	getTranslate()
	{
		return this.translate;
	}

	getLightTranslate(){
		return this.lightTranslate;
	}
	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}

	setRotate(rotationAxis, rotationAngle)
	{
		this.rotationAngle = rotationAngle;
		this.rotationAxis = rotationAxis;
	}

	getRotate()
	{
		return this.rotate;
	}
}