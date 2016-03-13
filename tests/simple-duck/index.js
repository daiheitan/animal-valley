var parser = new vox.Parser();

var scene, camera, renderer, mesh;
var updateListeners = [];
var update = function(frame) {
    updateListeners.forEach(function(listener) {
        listener(frame);
    });
};
var frame = 0;

init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;
  var cameraTarget = new THREE.Vector3(0, 0, 0);
  updateListeners.push(function(frame) {
      camera.position.x = Math.cos(frame * 0.004) * 100;
      camera.position.y = 50;
      camera.position.z = Math.sin(frame * 0.004) * 100;
      camera.lookAt(cameraTarget);
  });

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  updateListeners.push(function(frame) {
      directionalLight.position.x = Math.cos(frame * -0.001) * 100;
      directionalLight.position.y = 100;
      directionalLight.position.z = Math.sin(frame * -0.001) * 100;
  });
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambientLight);

  var param = { voxelSize: 0.5 };
  parser.parse('../../models/duck_c.vox').then(function(voxelData) {
    var builder = new vox.MeshBuilder(voxelData, param);
    mesh = builder.createMesh();
    scene.add(mesh);
  })

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

}

function animate() {
  requestAnimationFrame( animate );
  if (mesh) {
    frame++;
    update(frame++)
  }

  renderer.render( scene, camera );

}
