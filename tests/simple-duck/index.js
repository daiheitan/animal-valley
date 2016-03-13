var parser = new vox.Parser();

var scene, camera, renderer, mesh;

init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;


  var param = { voxelSize: 5 };
  parser.parse('../../models/duck.vox').then(function(voxelData) {
    var builder = new Vox.MeshBuilder(voxelData, param);
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
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
  }

  renderer.render( scene, camera );

}
