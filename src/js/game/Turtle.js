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
import { Mech } from './Mechanics.js';
import { SpeechBubble } from './SpeechBubble.js';
import { DRACOLoader } from '/libs5/three128/DRACOLoader.js';
import { Group, Object3D } from '/libs5/three128/three.module.js';

class Turtle{
constructor(game){
    this.game = game;

    this.group = new Group(); 
    game.scene.add(this.group);
    
    this.carPath;
    this.meshList = [];
    this.percentage = 0;

    this.path();
    this.loadTurtle();
    this.infoPath();
    //this.collisionDetection();
    
    //this.anime();
    //this.animate();

    //posit = this.group.position ;
    
    //this.startInfo = { poss: poss.clone() };
    //this.p3 = poss;


}

set position(poss){
    //this.root.position.copy( pos );
    this.group.position.copy( poss );
 }
 
 get position(){
    return this.group.position;
 }

path(){

    //this.meshObject = new Group();
   //game.scene.add(this.meshObject);

    var points = [

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

    var scale = 0.5;

    //Convert the array of points into vertices
    for (var i = 0; i < points.length; i++) {
        var x = points[i][0] * scale;
        var y = points[i][1] * scale;
        var z = points[i][2] * scale;
        points[i] = new THREE.Vector3(x, z, -y);
    }

    //Create a path from the points
    this.carPath = new THREE.CatmullRomCurve3(points);
    var radius = 0.025;

    var geometry = new THREE.TubeBufferGeometry(this.carPath, 64, radius, 5, true);

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
        wireframe: false,
        //side: THREE.DoubleSide,
        //transparent: true
        visible: false
        //opacity: 1
    });
    const tube = new THREE.Mesh(geometry, material);
    tube.position.set(0,0.2,0);
    //this.meshObject.add(tube);
    this.game.scene.add(tube);

    
}

loadTurtle(){
    
        const loader = new GLTFLoader( ).setPath(`${this.game.assetsPath}glb/`);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/libs5/three128/draco/' );
        loader.setDRACOLoader( dracoLoader );
        
        // Load a glTF resource
        loader.load(
            // resource URL
            'turtle.glb',
            // called when the resource is loaded
            gltf => {
     
                //this.group.add( gltf.scene );
                
                this.firstObject = gltf.scene;
                this.group.add( this.firstObject );
                
                this.firstObject.castShadow = true; //added
                this.firstObject.name = "Turtle"; //added
     
                //this.firstObject.frustumCulled = false;
     
                const scale = 0.1;
                this.firstObject.scale.set(scale, scale, scale);
                this.firstObject.position.set(0, 0, 0);
                this.firstObject.rotation.set(Math.PI/2, 0, 0);
     
               
     
                this.firstObject.traverse( child => {
                    if ( child.isMesh){
                        child.castShadow = true;
                        //child.frustumCulled = false;
                        //if (child.name.includes('Thumb2.R_end')) this.rifle = child; //Rifle  Thumb2.R_end
                    }
                });
     
                // if (this.rifle){
                //     const geometry = new BufferGeometry().setFromPoints( [ new Vector3( 0, 0, 0 ), new Vector3( 1, 0, 0 ) ] );
     
                //     const line = new Line( geometry );
                //     line.name = 'aim';
                //     line.scale.x = 50;
     
                //     this.rifle.add(line);
                //     line.position.set(0, 0, 0.5);
                //     this.aim = line;
                //     line.visible = false;
                // }
     
                //  this.animations = {};
     
                // gltf.animations.forEach( animation => {
                //     this.animations[animation.name.toLowerCase()] = animation;
                // })
     
                // //this.mixer = new AnimationMixer(gltf.scene);
                // this.mixer = new AnimationMixer(firstObject);
     
                // this.mixer.addEventListener('Death', function(){ //added
                //     this.action = 'Death'; //added
                //     //this.game.ui.toggleBriefcase();
                // })
            
                // this.action = 'Yes'; 
     
                // this.ready = true;
     
                // this.game.startRendering();
            }//,
            // called while loading is progressing
            // xhr => {
            //     this.loadingBar.update( 'user', xhr.loaded, xhr.total );
            // },
            // // called when loading has errors
            // err => {
            //     console.error( err );
            // }
        );
           
}

//===================================================== add model

infoPath(){
var size = 0.005;
// var meshList = [];

for (var i = 0; i < this.carPath.points.length; i++) {
var x = this.carPath.points[i].x;
var y = this.carPath.points[i].y;
var z = this.carPath.points[i].z;

var geometry = new THREE.TorusGeometry(3, 0.5, 8, 50);
var material = new THREE.MeshBasicMaterial({
color: new THREE.Color("yellow")
});
//var secondObject = new THREE.Mesh(geometry, material);
var secondObject = new SpeechBubble(this.game, "Hexlibrium", 0.2, 13, true);
secondObject.mesh.position.set(x, y + 0.75, z);
//secondObject.scale.set(size, size, size);
this.meshList.push(secondObject);
this.game.scene.add(secondObject);
}
}
//===================================================== Collision Detection
PlaySound() {
bflat.play();
}

