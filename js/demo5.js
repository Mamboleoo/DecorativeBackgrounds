var canvas = document.querySelector('#scene');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x0F1617);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 0, 100);

var geometry = new THREE.SphereGeometry(30, 4, 30);
var geometry = new THREE.BoxGeometry(49, 49, 49, 7, 7, 7);
for(var i=0;i<geometry.faces.length;i++){
    var face = geometry.faces[i];
    var vector = geometry.vertices[face.c];
    var v1 = geometry.vertices[face.a];
    var v2 = geometry.vertices[face.b];
    var v3 = geometry.vertices[face.c];

    var center = new THREE.Vector3();
    center.add(v1).add(v2).add(v3).divideScalar(3);

    face.materialIndex = Math.floor(center.y + 25) % 14 < 7 ? 0 : 1;
    if (center.y === 24.5) {
        face.materialIndex = 0;
    }
    if (face.materialIndex === 0) {
        face.materialIndex = Math.floor(center.x + 25) % 14 < 7 ? 0 : 1;
        if (center.x === 24.5) {
            face.materialIndex = 0;
        }
    }
}
for(var i=0;i<geometry.vertices.length;i++){
    var vector = geometry.vertices[i];
    vector._o = new THREE.Vector3().copy(vector);
}

var material = [
new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity:0
}),
new THREE.MeshBasicMaterial({
    color: 0x13756a,
    side: THREE.DoubleSide,
    wireframe: true
})];
var sphere = new THREE.Mesh( geometry, material );
TweenMax.to(sphere.rotation, 80, {
    y:Math.PI * 2,
    x: Math.PI * 2,
    ease:Power0.easeNone,
    repeat:-1
});
scene.add( sphere );

function render(a) {
    requestAnimationFrame(render);
    for(var i = 0; i < geometry.vertices.length; i++){
        var vector = geometry.vertices[i];
        var ratio = noise.simplex3((vector._o.x*0.01), (vector._o.y*0.01)+(a*0.0005), (vector._o.z*0.01));
        vector.copy(vector._o);
        vector.multiplyScalar(1 + (ratio*0.1));
        vector.multiplyScalar(1);
    }
    geometry.verticesNeedUpdate = true;
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