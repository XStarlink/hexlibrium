//Move >>> 
    //pathfinding

//Take >>> 
    //getter
    //setter

//Assemble
    //montar
    //desmontar
    //separar
    //classificar
    //soldar
    //pintar

//Play
    
import * as THREE from '/libs5/three128/three.module.js';
import { GLTFLoader } from '/libs5/three128/GLTFLoader.js';
import { RGBELoader } from '/libs5/three128/RGBELoader.js';
import { FBXLoader } from '/libs5/three128/FBXLoader.js';
import { STLLoader } from '/libs5/three128/STLLoader.js';
import { NPCHandler } from './NPCHandler.js';
import { NPCHandler65 } from './NPCHandler65.js';
import { LoadingBar } from '/libs5/LoadingBar.js';
import { Pathfinding } from '/libs5/pathfinding/Pathfinding.js';
import { User } from './User.js';
import { Controller } from './Controller.js';
import { BulletHandler } from './BulletHandler.js';
import { UI } from './Interface.js';
import { EffectComposer } from '/libs5/three128/pp/EffectComposer.js';
import { RenderPass } from '/libs5/three128/pp/RenderPass.js';
import { ShaderPass } from '/libs5/three128/pp/ShaderPass.js';
import { GammaCorrectionShader } from '/libs5/three128/pp/GammaCorrectionShader.js';
import { Tween } from '/libs5/Toon3D.js';
import { SFX } from '/libs5/SFX.js';
//import { Mech } from './Mechanics.js';
//import { Blockly } from './Blockly.js';
import { SpeechBubble } from './SpeechBubble.js';
import { Turtle } from './Turtle.js';
//import * as d3 from "d3";


class Mech{
    constructor(game){
        this.assetsPath = '/src/assets/';

        this.contextAction();
        this.globe();
        
        this.game = game;



  // var objects = {},
  //     objectCache = [];

  // // Simple hash function to ensure we only have unique blocks
  // function computeHash(x, y, z) {
  //   var p1 = 73856093,
  //       p2 = 19349663,
  //       p3 = 83492791,
  //       n = 1;

  //   return (p1 * x + p2 * y + p3 * z);
  // }


  // // Caches the objects so we can easily return them
  // function cacheObjects() {
  //   objectCache = [];
  //   for(var n in objects) {
  //     objectCache.push(objects[n]);
  //   }
  // }


}

contextAction(){

}

globe(){
// //===================================================== add Scene
// var scene = new THREE.Scene();
// //===================================================== add Camera
// var camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   1,
//   10000
// );
// camera.position.x = 0;
// camera.position.y = 1;
// camera.position.z = 275;
// //===================================================== add front & back lighting
// var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
// light.position.set(1, 3, 2).normalize();
// scene.add(light);

// var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
// light.position.set(-1, -3, -2).normalize();
// scene.add(light);
// //===================================================== add Grid
// /*  var plane = new THREE.GridHelper(5000, 10);
//   plane.material.color = new THREE.Color( 'white');
//   scene.add(plane);*/

// //===================================================== add canvas
// var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.toneMapping = THREE.LinearToneMapping;
// document.body.appendChild(renderer.domElement);

// //===================================================== add controls
// var controls = new THREE.OrbitControls(camera, renderer.domElement);

// //===================================================== add GLow
// var renderScene = new THREE.RenderPass(scene, camera);
// var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
// effectFXAA.uniforms["resolution"].value.set(
//   1 / window.innerWidth,
//   1 / window.innerHeight
// );
// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.renderToScreen = true;

// var bloomStrength = 1;
// var bloomRadius = 0;
// var bloomThreshold = 0.5;
// var bloomPass = new THREE.UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   bloomStrength,
//   bloomRadius,
//   bloomThreshold
// );

// var composer = new THREE.EffectComposer(renderer);
// composer.setSize(window.innerWidth, window.innerHeight);
// composer.addPass(renderScene);
// composer.addPass(effectFXAA);
// composer.addPass(bloomPass);
// composer.addPass(copyShader);

// //===================================================== resize
// window.addEventListener("resize", function() {
//   let width = window.innerWidth;
//   let height = window.innerHeight;
//   renderer.setSize(width, height);
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
// });

//===================================================== data
const our_data = [
  {
    origin: { name: "Bogotá", latitude: 4.624335, longitude: -74.063644 },
    destination: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 }
  },
  {
    origin: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 },
    destination: { name: "Miami", latitude: 25.761681, longitude: -80.191788 }
  },
  {
    origin: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 },
    destination: { name: "New York", latitude: 40.73061, longitude: -73.935242 }
  },
  {
    origin: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 },
    destination: { name: "Britain", latitude: 51.509865, longitude: -0.118092 }
  },
  {
    origin: { name: "New York", latitude: 40.73061, longitude: -73.935242 },
    destination: { name: "Britain", latitude: 51.509865, longitude: -0.118092 }
  }
];

//===================================================== helper functions
const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num);

const DEGREE_TO_RADIAN = Math.PI / 180;