collisionDetection(){

//calculate distance of the main object
const firstBB = new THREE.Box3().setFromObject(this.group);

//calculate distance for all other objects
for (var i = 0; i < this.meshList.length; i++) {
const secondBB = new THREE.Box3().setFromObject(this.meshList[i]);
}
}


hit() {
var count = 0;    
//recalculate distance for the main object
const firstBB = new THREE.Box3().setFromObject(this.group);
//recalcuate distance for all the other objects
for (var i = 0; i < this.meshList.length; i++) {
const secondBB = new THREE.Box3().setFromObject(this.meshList[i]);

if (firstBB.isIntersectionBox(secondBB)) {
PlaySound();
info.style.color = "hsl(" + Math.floor(Math.random() * 290) + ",50%,50%)";
info.innerHTML =
Math.random() > 0.25
? "Superb!"
: Math.random() > 0.25 ? "Oustanding!" : "Awesome!";

TweenLite.to(info, 0.75, {
css: { fontSize: "50px", opacity: 1 },
ease: Power4.easeOut,
onComplete: function() {
TweenLite.to(info, 0.75, {
css: { fontSize: "14px", opacity: 0 },
ease: Power4.easeOut
}); //end tween
} //end onComplete
}); //end tween
} //end if
} //end for
} //end hit



bloom(){
//===================================================== bloom
var renderScene = new THREE.RenderPass(scene, camera);
var shaderActive = "none";
var gui = new dat.GUI();
dat.GUI.toggleHide();
var composer;

var parameters = {
x: 0,
y: 30,
z: 0,
bloomStrength: 1.0,
bloomRadius: 1.0,
bloomThreshold: 0.45,
useShaderNone: function() {
setupShaderNone();
},
useShaderBloom: function() {
setupShaderBloom();
}
};

gui.add(parameters, "useShaderNone").name("Display Original Scene");

var folderBloom = gui.addFolder("Bloom");
var bloomStrengthGUI = folderBloom
.add(parameters, "bloomStrength")
.min(0.0)
.max(2.0)
.step(0.01)
.name("Strength")
.listen();
bloomStrengthGUI.onChange(function(value) {
setupShaderBloom();
});
var bloomRadiusGUI = folderBloom
.add(parameters, "bloomRadius")
.min(0.0)
.max(5.0)
.step(0.01)
.name("Radius")
.listen();
bloomRadiusGUI.onChange(function(value) {
setupShaderBloom();
});
var bloomThresholdGUI = folderBloom
.add(parameters, "bloomThreshold")
.min(0)
.max(0.99)
.step(0.01)
.name("Threshold")
.listen();
bloomThresholdGUI.onChange(function(value) {
setupShaderBloom();
});
folderBloom.add(parameters, "useShaderBloom").name("Use Bloom Shader");
folderBloom.open();

}
//===================================================== functions


setupShaderNone() {
shaderActive = "none";
}

setupShaderBloom() {
composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

/*unreal bloom*/
var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
1 / window.innerWidth,
1 / window.innerHeight
);

var copyShader = new THREE.ShaderPass(THREE.CopyShader);
copyShader.renderToScreen = true;

var bloomPass = new THREE.UnrealBloomPass(
new THREE.Vector2(window.innerWidth, window.innerHeight),
parameters.bloomStrength,
parameters.bloomRadius,
parameters.bloomThreshold
);

composer = new THREE.EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(bloomPass);
composer.addPass(copyShader);
shaderActive = "bloom";
}

isShaderActive() {
if (shaderActive == "none") {
renderer.render(scene, camera);
} else {
composer.render();
}
}

//active bloom on load
//setupShaderBloom();

//===================================================== Animate

//anime(){
update(dt, mode) {
        
        //this.hit();
this.p3;

        //
        //return posit;


var prevTime = Date.now();

//function POV() {
this.percentage += 0.00045;
var p1 = this.carPath.getPointAt(this.percentage % 1);
var p2 = this.carPath.getPointAt((this.percentage + 0.01) % 1);
this.p3 = this.carPath.getPointAt((this.percentage + 0.01 / 2) % 1);
var p4 = this.carPath.getPointAt((this.percentage + 0.01 / 4) % 1);

//camera.lookAt(p2);


this.group.position.set(this.p3.x, this.p3.y + 0.25, this.p3.z);
this.group.lookAt(p2);

// game.user.root.position.set(p3.x, p3.y + 0.25, p3.z);
// game.user.root.lookAt(p2);
// camera.position.x = p4.x + 2;
// camera.position.y = p4.y + 1;
// camera.position.z = p4.z + 2;
// camera.lookAt(group.position);
//}
//

//game.user.initJourney = mode;

//return mode;
}

// update(dt) {

// this.anime();
// this.hit();
// //var delta = clock.getDelta();
// //if (mixer != null) mixer.update(dt);

// // //VR
// // if (VR) {
// // effect.render(scene, camera);
// // } else {
// // //renderer.render( scene, camera );
// // isShaderActive();
// // }

// //requestAnimationFrame(animate);
// //controls.update();

// }

//animate();

//set camera position

cameraPosition(){

camera.position.x = 40;
camera.position.y = 50;
camera.position.z = 50;

}


}

export { Turtle };



