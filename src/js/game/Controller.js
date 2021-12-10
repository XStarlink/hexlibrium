import { Object3D, Camera, Vector3, Quaternion, Raycaster } from '/libs5/three128/three.module.js';
import { JoyStick } from '/libs5/JoyStick.js';
import { UI } from './Interface.js';
//import { Game } from './Game.js';

class Controller{
    constructor(game){
        this.camera = game.camera;
        this.clock = game.clock;
        this.user = game.user;
        
        // this.target = game.user.root;

  
        this.changeTarget(0);

        //forEach
        var s = [0, 1];

        Array.prototype.myMap = function(callback) {
        var newArray = [];
        // Only change code below this line
        this.forEach(a => newArray.push(callback(a)));
        // Only change code above this line
        return newArray;
        };

                
        this.toggleTarget = function(targetObject){
            this.targetObject = targetObject;

            console.log('toggle')
   
        }




        // this.changeTarget(fade=0.05){
        //     const cams = Object.keys(this.player.cameras);
        //     cams.splice(cams.indexOf('active'), 1);
        //     let index;
        //     for(let prop in this.player.cameras){
        //         if (this.player.cameras[prop]==this.player.cameras.active){
        //             index = cams.indexOf(prop) + 1;
        //             if (index>=cams.length) index = 0;
        //             this.player.cameras.active = this.player.cameras[cams[index]];
        //             break;
        //         }
        //     }
        //     this.cameraFade = fade;
        // }

         
        this.navmesh = game.navmesh;
        this.game = game;

        this.raycaster = new Raycaster();

        this.move = { up:0, right:0 };
        this.look = { up:0, right:0 };

        this.tmpVec3 = new Vector3();
        this.tmpQuat = new Quaternion();

        //Used to return the camera to its base position and orientation after a look event
        this.cameraBase = new Object3D();
        this.cameraBase.position.copy( this.camera.position );
        this.cameraBase.quaternion.copy( this.camera.quaternion );
        
        this.cameraHigh = new Camera();
        this.cameraHigh.position.copy( this.camera.position );
        this.cameraHigh.position.y += 6;

        this.cameraTarget = new Camera();
        this.cameraTarget.position.copy(this.camera.position);
        this.cameraTarget.position.set(0,2,-2);

        //modified
        this.cameraBase.attach(game.object4D);
        this.target.attach( this.cameraBase );
        //this.target[0].rotateY(0.7);

        //modified
        this.cameraHigh.lookAt( this.target.position );
        this.target.attach( this.cameraHigh );

        this.cameraTarget.lookAt( this.target.position );
        this.target.attach( this.cameraTarget );

        //console.log(this.target)

        this.yAxis = new Vector3(0, 1, 0);
        this.xAxis = new Vector3(1, 0, 0);
        this.forward = new Vector3(0, 0, 1);
        this.down = new Vector3(0, -1, 0);

        this.speed = 1;

        this.ok = 1;
        //const fireBtn;

        this.checkForGamepad();

        //if('ontouchstart' in document.documentElement){
        
        const options1 = {
            left: true,
            app: this,
            onMove: this.onMove
        }

        const joystick1 = new JoyStick(options1);

        const options2 = {
            right: true,
            app: this,
            onLook: this.onLook //onMove: this.onLook
        }

        const joystick2 = new JoyStick(options2);

        //

        this.touchController = { joystick1, joystick2 }; //, getBtn, setBtn


        //this.windowsGate();
        var Window = function(tabs) {
            this.tabs = tabs; // We keep a record of the array inside the object
        };



        //added
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
        //document.addEventListener('mousedown', this.mouseDown.bind(this));
        document.addEventListener('mouseup', this.mouseUp.bind(this));
        document.addEventListener('mousemove', this.mouseMove.bind(this));
        this.keys = {   
                        w:false, 
                        a:false, 
                        d:false, 
                        s:false, 
                        space:false,
                        mousedown:false, 
                        mouseorigin:{x:0, y:0}
                    };
        //added

    }