function coordinateToPosition(lat, lng, radius) {
  const phi = (90 - lat) * DEGREE_TO_RADIAN;
  const theta = (lng + 180) * DEGREE_TO_RADIAN;

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

//===================================================== d3.json
d3.json(
  "https://raw.githubusercontent.com/baronwatts/data/master/world.json",
  function(err, data) {
    //===================================================== crate canvas texturefor the globe
    var projection = d3.geo
      .equirectangular()
      .translate([1024, 512])
      .scale(0.2);//326

    var countries = topojson.feature(data, data.objects.countries);

    var canvas = d3
      .select("body")
      .append("canvas")
      .style("display", "none")
      .attr("width", "2048px")
      .attr("height", "1024px");

    var context = canvas.node().getContext("2d");

    var path = d3.geo
      .path()
      .projection(projection)
      .context(context);

    context.strokeStyle = "white";
    context.lineWidth = 0.025;
    context.fillStyle = "#000";

    context.beginPath();

    path(countries);

    context.fill();
    context.stroke();

    var mapTexture = new THREE.Texture(canvas.node());
    mapTexture.needsUpdate = true;

    //===================================================== add globe
    var group = new THREE.Group();
    scene.add(group);
    group.rotateX(Math.PI / 8);

    var RADIUS = 1;

    var sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);
    var sphereMaterial = new THREE.MeshPhongMaterial({
      map: mapTexture,
      transparent: true,
      opacity: 1,
      color: new THREE.Color("white")
    });
    var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = "earth";
    group.add(earthMesh);

    //===================================================== add glow effect to globe
    var customMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    var ballGeometry = new THREE.SphereGeometry(170, 60, 60);
    var ball = new THREE.Mesh(ballGeometry, customMaterial);
    scene.add(ball);

    //===================================================== lng & lat
    function Destination(array) {
      array.map((d, i) => {
        //convert lng & lat coordinates to 3d space
        var startLat = d.origin.latitude;
        var startLng = d.origin.longitude;

        var endLat = d.destination.latitude;
        var endLng = d.destination.longitude;

        var x = -(
          RADIUS *
          Math.sin((90 - startLat) * (Math.PI / 180)) *
          Math.cos((startLng + 180) * (Math.PI / 180))
        );
        var z =
          RADIUS *
          Math.sin((90 - startLat) * (Math.PI / 180)) *
          Math.sin((startLng + 180) * (Math.PI / 180));
        var y = RADIUS * Math.cos((90 - startLat) * (Math.PI / 180));

        var x2 = -(
          RADIUS *
          Math.sin((90 - endLat) * (Math.PI / 180)) *
          Math.cos((endLng + 180) * (Math.PI / 180))
        );
        var z2 =
          RADIUS *
          Math.sin((90 - endLat) * (Math.PI / 180)) *
          Math.sin((endLng + 180) * (Math.PI / 180));
        var y2 = RADIUS * Math.cos((90 - endLat) * (Math.PI / 180));

        //store the starting and ending positions of each location
        var start = new THREE.Vector3(x, y, z);
        var end = new THREE.Vector3(x2, y2, z2);

        //points
        var pointGeom = new THREE.SphereGeometry(1, 10, 10);
        var point = new THREE.Mesh(
          pointGeom,
          new THREE.MeshBasicMaterial({ color: new THREE.Color("white") })
        );
        var point2 = new THREE.Mesh(
          pointGeom,
          new THREE.MeshBasicMaterial({ color: new THREE.Color("white") })
        );

        //spaces out the points
        point.position.set(x, y, z);
        point2.position.set(x2, y2, z2);
        point.lookAt(new THREE.Vector3(0, 0, 0));
        point2.lookAt(new THREE.Vector3(0, 0, 0));
        group.add(point);
        group.add(point2);

        //https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
        const CURVE_MIN_ALTITUDE = 20;
        const CURVE_MAX_ALTITUDE = 100;
        const altitude = clamp(
          start.distanceTo(end) * 0.75,
          CURVE_MIN_ALTITUDE,
          CURVE_MAX_ALTITUDE
        );

        //get the middle position of each location
        var lat = [startLng, startLat];
        var lng = [endLng, endLat];
        var geoInterpolator = d3.geoInterpolate(lat, lng);

        const midCoord1 = geoInterpolator(0.25);
        const midCoord2 = geoInterpolator(0.75);

        const mid1 = coordinateToPosition(
          midCoord1[1],
          midCoord1[0],
          RADIUS + altitude
        );
        const mid2 = coordinateToPosition(
          midCoord2[1],
          midCoord2[0],
          RADIUS + altitude
        );

        //create bezier curve from the lng & lat positions
        var curve = new THREE.CubicBezierCurve3(start, mid1, mid2, end);
        var g = new THREE.TubeGeometry(curve, 100, 0.35, 10, false);
        var m = new THREE.MeshBasicMaterial({
          color: new THREE.Color(
            "hsl(" + Math.floor(Math.random() * 360) + ",50%,50%)"
          )
        });
        curveObject = new THREE.Mesh(g, m);
        group.add(curveObject);
      });
    } //end Destination()

    Destination(our_data);

    //===================================================== add Animation
    function update(dt) {
      // requestAnimationFrame(animate);
      // renderer.render(scene, camera);
      // composer.render();
    }
    //animate();
  }
); //end d3.json

}   

// fire(mode){
//     //console.log(`Fire:${mode}`);
//     //if (this.game.active) this.user.firing = mode;
// }

}

export { Mech };