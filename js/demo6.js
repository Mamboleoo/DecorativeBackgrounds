var canvas = document.querySelector('#scene');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x191919);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
camera.position.set(0, 0, 280);

var sphere = new THREE.Group();
scene.add(sphere);
var mat1 = new THREE.LineBasicMaterial({
    color:0x4a4a4a
});
var mat2 = new THREE.LineBasicMaterial({
    color:0x3F51B5
});

var radius = 100;
var lines = 50;
var dots = 50;
for(var i = 0; i < lines; i++) {
    var geometry = new THREE.Geometry();
    var line = new THREE.Line(this.geometry, (Math.random()>0.2)?mat1:mat2);
    line.speed = Math.random() * 300 + 250;
    line.wave = Math.random();
    line.radius = Math.floor(radius + (Math.random()-0.5) * (radius*0.2));
    for(var j=0;j<dots;j++){
        var x = ((j/dots) * line.radius * 2) - line.radius;
        var vector = new THREE.Vector3(x, 0, 0);
        geometry.vertices.push(vector);
    }
    line.rotation.x = Math.random() * Math.PI;
    line.rotation.y = Math.random() * Math.PI;
    line.rotation.z = Math.random() * Math.PI;
    sphere.add(line);
}

function updateDots (a) {
    var i, j, line, vector, y;
    for(i=0;i<lines;i++){
        line = sphere.children[i];
        for(j=0;j<dots;j++){
            vector = sphere.children[i].geometry.vertices[j];
            var ratio = 1 - ((line.radius - Math.abs(vector.x)) / line.radius);
            y = Math.sin(a/line.speed + j*0.15) * 12 * ratio;
            vector.y = y;
        }
        line.geometry.verticesNeedUpdate = true;
    }
}


function render(a) {
    requestAnimationFrame(render);
    updateDots(a);
    sphere.rotation.y = (a * 0.0001);
    sphere.rotation.x = (-a * 0.0001);
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


requestAnimationFrame(render);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});