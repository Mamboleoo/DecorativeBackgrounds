var canvas = document.querySelector('canvas');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var colors = [
    new THREE.Color(0xac1122),
    new THREE.Color(0x96789f),
    new THREE.Color(0x535353)];

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x000000);

var scene = new THREE.Scene();

var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 6;


var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
camera.position.set(0, 0, 350);

var galaxy = new THREE.Group();
scene.add(galaxy);

// Create dots
var loader = new THREE.TextureLoader();
loader.crossOrigin = "";
var dotTexture = loader.load("img/dotTexture.png");
var dotsAmount = 3000;
var dotsGeometry = new THREE.Geometry();
var positions = new Float32Array(dotsAmount * 3);

var sizes = new Float32Array(dotsAmount);
var colorsAttribute = new Float32Array(dotsAmount * 3);
for (var i = 0; i < dotsAmount; i++) {
    var vector = new THREE.Vector3();

    vector.color = Math.floor(Math.random() * colors.length);
    vector.theta = Math.random() * Math.PI * 2;
    vector.phi =
        (1 - Math.sqrt(Math.random())) *
        Math.PI /
        2 *
        (Math.random() > 0.5 ? 1 : -1);

    vector.x = Math.cos(vector.theta) * Math.cos(vector.phi);
    vector.y = Math.sin(vector.phi);
    vector.z = Math.sin(vector.theta) * Math.cos(vector.phi);
    vector.multiplyScalar(120 + (Math.random() - 0.5) * 5);
    vector.scaleX = 5;

    if (Math.random() > 0.5) {
        moveDot(vector, i);
    }
    dotsGeometry.vertices.push(vector);
    vector.toArray(positions, i * 3);
    colors[vector.color].toArray(colorsAttribute, i*3);
    sizes[i] = 5;
}

function moveDot(vector, index) {
        var tempVector = vector.clone();
        tempVector.multiplyScalar((Math.random() - 0.5) * 0.2 + 1);
        TweenMax.to(vector, Math.random() * 3 + 3, {
            x: tempVector.x,
            y: tempVector.y,
            z: tempVector.z,
            yoyo: true,
            repeat: -1,
            delay: -Math.random() * 3,
            ease: Power0.easeNone,
            onUpdate: function () {
                attributePositions.array[index*3] = vector.x;
                attributePositions.array[index*3+1] = vector.y;
                attributePositions.array[index*3+2] = vector.z;
            }
        });
}

var bufferWrapGeom = new THREE.BufferGeometry();
var attributePositions = new THREE.BufferAttribute(positions, 3);
bufferWrapGeom.addAttribute('position', attributePositions);
var attributeSizes = new THREE.BufferAttribute(sizes, 1);
bufferWrapGeom.addAttribute('size', attributeSizes);
var attributeColors = new THREE.BufferAttribute(colorsAttribute, 3);
bufferWrapGeom.addAttribute('color', attributeColors);
var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        texture: {
            value: dotTexture
        }
    },
    vertexShader: document.getElementById("wrapVertexShader").textContent,
    fragmentShader: document.getElementById("wrapFragmentShader").textContent,
    transparent:true
});
var wrap = new THREE.Points(bufferWrapGeom, shaderMaterial);
scene.add(wrap);

// Create white segments
var segmentsGeom = new THREE.Geometry();
var segmentsMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    vertexColors: THREE.VertexColors
});
for (i = dotsGeometry.vertices.length - 1; i >= 0; i--) {
    vector = dotsGeometry.vertices[i];
    for (var j = dotsGeometry.vertices.length - 1; j >= 0; j--) {
        if (i !== j && vector.distanceTo(dotsGeometry.vertices[j]) < 12) {
            segmentsGeom.vertices.push(vector);
            segmentsGeom.vertices.push(dotsGeometry.vertices[j]);
            segmentsGeom.colors.push(colors[vector.color]);
            segmentsGeom.colors.push(colors[vector.color]);
        }
    }
}
var segments = new THREE.LineSegments(segmentsGeom, segmentsMat);
galaxy.add(segments);

var hovered = [];
var prevHovered = [];
function render(a) {
    var i;
    dotsGeometry.verticesNeedUpdate = true;
    segmentsGeom.verticesNeedUpdate = true;
    
    raycaster.setFromCamera( mouse, camera );
    var intersections = raycaster.intersectObjects([wrap]);
    hovered = [];
    if (intersections.length) {
        for(i = 0; i < intersections.length; i++) {
            var index = intersections[i].index;
            hovered.push(index);
            if (prevHovered.indexOf(index) === -1) {
                onDotHover(index);
            }
         }
    }
    for(i = 0; i < prevHovered.length; i++){
        if(hovered.indexOf(prevHovered[i]) === -1){
            mouseOut(prevHovered[i]);
        }
    }
    prevHovered = hovered.slice(0);
    attributeSizes.needsUpdate = true;
    attributePositions.needsUpdate = true;
    renderer.render(scene, camera);
}

function onDotHover(index) {
    dotsGeometry.vertices[index].tl = new TimelineMax();
    dotsGeometry.vertices[index].tl.to(dotsGeometry.vertices[index], 1, {
        scaleX: 10,
        ease: Elastic.easeOut.config(2, 0.2),
        onUpdate: function() {
            attributeSizes.array[index] = dotsGeometry.vertices[index].scaleX;
        }
    });
}

function mouseOut(index) {
    dotsGeometry.vertices[index].tl.to(dotsGeometry.vertices[index], 0.4, {
        scaleX: 5,
        ease: Power2.easeOut,
        onUpdate: function() {
            attributeSizes.array[index] = dotsGeometry.vertices[index].scaleX;
        }
    });
}

function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

var mouse = new THREE.Vector2(-100,-100);
function onMouseMove(e) {
    var canvasBounding = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - canvasBounding.left) / width) * 2 - 1;
    mouse.y = -((e.clientY - canvasBounding.top) / height) * 2 + 1;
}

TweenMax.ticker.addEventListener("tick", render);
window.addEventListener("mousemove", onMouseMove);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});