//import { GLTFLoader } from "./libs/GLTFLoader";

var scene, camera, renderer, clock, binormal, normal, carPath, group;

init();

function init(){
  const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";


  
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  const envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox1_`)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
 	scene.background = envMap;
	
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 4, 57);//wide position
  camera.lookAt(0,1.5,0);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  group = new THREE.Group()
  scene.add(group)
  path()

  
  // const curve = new THREE.Curves.GrannyKnot();
  // const geometry = new THREE.TubeBufferGeometry( curve, 100, 2, 8, true );
  // const material = new THREE.MeshBasicMaterial({ wireframe:true, color: 0xffffff, side: THREE.DoubleSide });
  // tube = new THREE.Mesh( geometry, material );
  // group.add(tube);
  
  // binormal = new THREE.Vector3();
  // normal = new THREE.Vector3();
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function path(){


    //this.meshObject = new Group();
   //game.scene.add(this.meshObject);

   var ppoints = [

    [1.8117204904556274, 5.987488269805908, 0.29106736183166504],
    [6.005367279052734, 1.7647128105163574, -1.5591322183609009],
    [1.435487985610962, -6.016839504241943, 2.1336286067962646],
    [-4.118395805358887, -6.886471271514893, -0.7294682264328003],
    [-4.732693195343018, 3.405961036682129, 3.1304938793182373],
    [8.304193496704102, 7.593861103057861, 0.3412821292877197],
    [8.038525581359863, -4.391696453094482, 2.687108278274536],
    [1.488401174545288, -9.993440628051758, -2.2956111431121826],
    [-5.277090549468994, -8.481210708618164, -0.719127893447876],
    [-7.250330448150635, -0.9653520584106445, -0.3089699447154999],
    [-6.526705741882324, 5.678538799285889, 0.15560221672058105],
    [-0.885545015335083, 6.678538799285889, 1.5724562406539917],
    [1.614454984664917, 5.678538799285889, 0.24559785425662994],
    [1.8117204904556274, 5.987488269805908, 0.29106736183166504]

];

var points = [

  [-3, 3, 3],
  [-3, 0, -6],
  [6, -6, 3]


];


// const curve = new THREE.Curves.GrannyKnot();
// const geometry = new THREE.TubeBufferGeometry( curve, 100, 2, 8, true );
// const material = new THREE.MeshBasicMaterial({ wireframe:true, color: 0xffffff, side: THREE.DoubleSide });
// tube = new THREE.Mesh( geometry, material );
// scene.add(tube);

const world = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(2,1), new THREE.MeshBasicMaterial({wireframe: true, color: 0xffffff}))
world.position.set(0,0,0)

scene.add(world)


// const ageometry = new THREE.BufferGeometry();
// // create a simple square shape. We duplicate the top left and bottom right
// // vertices because each vertex needs to appear once per triangle.
// const vertices = new Float32Array( [
// 	-1.0, -1.0,  1.0,
// 	 1.0, -1.0,  1.0,
// 	 1.0,  1.0,  1.0,

// 	 1.0,  1.0,  1.0,
// 	-1.0,  1.0,  1.0,
// 	-1.0, -1.0,  1.0
// ] );

// // itemSize = 3 because there are 3 values (components) per vertex
// ageometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// const amaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
// const mesh = new THREE.Mesh( ageometry, amaterial );
// scene.add(mesh)

const getP = world

console.log(getP)

var scale = 0.5;

//Convert the array of points into vertices
for (var i = 0; i < points.length; i++) {
    var x = points[i][0] * scale;
    var y = points[i][1] * scale;
    var z = points[i][2] * scale;
    points[i] = new THREE.Vector3(x, z, -y);
}

//Create a path from the points
carPath = new THREE.CatmullRomCurve3(points);
var radius = 0.1;

var geometry = new THREE.TubeBufferGeometry(carPath, 64, radius, 5, true);

//Set a different color on each face
// for (var i = 0, j = geometry.faces.length; i < j; i++) {
// geometry.faces[i].color = new THREE.Color(
// "hsl(" + Math.floor(Math.random() * 290) + ",50%,50%)"
// );
// }

var material = new THREE.MeshBasicMaterial({
    //side: THREE.DoubleSide,
    //vertexColors: THREE.FaceColors,
    color: 0xff0000,
    wireframe: true,
    //side: THREE.DoubleSide,
    //transparent: true
    visible: true
    //opacity: 1
});
const tube = new THREE.Mesh(geometry, material);
tube.position.set(0,0,0);
//this.meshObject.add(tube);
group.add(tube);


////
binormal = new THREE.Vector3();
normal = new THREE.Vector3();

infoPath()
}

function infoPath(){
  var size = 0.005;
  var meshList = [];
  
  for (var i = 0; i < carPath.points.length; i++) {
  var x = carPath.points[i].x;
  var y = carPath.points[i].y;
  var z = carPath.points[i].z;
  
  var geometry = new THREE.TorusGeometry(0.1, 0.05, 8, 50);
  var material = new THREE.MeshBasicMaterial({
  color: new THREE.Color("yellow")
  });
  var secondObject = new THREE.Mesh(geometry, material);
  //var secondObject = new Screen(this.game, "Hexlibrium", 0.2, 13, true);
  secondObject.position.set(x, y , z); //x, y + 0.75, z
  //secondObject.scale.set(size, size, size);
  meshList.push(secondObject);
  scene.add(secondObject);
  }
  }

function environment(){

    const loader = new THREE.GLTFLoader();//.setPath(`${this.assetsPath}planet/`);
      
      //loadingBar.visible = true;
  
  // Load a glTF resource
  loader.load('./assets/planet.glb',
    // called when the resource is loaded
    gltf => {

      scene.add( gltf.scene );
      const  planet = gltf.scene;

      //this.planet.scale.set(10,10,10);
      planet.position.set(0,0,0); //(0,-3,-4.5);
      console.log(planet)

      gltf.scene.traverse( child => {
        if (child.isMesh){

             child.castShadow = true;
             child.receiveShadow = true;

        }
      });


    });
}	

environment();

function updateCamera(){
  const time = clock.getElapsedTime();
  const looptime = 20;
	const t = ( time % looptime ) / looptime;
  const t2 = ( (time + 0.1) % looptime) / looptime
	
  // const pos = group.geometry.parameters.path.getPointAt( t );
  // const pos2 = group.geometry.parameters.path.getPointAt( t2 );

  // camera.position.copy(pos);
  // camera.lookAt(pos2);


  // const percentage += 0.00045;
  // var p1 = this.carPath.getPointAt(this.percentage % 1);
  // var p2 = this.carPath.getPointAt((this.percentage + 0.01) % 1);
  // this.p3 = this.carPath.getPointAt((this.percentage + 0.01 / 2) % 1);
  // var p4 = this.carPath.getPointAt((this.percentage + 0.01 / 4) % 1);

  //camera.lookAt(p2);
  const p1 = carPath.getPointAt(t)
  const p2 = carPath.getPointAt(t2)

  //group.position.set(p1.x, p1.y + 0.25, p1.z);
  //group.lookAt(p2);
  camera.position.copy(p1);
  camera.lookAt(p2)
}

function update(){
  requestAnimationFrame( update );
  updateCamera();
	renderer.render( scene, camera );  
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}