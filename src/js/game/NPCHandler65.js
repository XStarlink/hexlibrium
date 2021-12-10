import {NPC65} from './NPC65.js';
import {GLTFLoader} from '/libs5/three128/GLTFLoader.js';
import {DRACOLoader} from '/libs5/three128/DRACOLoader.js';
import {Skeleton, Raycaster, BufferGeometry, Line, Vector3} from '/libs5/three128/three.module.js';

class NPCHandler65{
    constructor( game ){
        this.game = game;
		this.loadingBar = this.game.loadingBar;
		this.ready = false; //added
        this.load();
		this.initMouseHandler();
		
	}

	initMouseHandler(){
		const raycaster = new Raycaster();
    	this.game.renderer.domElement.addEventListener( 'click', raycast, false );
			
    	const self = this;
    	const mouse = { x:0, y:0 };
    	
    	function raycast(e){
    		
			mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

			//2. set the picking ray from the camera position and mouse coordinates
			raycaster.setFromCamera( mouse, self.game.camera );    

			//3. compute intersections
			const intersects = raycaster.intersectObject( self.game.navmesh );
			
			if (intersects.length>0){
				const pt = intersects[0].point;
				console.log(pt);
				self.npcs[0].newPath(pt, true);
			}	
		}
    }

	reset(){
		this.npcs.forEach( npc65 => {
			npc65.reset();
		})
	}

    load(){
        const loader = new GLTFLoader( ).setPath(`${this.game.assetsPath}glb/`);
		const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/libs5/three128/draco/' );
        loader.setDRACOLoader( dracoLoader );
        this.loadingBar.visible = true;
		
		// Load a GLTF resource
		loader.load(
			// resource URL
			`RobotExpressive.glb`,
			// called when the resource is loaded
			gltf => {

				if (this.game.pathfinder){
					this.initNPCs(gltf);
				}else{
					this.gltf = gltf;
				}
			},
			// called while loading is progressing
			xhr => {

				this.loadingBar.update( 'swat-guy', xhr.loaded, xhr.total );

			},
			// called when loading has errors
			err => {

				console.error( err );

			}
		);
	}
    
	initNPCs(gltf = this.gltf){
		const gltfs = [gltf];
				
		this.npcs = [];
		
		gltfs.forEach(gltf => {
			const object = gltf.scene;
			object.scale.set(0.02,0.02,0.02);

			object.traverse(function(child){
				if (child.isMesh){
					child.castShadow = true;
				}
			});

			const options = {
				object: object,
				speed: 0.3, //1.8
				animations: gltf.animations,
				app: this.game,
				showPath: false,
				zone: 'factory',
				name: 'swat-guy',
			};

			const npc65 = new NPC65(options);

			npc65.object.position.set(0.1, 0.03, 0); //(-7.607, 0.017, -7.713);
			npc65.action = 'Dance'; //idle
			
			this.npcs.push(npc65);
			
		});

		this.loadingBar.visible = !this.loadingBar.loaded;
		this.ready = true; //added

		this.game.startRendering();
	}

    update(dt){
        if (this.npcs) this.npcs.forEach( npc65 => npc65.update(dt) );
    }
}

export { NPCHandler65 };