    windowGate(){
    // When you join two windows into one window
        Window.prototype.join = function (otherWindow) {
            this.tabs = this.tabs.concat(otherWindow.tabs);
            return this;
        };
        
        // When you open a new tab at the end
        Window.prototype.tabOpen = function (tab) {
            this.tabs.push('new tab'); // Let's open a new tab for now
            return this;
        };
        
        // When you close a tab
        Window.prototype.tabClose = function (index) {
        
            // Only change code below this line
        
            var tabsBeforeIndex = this.tabs.splice(0, index); // Get the tabs before the tab
            var tabsAfterIndex = this.tabs.splice(1); // Get the tabs after the tab
        
            this.tabs = tabsBeforeIndex.concat(tabsAfterIndex); // Join them together
        
            // Only change code above this line
        
            return this;
        };
        
        // Let's create three browser windows
        var workWindow = new Window(['GMail', 'Inbox', 'Work mail', 'Docs', 'freeCodeCamp']); // Your mailbox, drive, and other work sites
        var socialWindow = new Window(['FB', 'Gitter', 'Reddit', 'Twitter', 'Medium']); // Social sites
        var videoWindow = new Window(['Netflix', 'YouTube', 'Vimeo', 'Vine']); // Entertainment sites
        
        // Now perform the tab opening, closing, and other operations
        var finalTabs = socialWindow
            .tabOpen() // Open a new tab for cat memes
            .join(videoWindow.tabClose(2)) // Close third tab in video window, and join
            .join(workWindow.tabClose(1).tabOpen());
        console.log(finalTabs.tabs);
	}	

    
    changeTarget = (num) =>{

        

       // console.log("changeTarget")
        
        // this.player.cameras = { front, back, wide, overhead, collect };

        // const back = new THREE.Object3D();
		// back.position.set(0, 100, -250);
		// back.parent = this.player.object;

        // setTimeout( function(){ 
		// 	game.activeCamera = game.player.cameras.back; 
		// 	game.cameraFade = 0.01; 
		// 	setTimeout(function(){ game.cameraFade = 0.1; }, 1500);
		// }, 2000)
        //this.game = game;

        //this.targets = cam; 
        //var fixedValue = 0;
        //const numero = num
        //const number = numero ++
        
        this.targets = [];        
        
        this.targets[0] = game.user.root;
        this.targets[1] = game.turtle.group;
        this.targets[2] = game.user.root;
        this.targets[3] = game.turtle.group;

        
        

  
        // var fixedValue = 0;

        // function incrementer () {
        //     var oldValue = 0;
        //     var newValue = oldValue ++

        // return newValue
       
        // }

        // var value = incrementer(); 
       
    
        this.target = this.targets[num]

        //num = num + 1;

       //console.log(num); // Should print 4

        

        // changeTarget(fade=0.05){
        //     const cams = Object.keys(this.player.cameras);
        //     cams.splice(cams.indexOf('active'), 1);
        //     let index;
        //     for(let prop in this.player.cameras){
        //         if (this.player.cameras[prop]==this.player.cameras.active){
        //             index = cams.indexOf(prop) + 1;
        //             if (index>=cams.length) index = 0;
        //             this.player.cameras.active = this.player.cameras[cams[index]];
        //             break;
        //         }
        //     }
        //     this.cameraFade = fade;
        // }
       


        return this.target;

    }

    // set activeCamera(object){
	// 	this.player.cameras.active = object;
	// }

    

    checkForGamepad(){
        const gamepads = {};

        const self = this;

        function gamepadHandler(event, connecting) {
            const gamepad = event.gamepad;

            if (connecting) {
                gamepads[gamepad.index] = gamepad;
                self.gamepad = gamepad;
                if (self.touchController) self.showTouchController(false);
            } else {
                delete self.gamepad;
                delete gamepads[gamepad.index];
                if (self.touchController) self.showTouchController(true);
            }
        }

        window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
        window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
    }

    showTouchController(mode){
        if (this.touchController == undefined) return;

        this.touchController.joystick1.visible = mode;
        this.touchController.joystick2.visible = mode;
        this.touchController.fireBtn.style.display = mode ? 'block' : 'none';
    }

