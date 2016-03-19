var scene, camera, renderer, mesh, controls;
var mixer, clock = new THREE.Clock(), actions, currentAction;
var updateListeners = [];
var update = function(frame) {
    updateListeners.forEach(function(listener) {
        listener(frame);
    });
};
var frame = 0, currentKey = undefined, moveSpeed = 2
var KEY_MAP = {
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right'
}

init();
animate();

function bindKeyboard() {
  window.addEventListener('keydown', function(e) {
    var key = e.keyCode;
    currentKey = KEY_MAP[key];
    update();
  })
  
  window.addEventListener('keyup', function() {
    currentKey = undefined;
    update();
  })
}

function fadeTo(name) {
  if (currentAction === name) return;
  var from = actions[currentAction].play();
  var to = actions[name].play();
  frame.enabled = to.enabled = true;
  from.crossFadeTo(to, 0.3);
  currentAction = name;
}

function init() {
  actions = {};
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set(5, 5, 30)
  // camera.up = new THREE.Vector3(0, 0, 1)
  camera.lookAt(0, 0, 0);
  
  controls = new THREE.TrackballControls( camera );

  controls.rotateSpeed = 1.0;
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

  var axisHelper = new THREE.AxisHelper(500);
  scene.add(axisHelper);
  var loader = new THREE.ObjectLoader();
  loader.load('./duck.json', function(obj) {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        // child.rotation.set(-0.6, 1, 0.4)
        child.material.shading = THREE.FlatShading;
        child.material.skinning = true;
        if (child.geometry.animations) {
          mixer = new THREE.AnimationMixer(child);
          child.geometry.animations.forEach(function(animation) {
            actions[animation.name] = mixer.clipAction(animation, child);
            actions[animation.name].setEffectiveWeight(1);
          });
          // action.setLoop(THREE.LoopOnce, 0);
          // action.clampWhenFinished = true;
          currentAction = 'Rest';
          actions.Rest.play();
        }
      }
    });
    mesh = obj;
    obj.position.set(0, 0, 5)
    scene.add(obj);
    // debugger
    updateListeners.push(function() {
      var delta = clock.getDelta();
      mixer.update(delta);
      if (currentKey) {
        fadeTo('Walk')
        if (currentKey === 'up') {
          mesh.position.z += delta * moveSpeed;
          mesh.rotation.y = 0;
        }
        else if (currentKey === 'down') {
          mesh.position.z -= delta * moveSpeed;
          mesh.rotation.y = - Math.PI;
        }
        else if (currentKey === 'left') {
          mesh.position.x -= delta * moveSpeed;
          mesh.rotation.y = - Math.PI / 2;
        } else if (currentKey === 'right') {
          mesh.position.x += delta * moveSpeed;
          mesh.rotation.y = Math.PI / 2;
        }
      } else fadeTo('Rest')
    });
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xFFFFFF);
  renderer.setSize( window.innerWidth, window.innerHeight );

  // controls = new THREE.OrbitControls( camera, renderer.domElement );
  // //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.25;
  bindKeyboard();
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
