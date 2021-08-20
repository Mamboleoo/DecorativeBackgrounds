/* 
Original full implementation : https://raw.githubusercontent.com/Trackball/Three.js-Object-Rotation-with-Quaternion/master/Rotation.js
This is a trimmed down version of the above code which acts as a utility to implement trackball based rotation of objects.
To use :
1. Include the following lines (In that order) in your index.html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r67/three.min.js"></script>
<script type="text/javascript" src="trackball.js"></script>
2. Add this file along with index.html
3. Then add the following snippet in index.js to get the updated rotation matrix based on trackball rotation on the screen.
Trackball.RotationWithQuaternion.onRotationChanged = function (updatedRotationMatrix) {
	console.log(updatedRotationMatrix)
}
4. Note that this code will add mouse events on top of the page to handle drag/click etc, so do not add such events in your code.
*/

// Namespace
var Trackball = Trackball ||
{};

Trackball.RotationWithQuaternion = (function()
{
	var scope = this;

	var camera, scene, renderer;

	var cube;

	var mouseDown = false;
	var rotateStartPoint = new THREE.Vector3(0, 0, 1);
	var rotateEndPoint = new THREE.Vector3(0, 0, 1);

	var curQuaternion;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var rotationSpeed = 2;
	var lastMoveTimestamp;
	var moveReleaseTimeDelta = 50;

	var startPoint = {
		x: 0,
		y: 0
	};

	var deltaX = 0,
		deltaY = 0;

	var setup = function()
	{
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

		scene = new THREE.Scene();
		setRotationMatrix = () => {}

		// Cube

		var boxGeometry = new THREE.BoxGeometry(10, 10, 10);

		var cubeMaterial = new THREE.MeshBasicMaterial();

		cube = new THREE.Mesh(boxGeometry, cubeMaterial);
		scene.add(cube);	

		renderer = new THREE.CanvasRenderer();
		document.addEventListener('mousedown', onDocumentMouseDown, false);

		window.addEventListener('resize', onWindowResize, false);
	};

	function onWindowResize()
	{
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;		
	}

	function onDocumentMouseDown(event)
	{
		event.preventDefault();

		document.addEventListener('mousemove', onDocumentMouseMove, false);
		document.addEventListener('mouseup', onDocumentMouseUp, false);

		mouseDown = true;

		startPoint = {
			x: event.clientX,
			y: event.clientY
		};

		rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
	}

	function onDocumentMouseMove(event)
	{
		deltaX = event.x - startPoint.x;
		deltaY = event.y - startPoint.y;

		handleRotation();

		startPoint.x = event.x;
		startPoint.y = event.y;

		lastMoveTimestamp = new Date();

		render();
	}

	function onDocumentMouseUp(event)
	{
		if (new Date().getMilliseconds() - lastMoveTimestamp.getMilliseconds() > moveReleaseTimeDelta)
		{
			deltaX = event.x - startPoint.x;
			deltaY = event.y - startPoint.y;
		}

		mouseDown = false;

		document.removeEventListener('mousemove', onDocumentMouseMove, false);
		document.removeEventListener('mouseup', onDocumentMouseUp, false);
	}

	function projectOnTrackball(touchX, touchY)
	{
		var mouseOnBall = new THREE.Vector3();

		mouseOnBall.set(
			clamp(touchX / windowHalfX, -1, 1), clamp(-touchY / windowHalfY, -1, 1),
			0.0
		);

		var length = mouseOnBall.length();

		if (length > 1.0)
		{
			mouseOnBall.normalize();
		}
		else
		{
			mouseOnBall.z = Math.sqrt(1.0 - length * length);
		}

		return mouseOnBall;
	}

	function rotateMatrix(rotateStart, rotateEnd)
	{
		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();

		var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

		if (angle)
		{
			axis.crossVectors(rotateStart, rotateEnd).normalize();
			angle *= rotationSpeed;
			quaternion.setFromAxisAngle(axis, angle);
		}
		return quaternion;
	}

	function clamp(value, min, max)
	{
		return Math.min(Math.max(value, min), max);
	}		

	function render()
	{
		if (!mouseDown)
		{
			var drag = 0.95;
			var minDelta = 0.05;

			if (deltaX < -minDelta || deltaX > minDelta)
			{
				deltaX *= drag;
			}
			else
			{
				deltaX = 0;
			}

			if (deltaY < -minDelta || deltaY > minDelta)
			{
				deltaY *= drag;
			}
			else
			{
				deltaY = 0;
			}

			handleRotation();
		}

		renderer.render(scene, camera);
	}

	var handleRotation = function()
	{
		rotateEndPoint = projectOnTrackball(deltaX, deltaY);

		var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
		curQuaternion = cube.quaternion;
		curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
		curQuaternion.normalize();
		cube.setRotationFromQuaternion(curQuaternion);

		rotateEndPoint = rotateStartPoint;
		
		scope.Trackball.RotationWithQuaternion.onRotationChanged && scope.Trackball.RotationWithQuaternion.onRotationChanged(cube.matrixWorld.elements)
	};

	// PUBLIC INTERFACE
	return {
		init: function()
		{
			setup();
		}
	};
})();

document.onreadystatechange = function()
{
	if (document.readyState === 'complete')
	{
		Trackball.RotationWithQuaternion.init();
	}
};