    keyDown(e){
        //console.log('keyCode:' + e.keyCode);
        let repeat = false;
        if (e.repeat !== undefined) {
            repeat = e.repeat;
        }
        switch(e.keyCode){
            case 87:
                this.keys.w = true;
                break;
            case 65:
                this.keys.a = true;
                break;
            case 83:
                this.keys.s = true;
                break;
            case 68:
                this.keys.d = true;
                break;
            case 32:
                if (!repeat) this.fire(true);
                break;                                           
        }
    }

    keyUp(e){
        switch(e.keyCode){
            case 87:
                this.keys.w = false;
                if (!this.keys.s) this.move.up = 0;
                break;
            case 65:
                this.keys.a = false;
                if (!this.keys.d) this.move.right = 0;
                break;
            case 83:
                this.keys.s = false;
                if (!this.keys.w) this.move.up = 0;
                break;
            case 68:
                this.keys.d = false;
                if (!this.keys.a) this.move.right = 0;
                break;   
            case 32:
                this.fire(false);
                break;                          
        }
    }

    mouseDown(e){
        this.keys.mousedown = true;
        this.keys.mouseorigin.x = e.offsetX;
        this.keys.mouseorigin.y = e.offsetY;
    }

    mouseUp(e){
        this.keys.mousedown = false;
        this.look.up = 0;
        this.look.right = 0;
    }

    mouseMove(e){
        if (!this.keys.mousedown) return;
        let offsetX = e.offsetX - this.keys.mouseorigin.x;
        let offsetY = e.offsetY - this.keys.mouseorigin.y;
        if (offsetX<-100) offsetX = -100;
        if (offsetX>100) offsetX = 100;
        offsetX /= 100;
        if (offsetY<-100) offsetY = -100;
        if (offsetY>100) offsetY = 100;
        offsetY /= 100;
        this.onLook(-offsetY, offsetX);
    }

    fire(mode){
        //console.log(`Fire:${mode}`);
        if (this.game.active) this.user.firing = mode;
    }

    onMove( up, right ){
        this.move.up = up;
        this.move.right = -right;
    }

    onLook( up, right ){
        this.look.up = up*0.25;
        this.look.right = -right;
    }

    gamepadHandler(){
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[this.gamepad.index];
        const leftStickX = gamepad.axes[0];
        const leftStickY = gamepad.axes[1];
        const rightStickX = gamepad.axes[2];
        const rightStickY = gamepad.axes[3];
        const fire = gamepad.buttons[7].pressed;
        this.onMove(-leftStickY, leftStickX);
        this.onLook(-rightStickY, rightStickX);
        this.fire(fire);
    }

    keyHandler(){
        if (this.keys.w) this.move.up += 0.005;
        if (this.keys.s) this.move.up -= 0.005;
        if (this.keys.a) this.move.right += 0.1;
        if (this.keys.d) this.move.right -= 0.1;
        if (this.move.up>1) this.move.up = 1;
        if (this.move.up<-1) this.move.up = -1;
        if (this.move.right>1) this.move.right = 1;
        if (this.move.right<-1) this.move.right = -1;
    }

    //Controller.prototype.camera = function(){}

    // dog(color){
    //     this.color = color;
    //     this.name = "xinxo",
    //     this.legs = 4,
    //     this.run = function(){return dog.legs;}
    // }
    //dog("blue");

    // for (let property in canary) {
    //     if(canary.hasOwnProperty(property)) {
    //       ownProps.push(property);
    //     }
    //   }
      
    //   console.log(ownProps);



