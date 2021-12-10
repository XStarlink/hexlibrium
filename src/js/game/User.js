import * as THREE from '/libs5/three128/three.module.js';
import { Group, 
    Object3D,
    Vector3,
    Quaternion,
    Raycaster,
    AnimationMixer, 
    SphereGeometry, 
    MeshBasicMaterial, 
    Mesh,
    BufferGeometry,
    Line,
    LoopOnce
   } from '/libs5/three128/three.module.js';
import { GLTFLoader } from '/libs5/three128/GLTFLoader.js';
import { DRACOLoader } from '/libs5/three128/DRACOLoader.js';
import { SFX } from '/libs5/SFX.js';
import { FBXLoader } from '/libs5/three128/FBXLoader.js';
//import { Turtle } from './Turtle';

class User{
constructor(game, pos, heading){
   this.root = new Group();
   this.root.position.copy( pos );
   //game.turtle.position.copy( posi );

   this.root.rotation.set( 0, heading, 0, 'XYZ' );

   this.startInfo = { pos: pos.clone(), heading };

   this.game = game;

   this.camera = game.camera;
   this.raycaster = new Raycaster();

   game.scene.add(this.root);

   this.loadingBar = game.loadingBar;

   this.load();

   this.tmpVec = new Vector3();
   this.tmpQuat = new Quaternion();

   this.speed = 0;
   this.isFiring = false;

   this.ready = false;

   //this.initMouseHandler(); //comment
  //this.initJourney();
   this.initRifleDirection();

   

 
}

// toggleBriefcase(){
//     const briefcase = document.getElementById("briefcase");
//     const open = (briefcase.style.opacity > 0);
    
//     if (open){
//         briefcase.style.opacity = "0";
//     }else{
//         briefcase.style.opacity = "1";
//     }
// }

initRifleDirection(){
   this.rifleDirection = {};

   this.rifleDirection.idle = new Quaternion(-0.178, -0.694, 0.667, 0.203);
   this.rifleDirection.walk = new Quaternion( 0.044, -0.772, 0.626, -0.102);
   this.rifleDirection.firingwalk = new Quaternion(-0.034, -0.756, 0.632, -0.169);
   this.rifleDirection.firing = new Quaternion( -0.054, -0.750, 0.633, -0.184);
   this.rifleDirection.run = new Quaternion( 0.015, -0.793, 0.595, -0.131);
   this.rifleDirection.shot = new Quaternion(-0.082, -0.789, 0.594, -0.138);
   this.rifleDirection.getter = new Quaternion(-0.082, -0.789, 0.594, -0.138);
}

initMouseHandler(){
   this.game.renderer.domElement.addEventListener( 'click', raycast, false );
       
   const self = this;
   const mouse = { x:0, y:0 };
   
   function raycast(e){
       
       mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
       mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

       //2. set the picking ray from the camera position and mouse coordinates
       self.raycaster.setFromCamera( mouse, self.game.camera );    

       //3. compute intersections
       const intersects = self.raycaster.intersectObject( self.game.navmesh );
       
       if (intersects.length>0){
           const pt = intersects[0].point;
           console.log(pt);

           self.root.position.copy(pt);

           self.root.remove( self.dolly )

           self.dolly.position.copy( self.game.camera.position );
           self.dolly.quaternion.copy( self.game.camera.quaternion );

           self.root.attach(self.dolly);
       }	
   }
}

initJourney(mode){
    //this.game.renderer.domElement.addEventListener( 'click', raycast, false );
       console.log('ffffffffffffffffffffffffffffffffffffff')
   const self = this;
  // const mouse = { x:0, y:0 };
   
   //function raycast(e){
       
       //mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
       //mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

       //2. set the picking ray from the camera position and mouse coordinates
       //self.raycaster.setFromCamera( mouse, self.game.camera );    

       //3. compute intersections
       //const intersects = self.raycaster.intersectObject( self.game.navmesh );
      // poss = self.game.turtle.p3;
       //if (intersects.length>0){
           //const pt = intersects[0].point;
        //    //const pt = self.game.turtle.group.position;
           //mode = this.p3;
          //  const pt = mode
        //    console.log(pt);

            self.root.position.copy(mode);

            self.root.remove( self.dolly )

            self.dolly.position.copy( self.game.camera.position );
            self.dolly.quaternion.copy( self.game.camera.quaternion );

            self.root.attach(self.dolly);
       //}	
   //}
 }	


reset(){

   this.root.userData.dead = false;
   this.ammo = 100;
   this.health = 100;
   this.action = 'idle';
   this.dead = false;
   this.speed = 0;
   this.isFiring = false;
}

set position(pos){
   this.root.position.copy( pos );
   //this.game.turtle.group.position.clone( posi );
   //game.turtle.p3;
}

get position(){
   return this.root.position;
   //return game.turtle.group.position;
}

set firing(mode){
   this.isFiring = mode;
   if (mode){
       this.action = ( Math.abs(this.speed) == 0 ) ? "Jump" : "Sitting"; //"firing" : "firingwalk";
       //this.bulletTime = this.game.clock.getElapsedTime();
   }else{
       this.action = 'idle';
   }
}

set getter(mode){
    this.isFiring = mode;

    if (mode){
        this.action = ( Math.abs(this.speed) == 0 ) ? "ThumbsUp" : "Yes"; //"firing" : "firingwalk";
        //this.bulletTime = this.game.clock.getElapsedTime();

    }else{
        this.action = 'idle';
    }
   // this.game.loadToken = mode;
 }

