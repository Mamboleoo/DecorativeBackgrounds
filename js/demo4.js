var canvas = document.querySelector('canvas');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x000000,0);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
camera.position.set(0, 0, 350);

var sphere = new THREE.Group();
scene.add(sphere);
var material = new THREE.LineBasicMaterial({
    color: 0xfe0e55
});
var linesAmount = 18;
var radius = 100;
var verticesAmount = 50;
for(var j=0;j<linesAmount;j++){
    var index = j;
    var geometry = new THREE.Geometry();
    geometry.y = (index/linesAmount) * radius*2;
    for(var i=0;i<=verticesAmount;i++) {
        var vector = new THREE.Vector3();
        vector.x = Math.cos(i/verticesAmount * Math.PI*2);
        vector.z = Math.sin(i/verticesAmount * Math.PI*2);
        vector._o = vector.clone();
        geometry.vertices.push(vector);
    }
    var line = new THREE.Line(geometry, material);
    sphere.add(line);
}

function updateVertices (a) {
 for(var j=0;j<sphere.children.length;j++){
     var line = sphere.children[j];
     line.geometry.y += 0.3;
     if(line.geometry.y > radius*2) {
         line.geometry.y = 0;
     }
     var radiusHeight = Math.sqrt(line.geometry.y * (2*radius-line.geometry.y));
     for(var i=0;i<=verticesAmount;i++) {
         var vector = line.geometry.vertices[i];
            var ratio = noise.simplex3(vector.x*0.009, vector.z*0.009 + a*0.0006, line.geometry.y*0.009) * 15;
            vector.copy(vector._o);
            vector.multiplyScalar(radiusHeight + ratio);
            vector.y = line.geometry.y - radius;
        }
     line.geometry.verticesNeedUpdate = true;
 }
}

function render(a) {
    requestAnimationFrame(render);
    updateVertices(a);
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
    mouse.y = e.clientY / window.innerHeight;
    TweenMax.to(sphere.rotation, 2, {
        x : (mouse.y * 1),
        ease:Power1.easeOut
    });
}

requestAnimationFrame(render);
window.addEventListener("mousemove", onMouseMove);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});