    update(dt){ //0.0167

       
        if (this.game.active == false){
            //this.changeTarget(1);
            let lerpSpeed = 0.03; //0.03
            this.cameraBase.getWorldPosition(this.tmpVec3);
            this.game.seeUser(this.tmpVec3, true);
            this.cameraBase.getWorldQuaternion(this.tmpQuat);
            this.camera.position.lerp(this.tmpVec3, lerpSpeed);
            this.camera.quaternion.slerp(this.tmpQuat, lerpSpeed);
            
            
            return;

        }

        // let lerpSpeed = 0.03; //0.03
        // this.cameraTarget.getWorldPosition(this.tmpVec3);
        // this.game.seeUser(this.tmpVec3, true);
        // this.cameraTarget.getWorldQuaternion(this.tmpQuat);
        // this.camera.position.lerp(this.tmpVec3, lerpSpeed);
        // this.camera.quaternion.slerp(this.tmpQuat, lerpSpeed);

        //if (this.game.active == true){
            // this.changeTarget(0);
            // this.target.attach( this.cameraTarget );
        //}
        
        //this.changeTarget();

        let playerMoved = false;
        let speed;

        if (this.gamepad){
            this.gamepadHandler();
        }else if(this.keys){
            this.keyHandler();
        }

        if (this.move.up!=0){
            const forward = this.forward.clone().applyQuaternion(this.target.quaternion);
            speed = this.move.up>0 ? this.speed * dt : this.speed * dt * 0.3; //0.3
            speed *= this.move.up;
            if (this.user.isFiring && speed>0.003) speed = 0.07; //if (this.user.isFiring && speed>0.03) speed = 0.02;  
            const pos = this.target.position.clone().add(forward.multiplyScalar(speed));
            pos.y += 2;
            //console.log(`Moving>> target rotation:${this.target.rotation} forward:${forward} pos:${pos}`);
            
            this.raycaster.set( pos, this.down );

            const intersects = this.raycaster.intersectObject( this.navmesh );

            if ( intersects.length>0 ){
                this.target.position.copy(intersects[0].point);
                playerMoved = true;
            }
        }else{
            speed = 0;
        }

        this.user.speed = speed;
        
        if (Math.abs(this.move.right)>0.1){
            const theta = dt * (this.move.right-0.1) * 1;
            this.target.rotateY(theta);
            playerMoved = true;
        }

        if (playerMoved){
            this.cameraBase.getWorldPosition(this.tmpVec3);
            this.camera.position.lerp(this.tmpVec3, 0.7);
            //if (speed) console.log(speed.toFixed(2));
            let run = false;
            if (speed>0.003){ //0.03
                if (this.overRunSpeedTime){
                    const elapsedTime = this.clock.elapsedTime - this.overRunSpeedTime;
                    run = elapsedTime>0.1;
                }else{
                    this.overRunSpeedTime = this.clock.elapsedTime;
                }
            }else{
                delete this.overRunSpeedTime;
            }
            if (run){
                this.user.action = 'Running'; //run    
            }else{
                this.user.action = (this.user.isFiring) ? 'Jump' : 'Walking'; // 'firingwalk' : 'walk';
            }
        }else{
            if (this.user !== undefined && !this.user.isFiring) this.user.action = 'Idle'; //idle
        }

        if (this.look.up==0 && this.look.right==0){
            let lerpSpeed = 0.7;
            this.cameraBase.getWorldPosition(this.tmpVec3);
            if (this.game.seeUser(this.tmpVec3, true)){ // true/false
                this.cameraBase.getWorldQuaternion(this.tmpQuat);
            }else{

                this.cameraHigh.getWorldPosition(this.tmpVec3);
                this.cameraHigh.getWorldQuaternion(this.tmpQuat);

                // this.cameraPlayer.getWorldPosition(this.tmpVec3);
                // this.cameraPlayer.getWorldQuaternion(this.tmpQuat);

            }
            this.camera.position.lerp(this.tmpVec3, lerpSpeed);
            this.camera.quaternion.slerp(this.tmpQuat, lerpSpeed);

        }else{
            const delta = 1 * dt;
            this.camera.rotateOnWorldAxis(this.yAxis, this.look.right * delta);
            const cameraXAxis = this.xAxis.clone().applyQuaternion(this.camera.quaternion);
            this.camera.rotateOnWorldAxis(cameraXAxis, this.look.up * delta);
        }
    }
}

export { Controller };