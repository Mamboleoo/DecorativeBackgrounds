var canvas = document.querySelector('#scene');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x59c384);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
camera.position.set(0, 0, 80);

var loader = new THREE.TextureLoader();
loader.crossOrigin = "Anonymous";
var dotTexture = loader.load('img/dotTexture.png');

var radius = 50;
var sphereGeom = new THREE.IcosahedronGeometry(radius, 5);
var dotsGeom = new THREE.Geometry();
var bufferDotsGeom = new THREE.BufferGeometry();
var positions = new Float32Array(sphereGeom.vertices.length * 3);
for (var i = 0;i<sphereGeom.vertices.length;i++) {
    var vector = sphereGeom.vertices[i];
    animateDot(i, vector);
    dotsGeom.vertices.push(vector);
    vector.toArray(positions, i * 3);
}

function animateDot(index, vector) {
        TweenMax.to(vector, 4, {
            x: 0,
            z: 0,
            ease:Back.easeOut,
            delay: Math.abs(vector.y/radius) * 2,
            repeat:-1,
            yoyo: true,
            yoyoEase:Back.easeOut,
            onUpdate: function () {
                updateDot(index, vector);
            }
        });
}
function updateDot(index, vector) {
        positions[index*3] = vector.x;
        positions[index*3+2] = vector.z;
}

var attributePositions = new THREE.BufferAttribute(positions, 3);
bufferDotsGeom.addAttribute('position', attributePositions);
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
var dots = new THREE.Points(bufferDotsGeom, shaderMaterial);
scene.add(dots);

function render(a) {
    dots.geometry.verticesNeedUpdate = true;
    dots.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
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

var mouse = new THREE.Vector2(0.8, 0.5);
function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) - 0.5;
    mouse.y = (e.clientY / window.innerHeight) - 0.5;
    TweenMax.to(dots.rotation, 4, {
        x : (mouse.y * Math.PI * 0.5),
        z : (mouse.x * Math.PI * 0.2),
        ease:Power1.easeOut
    });
}

TweenMax.ticker.addEventListener("tick", render);
window.addEventListener("mousemove", onMouseMove);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});