 set setter(mode){
    this.isFiring = mode;
    if (mode){
        this.action = ( Math.abs(this.speed) == 0 ) ? "Wave" : "No"; //"firing" : "firingwalk";
        //this.bulletTime = this.game.clock.getElapsedTime();
    }else{
        this.action = 'idle';
    }
 }

shoot(){
   if (this.ammo<1) return;
   if (this.bulletHandler === undefined) this.bulletHandler = this.game.bulletHandler;
   this.aim.getWorldPosition(this.tmpVec);
   this.aim.getWorldQuaternion(this.tmpQuat);
   this.bulletHandler.createBullet( this.tmpVec, this.tmpQuat );
   this.bulletTime = this.game.clock.getElapsedTime();
   this.ammo--;
   this.game.ui.ammo = Math.max(0, Math.min(this.ammo/100, 1));
   this.sfx.play('shot');
}

getAction(){

}

set toggleUser(mode){
    const self = this;
    //this.isFiring = mode;
    if (mode){
        this.action = ( Math.abs(this.speed) == 0 ) ? "Sitting" : "Sitting"; //"firing" : "firingwalk";
        //this.bulletTime = this.game.clock.getElapsedTime();


        
        // const mouse = { x:0, y:0 };
         
         //function raycast(e){
             
             //mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
             //mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
      
             //2. set the picking ray from the camera position and mouse coordinates
             //self.raycaster.setFromCamera( mouse, self.game.camera );    
      
             //3. compute intersections
             //const intersects = self.raycaster.intersectObject( self.game.navmesh );
            // poss = self.game.turtle.p3;
             //if (intersects.length>0){
                 //const pt = intersects[0].point;
              //    //const pt = self.game.turtle.group.position;
                 //mode = this.p3;
                //  const pt = mode
              //    console.log(pt);
      
                //   self.root.position.copy(mode);
      
                //   self.root.remove( self.dolly )
      
                //   self.dolly.position.copy( self.game.camera.position );
                //   self.dolly.quaternion.copy( self.game.camera.quaternion );
      
                //   self.root.attach(self.dolly);

    }else{
        this.action = 'Sitting';
    }
    this.position = this.startInfo.pos; //modified
    //this.position.set(2,3,5);
    this.root.rotation.set(0, this.startInfo.heading, 0, 'XYZ'); //this.startInfo.heading
    //this.root.rotateY(0.7);
 }

//  setAction(){
//     if (this.ammo<1) return;
//     if (this.bulletHandler === undefined) this.bulletHandler = this.game.bulletHandler;
//     this.aim.getWorldPosition(this.tmpVec);
//     this.aim.getWorldQuaternion(this.tmpQuat);
//     this.bulletHandler.createBullet( this.tmpVec, this.tmpQuat );
//     this.bulletTime = this.game.clock.getElapsedTime();
//     this.ammo--;
//     this.game.ui.ammo = Math.max(0, Math.min(this.ammo/100, 1));
//     this.sfx.play('shot');
//  }


addSphere(){
   const geometry = new SphereGeometry( 0.1, 8, 8 );
   const material = new MeshBasicMaterial( { color: 0xFF0000 });
   const mesh = new Mesh( geometry, material );
   this.game.scene.add(mesh);
   this.hitPoint = mesh;
   this.hitPoint.visible = false;
}

load(){
   const loader = new GLTFLoader( ).setPath(`${this.game.assetsPath}glb/`);
   const dracoLoader = new DRACOLoader();
   dracoLoader.setDecoderPath( '/libs5/three128/draco/' );
   loader.setDRACOLoader( dracoLoader );
   
   // Load a glTF resource
   loader.load(
       // resource URL
       'RobotExpressive.glb',
       // called when the resource is loaded
       gltf => {

           this.root.add( gltf.scene );
           this.object = gltf.scene;
           
           this.object.castShadow = true; //added
           this.object.name = "Character"; //added

           this.object.frustumCulled = false;

           const scale = 0.02;
           this.object.scale.set(scale, scale, scale);

          

           this.object.traverse( child => {
               if ( child.isMesh){
                   child.castShadow = true;
                   child.frustumCulled = false;
                   if (child.name.includes('Thumb2.R_end')) this.rifle = child; //Rifle  Thumb2.R_end
               }
           });

           if (this.rifle){
               const geometry = new BufferGeometry().setFromPoints( [ new Vector3( 0, 0, 0 ), new Vector3( 1, 0, 0 ) ] );

               const line = new Line( geometry );
               line.name = 'aim';
               line.scale.x = 50;

               this.rifle.add(line);
               line.position.set(0, 0, 0.5);
               this.aim = line;
               line.visible = false;
           }

           this.animations = {};

           gltf.animations.forEach( animation => {
               this.animations[animation.name.toLowerCase()] = animation;
           })

           this.mixer = new AnimationMixer(gltf.scene);

           this.mixer.addEventListener('Idle', function(){ //added
               this.action = 'Death'; //added
               //this.game.ui.toggleBriefcase();
           })
       
           this.action = 'Yes'; 

           this.ready = true;

           this.game.startRendering();
       },
       // called while loading is progressing
       xhr => {
           this.loadingBar.update( 'user', xhr.loaded, xhr.total );
       },
       // called when loading has errors
       err => {
           console.error( err );
       }
   );
      
}


initSounds(){
   const assetsPath = `${this.game.assetsPath}factory/sfx/`;
   this.sfx = new SFX(this.game.camera, assetsPath, this.game.listener);
   this.sfx.load('fastSweep', true, 0.8, this.object);
   this.sfx.load('eve-groan', false, 0.8, this.object);
   this.sfx.load('shot', false, 0.8, this.object);
}


loadNextAnim(mode){

   
   this.isFiring = mode;
   this.loadNextAnim = mode;
   if (mode){
    this.action = ( Math.abs(this.speed) == 0 ) ? "No" : "Sitting"; //"firing" : "firingwalk";
   }
   else{"Death"};

    // let anim = this.anims.pop();
    // const game = this;
    // loader.load( `${this.assetsPath}fbx/${anim}.fbx`, function( object ){
    //     game.player[anim] = object.animations[0];
    //     if (anim=='push-button'){
    //         game.player[anim].loop = false;
    //     }
    //     if (game.anims.length>0){
    //         game.loadNextAnim(loader);
    //     }else{
    //         delete game.anims;
    //         game.action = "look-around";
    //         game.initPlayerPosition();
    //         game.mode = game.modes.ACTIVE;
    //         const overlay = document.getElementById("overlay");
    //         overlay.classList.add("fade-in");
    //         overlay.addEventListener("animationend", function(evt){
    //             evt.target.style.display = 'none';
    //         }, false);
    //     }
    // }, null, this.onError);	
}


set action(name){
   name = name.toLowerCase();
   if (this.actionName == name) return;    
   
   //console.log(`User action:${name}`);
   if (name == 'shot'){ 
       this.health -= 25;
       if (this.health>=0){
           name = 'hit';
           //Temporarily disable control
           this.game.active = false;
           setTimeout( () => this.game.active = true, 1000);
       }
       this.game.tintScreen(name);
       this.game.ui.health = Math.max(0, Math.min(this.health/100, 1)); 
       if (this.sfx) this.sfx.play('eve-groan');
   }
   //rpg added
       if (name == 'collect'){
        this.action = 'Yes'; 
       }

   if (this.sfx){
       if (name=='Walking' || name=='Jump' || name=='Running'){ //(name=='walk' || name=='firingwalk' || name=='run'){
           this.sfx.play('fastSweep');
       }else{
           this.sfx.stop('fastSweep');
       }
   }

   const clip = this.animations[name.toLowerCase()];

   if (clip!==undefined){
       const action = this.mixer.clipAction( clip );
       if (name=='shot'){
           action.clampWhenFinished = true;
           action.setLoop( LoopOnce );
           this.dead = true;
           this.root.userData.dead = true;
           this.game.gameover();
       }
       action.reset();
       const nofade = this.actionName == 'shot';
       this.actionName = name.toLowerCase();
       action.play();
       if (this.curAction){
           if (nofade){
               this.curAction.enabled = false;
           }else{
               this.curAction.crossFadeTo(action, 0.5);
           }
       }
       this.curAction = action;
   }
   if (this.rifle && this.rifleDirection){
       const q = this.rifleDirection[name.toLowerCase()];
       if (q!==undefined){
           const start = new Quaternion();
           start.copy(this.rifle.quaternion);
           this.rifle.quaternion.copy(q);
           this.rifle.rotateX(1.57);
           const end = new Quaternion();
           end.copy(this.rifle.quaternion);
           this.rotateRifle = { start, end, time:0 };
           this.rifle.quaternion.copy( start );
       }
   }
}

update(dt){
   if (this.mixer) this.mixer.update(dt);
   if (this.rotateRifle !== undefined){
       this.rotateRifle.time += dt;
       if (this.rotateRifle.time > 0.5){
           this.rifle.quaternion.copy( this.rotateRifle.end );
           delete this.rotateRifle;
       }else{
           this.rifle.quaternion.slerpQuaternions(this.rotateRifle.start, this.rotateRifle.end, this.rotateRifle.time * 2);
       }
   }
   if (this.isFiring){
       const elapsedTime = this.game.clock.getElapsedTime() - this.bulletTime;
       if (elapsedTime > 0.6) this.shoot(); 
   }
   //rpg
//    this.game.ui.actionBtn.style = 'display:none;';
//    let trigger = false;
   
//    if (this.game.collect !== undefined && !trigger){
//        console.log('this.collect !== undefined');
//        this.game.collect.forEach(function(){
//         console.log('this.collect.forEach(function(crystal)');
//         if (this.game.object.visible && this.root.position.distanceTo(this.game.object.position)<0.3){
//             console.log('this.game.crystal.visible && this.root.position.distanceTo');
//             this.game.ui.actionBtn.style = 'display:block;';
//             this.onAction = { action:'No', mode:'collect', index:0, src:"crystal.jpg" };
//             trigger = true;
//         }
//     });
//     }       

   //rpg
}
}

export { User };