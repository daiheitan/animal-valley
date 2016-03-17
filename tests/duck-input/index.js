var scene, camera, renderer, mesh, controls;
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

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set(-10, 10, 10)
  camera.up = new THREE.Vector3(0, 0, 1)
  camera.lookAt(0, 0, 0);
  
  controls = new THREE.TrackballControls( camera );

  controls.rotateSpeed = 10.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];
  controls.target.set(0, 0, 0)

  var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
  scene.add( ambientLight );
  
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );
  
  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -1, 1.75, 1 );
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  var d = 50;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.ias = -0.0001;

  mixer = new THREE.AnimationMixer(scene);
  var loader = new THREE.ObjectLoader();
  loader.load('./duck3.json', function(obj) {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        // child.material.map = texture;
        child.material.shading = THREE.FlatShading;
        // child.material.skinning = true;
        if (child.geometry.animations) {
          var action = mixer.clipAction(child.geometry.animations[0], child);
          // action.setEffectiveWeight(1);
          // action.setLoop(THREE.LoopOnce, 0);
          // action.clampWhenFinished = true;
          action.play();
        }
      }
    });
    mesh = obj;
    // obj.rotation.set(0, - Math.PI / 2, 0.6)
    obj.position.set(0, 0, 5)
    scene.add(obj);
    // debugger
    updateListeners.push(function(frame) {
      var delta = clock.getDelta();
      mixer.update(delta);
    });
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xFFFFFF);
  renderer.setSize( window.innerWidth, window.innerHeight );

  // controls = new THREE.OrbitControls( camera, renderer.domElement );
  // //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.25;
  document.body.appendChild( renderer.domElement );

}

function animate() {
  requestAnimationFrame( animate );
  if (mesh) {
    frame++;
    update(frame++)
  }
  controls.update()
  renderer.render( scene, camera );

}
