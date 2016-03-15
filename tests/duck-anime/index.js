var scene, camera, renderer, mesh;
var animation, mixer, clock = new THREE.Clock();
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

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  var cameraTarget = new THREE.Vector3(0, 0, 0);
  camera.position.set(100, 100, 200);
  camera.lookAt(cameraTarget);
  
  
  var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
  scene.add( ambientLight );
  var texture = new THREE.Texture();
  var imgLoader = new THREE.ImageLoader();
  imgLoader.load('exported_texture0.png', function(image) {
    texture.image = image;
    texture.needsUpdate = true;
  });
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearFilter ;
  
  mixer = new THREE.AnimationMixer(scene);
  var loader = new THREE.ObjectLoader();
  loader.load('./duck.json', function(obj) {
    obj.scale.set(10, 10, 10);
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture;
        child.material.skinning = true;
        if (child.geometry.animations) {
          var action = mixer.clipAction(child.geometry.animations[0], child);
          action.setEffectiveWeight(1);
          // action.setLoop(THREE.LoopOnce, 0);
          // action.clampWhenFinished = true;
          action.play();
        }
      }
    });
    mesh = obj;
    scene.add(obj);
    updateListeners.push(function(frame) {
      var delta = clock.getDelta();
      mixer.update(delta);
      obj.rotation.y = Math.cos(frame * 0.01);
    });
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x999999);
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
