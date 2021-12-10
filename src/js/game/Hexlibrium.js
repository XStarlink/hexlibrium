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
import { SpeechBubble } from './SpeechBubble.js';
import { Turtle } from './Turtle.js';
import { Screen } from './Screen.js';



 class Hex{
 	constructor(){
		//game = this;
		//console.log(Actor)

		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
		this.clock = new THREE.Clock();

        this.loadingBar = new LoadingBar();
        this.loadingBar.visible = false;

		this.assetsPath = '/assets/';
        
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
		//this.camera.position.set( -10.6, 1.6, -1.46 );
		this.camera.position.set( 0, 0.1, -0.2 ); //-10.6, 1.6, -3.5 //-1.25, 0.25, -0.10 //  0, 0.1, -0.2
		this.camera.rotation.y = -Math.PI; //0.525
		//this.camera.rotation.x = -Math.PI/3; //0.525

		let col = 0x201510;
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( col );
		//this.scene.fog = new THREE.Fog( col, 100, 200 );

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		this.scene.add(ambient);

        const light = new THREE.DirectionalLight();
        light.position.set( 4, 20, 20 );
		light.target.position.set(-2, 0, 0);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 1024; 
		light.shadow.mapSize.height = 512; 
		light.shadow.camera.near = 0.5; 
		light.shadow.camera.far = 50;
		const d = 30; 
		light.shadow.camera.left = -d;
		light.shadow.camera.bottom = -d*0.25;
		light.shadow.camera.right = light.shadow.camera.top = d;
		this.scene.add(light);
		this.light = light;
	
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.shadowMap.enabled = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        this.setEnvironment();
		
		this.initPostProcessing();

		this.load();

		this.raycaster = new THREE.Raycaster();
		this.tmpVec = new THREE.Vector3();

		this.active = false;

		this.loadSolids();

		this.collect = [];
		
		this.tweens = [];


		window.addEventListener( 'resize', this.resize.bind(this) );
	}




	initPostProcessing(){
		this.composer = new EffectComposer( this.renderer );
  		const renderPass = new RenderPass( this.scene, this.camera );
  		this.composer.addPass( renderPass );
		const gammaCorrectionPass = new ShaderPass( GammaCorrectionShader );
		this.composer.addPass( gammaCorrectionPass );

		const tintShader = {

			uniforms: {
		
				'tDiffuse': { value: null },
				'strength': { value: 0.0 }
		
			},
		
			vertexShader: /* glsl */`
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
		
			fragmentShader: /* glsl */`
				uniform float strength;
				uniform sampler2D tDiffuse;
				varying vec2 vUv;
				void main() {
					vec3 texel = texture2D(tDiffuse, vUv).rgb;
					vec3 tintColor = vec3(1.0, 0.3, 0.3);
					float luminance = (texel.r + texel.g + texel.b)/3.0;
					vec3 tint = tintColor * luminance * 1.8;
					vec3 color = mix(texel, tint, clamp(strength, 0.0, 1.0));
					gl_FragColor = vec4(color, 1.0);
				}`
		
		}; 
		this.tintPass = new ShaderPass( tintShader );
		this.composer.addPass( this.tintPass );	  
	}

 

	loadFont() {
		var looader = new THREE.FontLoader();
		looader.load(
		  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/254249/helvetiker_regular.typeface.json",
		  function (res) {
			textMesh(res);
		  }
		);
	  }
	  textMesh(font) {
		const textGeo = new THREE.TextGeometry("HEXLIBRIUM", {
		  font: font,
		  size: 1,
		  height: 0.5,
		  curveSegments: 1,
		  bevelEnabled: true,
		  bevelThickness: 1,
		  bevelSize: 0.3,
		  bevelOffset: 0,
		  bevelSegments: 5
		});
		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();
		var cubeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
		text = new THREE.Mesh(textGeo, cubeMat);
		text.position.set(0, 0, 0);
		text.castShadow = true;
		text.scale.set(1, 1, 1);
		this.scene.add(text);
	}


	slides(){
		const speechBubble = new SpeechBubble(this, "Hexlibrium", 0.2, 13, true);
		speechBubble.mesh.position.set(0, 0.2, 0.2);
		speechBubble.mesh.rotation.set(0, Math.PI, 0);

		// const speechBubble1 = new SpeechBubble(this, "Welcome to the journey where you gonna learn about: Art, Science, Design, Engineering and Mindfulness...", 0.2, 13, true);
		// speechBubble1.mesh.position.set(-0.2, 0.2, 0.4);
		// speechBubble1.mesh.rotation.set(0, Math.PI, 0);

		// const speechBubble2 = new SpeechBubble(this, "...In this travel you gonna apply this knowledge using: programming, drawing, music and dance...", 0.2, 13, true);
		// speechBubble2.mesh.position.set(-0.4, 0.2, 0.6);
		// speechBubble2.mesh.rotation.set(0, Math.PI, 0);

		// const speechBubble3 = new SpeechBubble(this, "...your challenge is to conquer the nine planets contained in your dimension...", 0.2, 13, true);
		// speechBubble3.mesh.position.set(-0.6, 0.2, 0.8);
		// speechBubble3.mesh.rotation.set(0, Math.PI, 0);

		// const speechBubble4 = new SpeechBubble(this, "...eventually your gonna get in another dimension by traveling through one of these twelve skies ...", 0.2, 13, true);
		// speechBubble4.mesh.position.set(-0.4, 0.2, 1.2);
		// speechBubble4.mesh.rotation.set(0, Math.PI, 0);

		// const speechBubble5 = new SpeechBubble(this, "...there the magical start to happening... because you gonna interact with other players to exchange keys for your evolution...", 0.2, 13, true);
		// speechBubble5.mesh.position.set(-0.0, 0.2, 1.6);
		// speechBubble5.mesh.rotation.set(0, Math.PI, 0);

		// const speechBubble6 = new SpeechBubble(this, "...but right now be focused in your tasks, use your robots to build your technology and be attentive of the advices shown by the little turtle... good luck...", 0.2, 13, true);
		// speechBubble6.mesh.position.set(0.4, 0.2, 2.6);
		// speechBubble6.mesh.rotation.set(0, Math.PI, 0);

		this.object4D = new THREE.Object3D();
		this.scene.add(this.object4D)
		this.screen = new Screen(this, "Map", 0.1, 1, true);
		this.screen.mesh.rotation.set(0,Math.PI,0)
		this.screen.mesh.position.set(-0.12,0.15,0)
		//screen.mesh.rotation.set(Math.PI/2.5, 0, 0);
		this.object4D.add(this.screen.mesh)



		//this.blockly = new Screen(this, "Map", 0.05, 14, true);


		
		//this.camera.add( this.screen );
		//this.screen.position.copy.getWorldPosition(this.camera.position);
        //this.screen.position.copy.getWorldQuaternion(this.camera.quaternion);
		//this.screen.mesh.attach( this.camera );
		
		// this.screen.controller.cameraBase.getWorldPosition(this.camera.position);
        // this.screen.controller.cameraBase.getWorldQuaternion(this.camera.quaternion);

		//this.screen.mesh.position.getWorldPosition(this.camera.position);
		//this.screen.position(this.controller.cameraBase.getWorldPosition(this.camera.position));
		//this.controller.cameraBase.getWorldPosition(this.camera.position);

		// this.controller.cameraBase.getWorldPosition(this.camera.position);
        // this.controller.cameraBase.getWorldQuaternion(this.camera.quaternion);
		
	}

	shape(){

		class GeoShape extends THREE.Shape {
			constructor(sides, innerRadius, outerRadius) {
			super();
			let theta = 0;
			const inc = ((2 * Math.PI) / sides) * 0.5;
		
			this.moveTo(Math.cos(theta) * outerRadius, Math.sin(theta) * outerRadius);
		
			for (let i = 0; i < sides; i++) {
				theta += inc;
				this.lineTo(
				Math.cos(theta) * innerRadius,
				Math.sin(theta) * innerRadius
				);
				theta += inc;
				this.lineTo(
				Math.cos(theta) * outerRadius,
				Math.sin(theta) * outerRadius
				);
			}
			}
		}

		const extrudeSettings = {
			depth: 0.01,
			bevelEnabled: false
		};

		var iGroup = new THREE.Group();
		this.scene.add(iGroup);
		

		const color2 = new THREE.Color("skyblue");
		const mat = new THREE.MeshPhongMaterial({ color : color2, wireframe: false });


		const pentaShape = new GeoShape(5, 0.13, 0.16); //5, 51, 64
		const pentaGeometry = new THREE.ExtrudeBufferGeometry(pentaShape, extrudeSettings);
		//const pentagramMesh = new THREE.Mesh(pentaGeometry, mat);
		//pentagramMesh.position.set(0,0.2,0);
		//iGroup.add(pentagramMesh);


		const hexShape = new GeoShape(6, 0.12, 0.1); //6, 55, 64
		const hexGeometry = new THREE.ExtrudeBufferGeometry(hexShape, extrudeSettings);
		const hexMesh = new THREE.Mesh(hexGeometry, mat);
		//hexMesh.position.set(0,0.2,0);
		//iGroup.add(hexMesh);

		const icosaGeometry = new THREE.IcosahedronBufferGeometry(2, 1);
		var icosaMeshGeometry = new THREE.Mesh(icosaGeometry, mat);
		//icosaMeshGeometry.position.set(0,0,0);
		//this.scene.add(icosaMeshGeometry);

		const dodecaGeometry = new THREE.DodecahedronBufferGeometry(20, 1);
		var dodecaMeshGeometry = new THREE.Mesh(dodecaGeometry, mat);
		//dodecaMeshGeometry.position.set(0,0,0);
		this.scene.add(dodecaMeshGeometry);

		const position = dodecaGeometry.getAttribute("position");
		const normal = dodecaGeometry.getAttribute("normal");
		//const direction = geometry.setAttribut("direction");

		
		//const position = hexMesh.getAttribute("position");
		//const normal = hexMesh.getAttribute("normal");
		//const direction = hexMesh.setAttribut("direction");

		for (let i = 0; i < position.array.length; i += 3) {
			//const iAsset = new THREE.Object3D();

			 const color = new THREE.Color("skyblue");
			 const material = new THREE.MeshPhongMaterial({ color: color });
			 const pentagramMesh = new THREE.Mesh(pentaGeometry, material);
			 pentagramMesh.doubleSided = true;

			// const sky1 = new SpeechBubble(this, "", 2, 1, false);

			

			const poss = new THREE.Vector3(
				position.array[i],
				position.array[i + 1],
				position.array[i + 2]
				);

			const norm = new THREE.Vector3(
				normal.array[i],
				normal.array[i + 1],
				normal.array[i + 2]
				);	

			pentagramMesh.position.copy(poss);
			const target = poss.clone().add(norm.multiplyScalar(1.0));
			pentagramMesh.lookAt(target);

			iGroup.add(pentagramMesh);
		}
	
	
	}

	tintScreen(action){
		this.tintPass.uniforms.strength.value = 1; 
		const duration = (action=='shot') ? 3.0 : 1.5; //shot
		this.tween = new Tween( this.tintPass.uniforms.strength, 'value', 0, duration, this.removeTween.bind(this));
	}

	removeTween(){
		delete this.tween;
	}

	startGame(){
		this.user.reset();
		this.npcHandler.reset();
		this.ui.ammo = 1;
		this.ui.health = 1;
		this.active = true;
		this.controller.cameraBase.getWorldPosition(this.camera.position);
        this.controller.cameraBase.getWorldQuaternion(this.camera.quaternion);
		this.sfx.play('computerAmbience');
		//this.changeTarget(0);

		this.npcHandler65.reset(); //added
		//this.user.loadCrystal();
		this.robotBall.reset();


	}

	switchCamera(){

		//console.log("game")
	}

	seeUser(pos, mode, seethrough=false){
		const x = 1;
		if (this.seethrough){
			this.seethrough.forEach( child => {
				child.material.transparent = false;
				child.material.opacity = 1;
				//child.visible = true;
			});
			delete this.seethrough;
		}

		this.tmpVec.copy(this.user.position).sub(pos).normalize();
		this.raycaster.set(pos, this.tmpVec);

		const intersects = this.raycaster.intersectObjects(this.factory.children, true);
		let userVisible = true;

		if (intersects.length>0){
		//if (x == 1){
			const dist = this.tmpVec.copy(this.user.position).distanceTo(pos);
			
			// if (seethrough){
			// 	this.seethrough = [];
			// 	intersects.some( intersect => {
			// 		if (intersect.distance < dist){
			// 			this.seethrough.push(intersect.object);
			// 			//intersect.object.visible = false;
			// 			intersect.object.material.transparent = true;
			// 			intersect.object.material.opacity = 0.3;
			// 		}else{
			// 			return true;
			// 		}
			// 	})
			// }else{
			 	userVisible = (intersects[0].distance > dist);
				
				 
			// }
			
		}

		return userVisible;
	}

	gameover(){
		this.active = false;
		this.ui.showGameover();
		this.sfx.stop('longMovement');
	}

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

	initPathfinding(navmesh){
		this.waypoints = [
			new THREE.Vector3( -2.0292012597018543, 0.026742462935208877, 0.27954242080925873),
			new THREE.Vector3( -0.3790149572775682, 0.02674254620012828, -0.7802722225258245),
			new THREE.Vector3( 0.6346736148681719, 0.026742514021896646, -0.6141894668643384),
			new THREE.Vector3( -0.8539030636622936, 0.026742458343506748, 0.6603966611010792),
			new THREE.Vector3( -0.682170421322911, 0.026742359600560484, 2.249921667149671),
			new THREE.Vector3( 0.009669986053629866, 0.026742396274515023, 1.8999699813362183)
		];
		this.pathfinder = new Pathfinding();
	    this.pathfinder.setZoneData('factory', Pathfinding.createZone(navmesh.geometry, 0.02)); //0.02
		if (this.npcHandler.gltf !== undefined) this.npcHandler.initNPCs();
		if (this.npcHandler65.gltf !== undefined) this.npcHandler65.initNPCs(); //added
	}

	load(){
		//this.loadEnvironment0();
        this.loadEnvironment();
		//this.loadEnvironment1();
		this.loadEnvironment2();
		this.loadEnvironment3();
		this.npcHandler = new NPCHandler(this);
		this.npcHandler65 = new NPCHandler65(this); //added
		this.user = new User(this, new THREE.Vector3( 0, 0.03, 0),0); // -5.97, 0.021, -1.49), 1.57 //new THREE.Vector3( 0, 0, 0)
		
		this.ui = new UI(this);
		this.loadSky();
		//this.hexColliders();
		//this.createColliders();
		
		//this.turtle = new Turtle(this);
		//this.loadFont();

		this.slides();

		this.shape();	

		//this.particle()

		//this.poss;

		this.turtle = new Turtle(this);

		//this.robotBall = new RobotBall(this); //added

		this.loadIT();

		//console.log(poss)

		//this.user = new User(this, this.turtle.group.position, 0);

		//this.mech = new Mech(this);

		//this.portal = new Portal(this);

		this.loadAvatar()
		this.loadAvatar1()
		this.loadAvatar2()
		this.loadAvatar3()

		
    }

	loadSky(){
		

		const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";
  
		const envMap = new THREE.CubeTextureLoader()
		  .setPath(`${assetPath}skybox1_`)
		  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
		  this.scene.background = envMap;

		//this.loadCrystal();
		//this.zodiac();

		// var shape = new THREE.DodecahedronGeometry(1.25, 0);

		// var material = new THREE.MeshLambertMaterial( {color: 0xffffff,  shading: THREE.FlatShading} );

		// var glass = new THREE.MeshNormalMaterial({
		// 	transparent: true,
		// 	opacity: .2,
		// 	color: 0xFFFFFF,
		// 	shading: THREE.FlatShading,
		// 	 });

		// 	 var edges = new THREE.EdgesGeometry( shape );
		// 	line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { 
		// 	color: 0xffffff,
		// 	transparent: true,
		// 	linejoin: 'bevel',
		// 	opacity: .8
		// 	} ) );

		// var dodec = new THREE.Mesh(shape, glass);

		// this.scene.add(dodec,line)
	}	

	zodiac(){

		let g = new THREE.DodecahedronBufferGeometry(15);

		const base = new THREE.Vector2(0, 0.5);
		const center = new THREE.Vector2();
		const angle = THREE.MathUtils.degToRad(72);
		let baseUVs = [
			base.clone().rotateAround(center, angle * 1).addScalar(0.5),
		base.clone().rotateAround(center, angle * 2).addScalar(0.5),
		base.clone().rotateAround(center, angle * 3).addScalar(0.5),
		base.clone().rotateAround(center, angle * 4).addScalar(0.5),
		base.clone().rotateAround(center, angle * 0).addScalar(0.5)
		];

		let uvs = [];
		let sides = [];
		for (let i = 0; i < 12; i++){
			uvs.push(
			baseUVs[1].x, baseUVs[1].y,
			baseUVs[2].x, baseUVs[2].y,
			baseUVs[0].x, baseUVs[0].y,
			
			baseUVs[2].x, baseUVs[2].y,
			baseUVs[3].x, baseUVs[3].y,
			baseUVs[0].x, baseUVs[0].y,
			
			baseUVs[3].x, baseUVs[3].y,
			baseUVs[4].x, baseUVs[4].y,
			baseUVs[0].x, baseUVs[0].y
		);
		sides.push(i, i, i, i, i, i, i, i, i);
		}
		g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
		g.setAttribute("sides", new THREE.Float32BufferAttribute(sides, 1));

		let m = new THREE.MeshStandardMaterial({
			side: THREE.DoubleSide,
			wireframe: false,
			//transparent: true,
			// roughness: 0.25,
			// metalness: 0.75,
			map: createTexture(),
			
			onBeforeCompile: shader => {
			shader.vertexShader = `
				attribute float sides;
			${shader.vertexShader}
			`.replace(
				`#include <uv_vertex>`,
			`
				#include <uv_vertex>
				
				vUv.x = (1./16.) * (vUv.x + sides);
			`
			);
			console.log(shader.vertexShader);
		}
		});
		let o = new THREE.Mesh(g, m);
		this.scene.add(o);

		// renderer.setAnimationLoop(()=>{
		// 	renderer.render(scene, camera);
		// })

		// function createTexture(){
		// 	let c = document.createElement("canvas");
		// 	let step = 64;
		// 	c.width = step * 16;
		// 	c.height = step;
		// 	let ctx = c.getContext("2d");
		// 	//ctx.fillStyle = "#7f7f7f";
		// 	//ctx.globalAlpha = 0;
		// 	ctx.fillRect(0, 0, c.width, c.height);
		// 	ctx.font = "40px Arial";
		// 	ctx.textAlign = "center"; 
		// 	ctx.fillStyle = "aqua";
		// 	ctx.textBaseline = "middle"; 
		// 	for (let i = 0; i < 12; i++){
		// 		ctx.fillText(i + 1, step * 0.5 + step * i, step * 0.5);
		// }
		
		// return new THREE.CanvasTexture(c);
		// }

		function createTexture(){
			let canvas = document.createElement("canvas");
			let step = 64;
			canvas.width = step * 16;
			canvas.height = step;
			let ctx = canvas.getContext("2d");
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			
	
			const config = { size:12, padding:10, colour:'#fff', width:256, height:256 }; //font:'Calibri', 
	
			var oopt;
	
			const opt = {
				assets:[
					`${this.assetsPath}images/zs1.png`,
					`${this.assetsPath}images/zs2.png`,
					`${this.assetsPath}images/zs3.png`,
					`${this.assetsPath}images/zs4.png`,
					`${this.assetsPath}images/zs5.png`,
					`${this.assetsPath}images/zs6.png`,
					`${this.assetsPath}images/zs7.png`,
					`${this.assetsPath}images/zs8.png`,
					`${this.assetsPath}images/zs9.png`,
					`${this.assetsPath}images/zs10.png`,
					`${this.assetsPath}images/zs11.png`,
					`${this.assetsPath}images/zs12.png`,
	
					`${this.assetsPath}images/flowerOfLife.png`,
					`${this.assetsPath}images/sriYantra.png`,
					`${this.assetsPath}images/bluePaper.png`
				]
				// oncomplete: function(){
				// 	game.init();
				//}
			}
	
			//console.log(opt);
	
			//this.anims.forEach( function(anim){ options.assets.push(`${game.assetsPath}fbx/anims/${anim}.fbx`)});
			//options.assets.push(`${game.assetsPath}fbx/town.fbx`);
			
			const planeGeometry = new THREE.PlaneGeometry(size, size);
			const planeMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide})
			const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
			//this.mesh.position.set(0,0,0);
	
			//const speech = (bubble) =>{
				// if(bubble == true){
				this.scene.add(mesh);
				// }if(bubble == false){
				// this.game.scene.add(this.mesh);
				// }
			//};
			
			const self = this;
			const loader = new THREE.TextureLoader();
			loader.load(
				// resource URL
				//`${game.assetsPath}images/flowerOfLife.png`,
				opt.assets[oopt], ///////////////////////////////////////////////////////////////////
	
				// onLoad callback
				function ( texture ) {
					// in this example we create the material when the texture is loaded
					self.img = texture.image;
					self.mesh.material.map = texture;
					self.mesh.material.transparent = true;
					self.mesh.material.needsUpdate = true;
					//if (msg!==undefined) self.update(msg);
				},
	
				// onProgress callback currently not supported
				undefined,
	
				// onError callback
				function ( err ) {
					console.error( 'An error happened.' );
				}
			);

			mesh.material.map = new THREE.CanvasTexture(canvas);
	
			for (let i = 0; i < 12; i++){
			ctx.mesh(i + 1, step * 0.5 + step * i, step * 0.5);
			}
	
			//console.log('teste')
			return new THREE.CanvasTexture(c);
		}

	}
	



	// particle(){

	// 	//===================================================== particles
	// 	var mergedGeometry = new BufferGeometryUtils();
		
	// 	var boxGeometry = new THREE.TetrahedronGeometry(0.25, 0);
		
	// 	var material = new THREE.MeshNormalMaterial({
	// 	color: new THREE.Color("white")
	// 	});
		
	// 	for (var i = 0; i < 1000; i++) {
	// 	var x = Math.random() * 125 - 75;
	// 	var y = Math.random() * 125 - 75;
	// 	var z = Math.random() * 125 - 75;
		
	// 	boxGeometry.translate(x, y, z);
		
	// 	mergedGeometry.merge(boxGeometry);
		
	// 	boxGeometry.translate(-x, -y, -z);
	// 	}
		
	// 	var cubes = new THREE.Mesh(mergedGeometry, material);
	// 	this.scene.add(cubes);
		
	// }
    
    setEnvironment(){
        const loader = new RGBELoader().setDataType( THREE.UnsignedByteType ).setPath(this.assetsPath);
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        
        loader.load( 'glb/venice_sunset_1k.hdr', 
		texture => {
          const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
          pmremGenerator.dispose();

          this.scene.environment = envMap;

		  this.loadingBar.visible = !this.loadingBar.loaded;
        }, 
		xhr => {
			this.loadingBar.update( 'envmap', xhr.loaded, xhr.total );
		},
		err => {
            console.error( err.message );
        } );
    }
    
    loadEnvironment(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'hextile.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.factory = gltf.scene;

				//this.factory.scale.set(10,10,10);
				
				this.fans = [];

				const mergeObjects = {elements2:[], elements5:[], terrain:[]};

				gltf.scene.traverse( child => {
					if (child.isMesh){
						if (child.name == 'navmesh'){
							this.navmesh = child;
							//this.navmesh.geometry.rotateX( Math.PI/2 );
							this.navmesh.quaternion.identity();
							this.navmesh.position.set(0,0,0);
							child.material.visible = true;
							//this.navmesh.scale.set(10,10,10)
						}else{
						 	child.castShadow = true;
						 	child.receiveShadow = true;
						}
						//else if (child.name.includes('fan')){
						// 	this.fans.push( child );
						// }else if (child.material.name.includes('elements2')){
						// 	mergeObjects.elements2.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('elements5')){
						// 	mergeObjects.elements5.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('terrain')){
						// 	mergeObjects.terrain.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('sand')){
						// 	child.receiveShadow = true;
						// }else if ( child.material.name.includes('elements1')){
						// 	child.castShadow = true;
						// 	child.receiveShadow = true;
						// }else if (child.parent.name.includes('main')){
						// 	child.castShadow = true;
						// }
					}
				});

				this.scene.add(this.navmesh);

				for(let prop in mergeObjects){
					const array = mergeObjects[prop];
					let material;
					array.forEach( object => {
						if (material == undefined){
							material = object.material;
						}else{
							object.material = material;
						}
					});
				}

				this.initPathfinding(this.navmesh);

				this.loadingBar.visible = !this.loadingBar.loaded;
			},
			// called while loading is progressing
			xhr => {

				this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			},
			// called when loading has errors
			err => {

				console.error( err );

			}
		);
	}	
	
	loadAvatar(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'Aeoniv.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.avatar = gltf.scene;

				this.avatar.position.set(0.2,0.03,-0.5);
				this.avatar.scale.set(0.09,0.09,0.09);
				
				

				gltf.scene.traverse( child => {
					if (child.isMesh){
						if(child.name == 'Solid'){
						child.material.visible = false;
						
				
						 	child.castShadow = true;
						 	child.receiveShadow = true;
							 this.skyIsland.scale.set(30,30,30)
					}
				}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				//this.initPathfinding(this.navmesh);

				//this.loadingBar.visible = !this.loadingBar.loaded;


			}//,
			
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }

			);

			
	}
	
	
	loadAvatar1(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'Joao.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.avatar = gltf.scene;

				this.avatar.position.set(0,0.03,-0.5);
				this.avatar.scale.set(0.09,0.09,0.09);
				
				

				gltf.scene.traverse( child => {
					if (child.isMesh){
						if(child.name == 'Solid'){
						child.material.visible = false;
						
				
						 	child.castShadow = true;
						 	child.receiveShadow = true;
							 this.skyIsland.scale.set(30,30,30)
					}
				}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				//this.initPathfinding(this.navmesh);

				//this.loadingBar.visible = !this.loadingBar.loaded;


			}//,
			
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }

			);

			
	}


	loadAvatar2(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'Bernardo1.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.avatar = gltf.scene;

				this.avatar.position.set(-0.2,0.03,-0.5);
				this.avatar.scale.set(0.09,0.09,0.09);
				
				

				gltf.scene.traverse( child => {
					if (child.isMesh){
						if(child.name == 'Solid'){
						child.material.visible = false;
						
				
						 	child.castShadow = true;
						 	child.receiveShadow = true;
							 this.skyIsland.scale.set(30,30,30)
					}
				}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				//this.initPathfinding(this.navmesh);

				//this.loadingBar.visible = !this.loadingBar.loaded;


			}//,
			
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }

			);

			
	}

	loadAvatar3(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'Bernardo2.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.avatar = gltf.scene;

				this.avatar.position.set(-0.4,0.03,-0.5);
				this.avatar.scale.set(0.09,0.09,0.09);
				
				

				gltf.scene.traverse( child => {
					if (child.isMesh){
						if(child.name == 'Solid'){
						child.material.visible = false;
						
				
						 	child.castShadow = true;
						 	child.receiveShadow = true;
							 this.skyIsland.scale.set(30,30,30)
					}
				}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				//this.initPathfinding(this.navmesh);

				//this.loadingBar.visible = !this.loadingBar.loaded;


			}//,
			
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }

			);

			
	}
	
	loadEnvironment0(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'zSign.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.skyIsland = gltf.scene;

				this.skyIsland.position.set(0,0,0);
				//this.skyIsland.scale.set(0.1,0.1,0.1);
				
				

				gltf.scene.traverse( child => {
					if (child.isMesh){
						if(child.name == 'Solid'){
						child.material.visible = false;
						
				
						 	child.castShadow = true;
						 	child.receiveShadow = true;
							 this.skyIsland.scale.set(30,30,30)
					}
				}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				//this.initPathfinding(this.navmesh);

				//this.loadingBar.visible = !this.loadingBar.loaded;


			}//,
			
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }

			);

			
	}	

	setEnvironment2(){
        const loader = new RGBELoader().setDataType( THREE.UnsignedByteType ).setPath(this.assetsPath);
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        
        loader.load( 'planet/texture/venice_sunset_1k.hdr', 
		texture => {
          const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
          pmremGenerator.dispose();

          this.scene.environment = envMap;

		  this.loadingBar.visible = !this.loadingBar.loaded;
        }, 
		xhr => {
			this.loadingBar.update( 'envmap', xhr.loaded, xhr.total );
		},
		err => {
            console.error( err.message );
        } );
    }

	loadEnvironment2(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}planet/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'planet.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.planet = gltf.scene;

				//this.planet.scale.set(10,10,10);
				this.planet.position.set(0,-2.5,-5); //(0,-3,-4.5);
				// this.fans = [];

				// const mergeObjects = {elements2:[], elements5:[], terrain:[]};

				gltf.scene.traverse( child => {
					if (child.isMesh){
						// if (child.name == 'navmesh'){
						// 	this.navmesh = child;
						// 	//this.navmesh.geometry.rotateX( Math.PI/2 );
						// 	this.navmesh.quaternion.identity();
						// 	this.navmesh.position.set(0,0,0);
						// 	child.material.visible = true;
						// 	//this.navmesh.scale.set(10,10,10)
						// }else{
						 	child.castShadow = true;
						 	child.receiveShadow = true;
						//}
						//else if (child.name.includes('fan')){
						// 	this.fans.push( child );
						// }else if (child.material.name.includes('elements2')){
						// 	mergeObjects.elements2.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('elements5')){
						// 	mergeObjects.elements5.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('terrain')){
						// 	mergeObjects.terrain.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('sand')){
						// 	child.receiveShadow = true;
						// }else if ( child.material.name.includes('elements1')){
						// 	child.castShadow = true;
						// 	child.receiveShadow = true;
						// }else if (child.parent.name.includes('main')){
						// 	child.castShadow = true;
						// }
					}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				// this.initPathfinding(this.navmesh);

				// this.loadingBar.visible = !this.loadingBar.loaded;
			},
			// called while loading is progressing
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }
		);
	}	

	loadEnvironment3(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}planet/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'planet2.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.planet = gltf.scene;

				//this.planet.scale.set(10,10,10);
				this.planet.position.set(0,-10,0); //(0,-3,-4.5);
				this.planet.scale.set(17,17,17); //(0,-3,-4.5);
				this.planet.rotation.set(Math.PI/2,0,0); //(0,-3,-4.5);
				// this.fans = [];

				// const mergeObjects = {elements2:[], elements5:[], terrain:[]};

				gltf.scene.traverse( child => {
					if (child.isMesh){
						// if (child.name == 'navmesh'){
						// 	this.navmesh = child;
						// 	//this.navmesh.geometry.rotateX( Math.PI/2 );
						// 	this.navmesh.quaternion.identity();
						// 	this.navmesh.position.set(0,0,0);
						// 	child.material.visible = true;
						// 	//this.navmesh.scale.set(10,10,10)
						// }else{
						 	child.castShadow = true;
						 	child.receiveShadow = true;
						//}
						//else if (child.name.includes('fan')){
						// 	this.fans.push( child );
						// }else if (child.material.name.includes('elements2')){
						// 	mergeObjects.elements2.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('elements5')){
						// 	mergeObjects.elements5.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('terrain')){
						// 	mergeObjects.terrain.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('sand')){
						// 	child.receiveShadow = true;
						// }else if ( child.material.name.includes('elements1')){
						// 	child.castShadow = true;
						// 	child.receiveShadow = true;
						// }else if (child.parent.name.includes('main')){
						// 	child.castShadow = true;
						// }
					}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				// this.initPathfinding(this.navmesh);

				// this.loadingBar.visible = !this.loadingBar.loaded;
			},
			// called while loading is progressing
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }
		);
	}	

	loadIT(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'IT.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.it = gltf.scene;

				//this.planet.scale.set(10,10,10);
				this.it.position.set(-0.3,-0.05,1); //(0,-3,-4.5);
				this.it.scale.set(0.003,0.003,0.003); //(0,-3,-4.5);
				//this.planet.rotation.set(Math.PI/2,0,0); //(0,-3,-4.5);
				// this.fans = [];

				// const mergeObjects = {elements2:[], elements5:[], terrain:[]};

				gltf.scene.traverse( child => {
					if (child.isMesh){
						// if (child.name == 'navmesh'){
						// 	this.navmesh = child;
						// 	//this.navmesh.geometry.rotateX( Math.PI/2 );
						// 	this.navmesh.quaternion.identity();
						// 	this.navmesh.position.set(0,0,0);
						// 	child.material.visible = true;
						// 	//this.navmesh.scale.set(10,10,10)
						// }else{
						 	child.castShadow = true;
						 	child.receiveShadow = true;
						//}
						//else if (child.name.includes('fan')){
						// 	this.fans.push( child );
						// }else if (child.material.name.includes('elements2')){
						// 	mergeObjects.elements2.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('elements5')){
						// 	mergeObjects.elements5.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('terrain')){
						// 	mergeObjects.terrain.push(child);
						// 	child.castShadow = true;
						// }else if (child.material.name.includes('sand')){
						// 	child.receiveShadow = true;
						// }else if ( child.material.name.includes('elements1')){
						// 	child.castShadow = true;
						// 	child.receiveShadow = true;
						// }else if (child.parent.name.includes('main')){
						// 	child.castShadow = true;
						// }
					}
				});

				// this.scene.add(this.navmesh);

				// for(let prop in mergeObjects){
				// 	const array = mergeObjects[prop];
				// 	let material;
				// 	array.forEach( object => {
				// 		if (material == undefined){
				// 			material = object.material;
				// 		}else{
				// 			object.material = material;
				// 		}
				// 	});
				// }

				// this.initPathfinding(this.navmesh);

				// this.loadingBar.visible = !this.loadingBar.loaded;
			},
			// called while loading is progressing
			// xhr => {

			// 	this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			// },
			// // called when loading has errors
			// err => {

			// 	console.error( err );

			// }
		);
	}	

	loadSolids(){
		this.solids = new THREE.Group();
		this.scene.add(this.solids);
			

			const ttMesh = new THREE.Mesh( new THREE.TetrahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }) );
			ttMesh.name = 'door';
			ttMesh.position.set(-2,0.2,0);
			//this.scene.add(ttMesh);
			this.solids.add(ttMesh);

			const tdMesh = new THREE.Mesh( new THREE.TetrahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide }) );
			this.solids.add(tdMesh);
			tdMesh.name = 'tetraD';
			tdMesh.position.set(-2,0.2,0);
			tdMesh.rotation.set(0,0,Math.PI/2);
			//this.scene.add(tdMesh);
		
			const cMesh = new THREE.Mesh( new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }) );
			this.solids.add(cMesh);
			cMesh.name = 'door2';
			cMesh.position.set(-4,0.2,0);
			//this.scene.add(cMesh);
		
			const oMesh = new THREE.Mesh( new THREE.OctahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }) );
			this.solids.add(oMesh);
			oMesh.name = 'door-proxy';
			oMesh.position.set(-6,0.2,0);
			//this.scene.add(oMesh);
		
			const dMesh = new THREE.Mesh( new THREE.DodecahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }) );
			this.solids.add(dMesh);
			dMesh.name = 'door1';
			dMesh.position.set(-8,0.2,0);
			//this.scene.add(dMesh);
		
			const iMesh = new THREE.Mesh( new THREE.IcosahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }) );
			this.solids.add(iMesh);
			iMesh.name = 'fan';
			iMesh.position.set(-10,0.2,0);
			//this.scene.add(iMesh);	
		
			const sMesh = new THREE.Mesh( new THREE.SphereGeometry(0.1, 5, 5), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }) );
			this.solids.add(sMesh);
			sMesh.name = 'Door-null';
			sMesh.position.set(-12,0.2,0);
			//this.scene.add(sMesh);

		
			//this.colliders = solids;

			//this.loadNextAnim();
			//this.loadCrystal();

			

			function checkDoor(){
				if (door.trigger!==null && door.proxy.length==2 && door.doors.length==2){
					this.doors.push(Object.assign({}, door));
					door = { trigger:null, proxy:[], doors:[]};
				}
			}
            //this.loadCrystal();
	}

	//const answer = loadSolids();

	contextAction(){
		console.log('contextAction called '); // + JSON.stringify(this.onAction
		if (this.onAction !== undefined){
			console.log('onAction undefined ');
			if (this.onAction.action!=undefined){
				console.log('onAction.action undefined ');
				this.action = this.onAction.action;
			}
		}
	
		if (this.onAction.mode !== undefined){
			 switch(this.onAction.mode){
				 case 'door':
					 console.log('door');
					 this.sfx.play('shot');
					 const door = this.doors[this.onAction.index];
					 const left = door.doors[0];
					 const right = door.doors[1];
	
					this.tweens.push(new Tween(left.position, "z", left.postion.z -2, 2, function(){
						this.tweens.splice(this.tweens.indexOf(this),1);
					}))
	
					this.tweens.push(new Tween(right.position, "z", right.position.z + 2, 2, function(){
						this.tweens.splice(this.tween.indexOf(this), 1);
					}))
				 break;
	
				 case 'collect':
					console.log('collect');
					//this.activeCamera = this.player.cameras.collect;
					this.game.collect[this.onAction.index].visible = true;
					if(this.collected == undefined) this.collected = [];
					document.getElementById("briefcase").children[0].children[0].children[this.onAction.index].children[0].src = this.onAction.src;
					
				break;
			}
		}
	
		console.log("contextAction");
		
	}
	

	// loadCrystal(mode){
	// 	const game = this;
		
	// 	const loader = new FBXLoader().setPath(`${this.assetsPath}files/`);
		
	// 	loader.load( `PolygonMini_Fantasy/Models/SM_Env_Dungeon_Crystal_01.fbx`, function ( object ) {
	// 		game.scene.add(object);
			
    //         const scale = 0.002;
	// 		object.scale.set(scale, scale, scale);
	// 		object.name = "usb";
    //         object.position.set(0.7,0.03,-0.7);
    //         object.castShadow = true;

	//         game.collect.push(object);
	// 		//this.game.user.collect.push(object) = mode;

	// 		object.traverse( function ( child ) {
	// 			if ( child.isMesh ) {
    //                 child.castShadow = true;
    //                 child.receiveShadow = true;
	// 			}
	// 		} );
			
	// 		//game.loadNextAnim(loader);
	// 	},  ); //null, this.onError
	// }
    
	loadCrystal(){
		//const game = this;
	
		const loader = new GLTFLoader( ).setPath(`${this.assetsPath}glb/`);
		//const tLoader = new THREE.TextureLoader();
		
		loader.load( `ccc.glb`, gltf  => {
            this.scene.add( gltf.scene );
            const crystal = gltf.scene;

			//crystal = this.crystal;
		

            crystal.scale.set(0.1,0.1,0.1);
            crystal.position.set(0.7,0.03,-0.7); //(0,-3,-4.5);

			//this.crystal.name = 'crystal';
			
			//crystal.castShadow = true;
			
			game.collect.push(crystal);

			//console.log(User.collect.push(object));
			
            gltf.scene.traverse( child => {
                if (child.isMesh){
					child.castShadow = true;
					child.receiveShadow = true;
				}
			} );
			
		// tLoader.load(`${this.assetsPath}files/PolygonMini_Fantasy/Textures/PolygonMinis_Texture_01.png`, function(hexTexture_forest){
		//     object.traverse( function ( child ) {
		//         if ( child.isMesh ){
		//             child.material.map = hexTexture_forest; 
		//         }
		//         object.add(child)  
		//         //collider.push(child)
		//     });
		// });   
	
			//this.loadNextAnim(loader);
			//game\public\src\assets\mini_fantasy\Source_Files\POLYGON_Mini_Fantasy_Pack_StaticMeshes.ma
		});
	}

	createColliders(){
		//const game = this;
		this.object = new THREE.Group();

        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({color:0x222222, wireframe:true});
        
        //game.colliders = [];
		this.collider = this.colliders = [];
        
        // for (let x=-5; x<5; x+=1){
        //     for (let z=-5; z<5; z+=1){
        //         if (x==0 && z==0) continue;
        //         const box = new THREE.Mesh(geometry, material);
        //         box.position.set(x, 250, z);
		// 		//this.object.add(box);
        //         this.scene.add(box);
        //         this.collider.push(box);
        //     }
        // }
        
        const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const stage = new THREE.Mesh(geometry2, material);
        stage.position.set(0, 0, 1);
        this.collider.push(stage);
        this.scene.add(stage);
    }
	// lerp(a, b, t) {
	// 	return (1 - t) * a + t * b;
	//   }
	// getScrollPercent() {
	// 	const scrollTop = window.scrollY;
	// 	const docHeight = document.body.offsetHeight;
	// 	const winHeight = window.innerHeight;
	// 	//const scrollPercent = ((scrollTop) / (docHeight - winHeight)) * 100;
	// 	const scrollPercent = lerp(scrollPercent, scrollTop, 0.08);
	  
	// 	return scrollPercent; 
	//   }

	// createRobotArm() {
	// 	const material = new THREE.MeshPhongMaterial({ color: 0xfc8403 })
	  
	// 	const foundation1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(5,5,1,64), material);
	// 	foundation1.position.set(-35, 0.5, 35)
	// 	foundation1.castShadow = true;
	// 	foundation1.receiveShadow = true;
	// 	const foundation2 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 4, 4), material)
	// 	foundation2.position.y = 2
	// 	foundation2.castShadow = true;
	// 	foundation2.receiveShadow = true;
	// 	foundation1.add(foundation2)
	  
	// 	const joint1 = new THREE.Object3D;
	// 	joint1.position.y = 1
	// 	joint1.position.x = 1
	// 	joint1.rotation.x = - Math.PI / 4
	// 	foundation2.add(joint1)
	// 	const part1 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 15, 4), material)
	// 	part1.position.y = 7.5
	// 	part1.castShadow = true;
	// 	part1.receiveShadow = true;
	// 	joint1.add(part1)
	  
	// 	const joint2 = new THREE.Object3D;
	// 	joint2.position.y = 7.5
	// 	joint2.position.x = -1
	// 	joint2.rotation.x = Math.PI / 2
	// 	part1.add(joint2)
	// 	const part2 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 15, 4), material)
	// 	part2.position.y = 7.5
	// 	part2.castShadow = true;
	// 	part2.receiveShadow = true;
	// 	joint2.add(part2)
		
	// 	const joint3 = new THREE.Object3D;
	// 	joint3.position.y = 7.5
	// 	joint3.position.x = 1
	// 	joint3.rotation.x = Math.PI / 6
	// 	part2.add(joint3)
	// 	const part3 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 6, 4), material)
	// 	part3.position.y = 3
	// 	part3.castShadow = true;
	// 	part3.receiveShadow = true;
	// 	joint3.add(part3)
	  
	// 	scene.add(foundation1)
	  
	// 	// TWEEN FOUNDATION
	// 	const foundation1Tween1 = new TWEEN.Tween( {rotY: 0} ).to( { rotY: 2 * Math.PI }, 4000 )
	// 	  .easing(TWEEN.Easing.Quadratic.InOut)
	// 	const foundation1Tween2 = new TWEEN.Tween( {rotY: 2 *  Math.PI} ).to( { rotY: 0 }, 4000 )
	// 	  .easing(TWEEN.Easing.Quadratic.InOut)
	// 	foundation1Tween1.chain(foundation1Tween2)
	// 	foundation1Tween2.chain(foundation1Tween1)

	// 	const updateFoundation1 = function (object: {  rotY: number;}, 	elapsed: number) { foundation1.rotation.y = object.rotY;}

	// 	foundation1Tween1.onUpdate(updateFoundation1)
	// 	foundation1Tween2.onUpdate(updateFoundation1)
	// 	foundation1Tween1.start()
	  
	// 	// TWEEN JOINTS
	// 	const jointsTween1 = new TWEEN.Tween( {rotX1: - Math.PI / 2.5, 
	// 										   rotX2: Math.PI * ( 1.5 / 2 ),
	// 										   rotX3: - Math.PI / 2 } )
	// 	  .to( { rotX1: Math.PI / 2.5, rotX2: -Math.PI * ( 1.5/2 ), rotX3: Math.PI / 2  }, 5000 )
	// 	  .easing(TWEEN.Easing.Quadratic.InOut)
	// 	const jointsTween2 = new TWEEN.Tween( {rotX1: Math.PI / 2.5, rotX2: -Math.PI * ( 1.5/2 ), rotX3: Math.PI / 2  } )
	// 	  .to( { rotX1: - Math.PI / 2.5, rotX2: Math.PI * ( 1.5/2 ), rotX3: - Math.PI / 2  }, 5000 )
	// 	  .easing(TWEEN.Easing.Quadratic.InOut)
	// 	  jointsTween1.chain(jointsTween2)
	// 	  jointsTween2.chain(jointsTween1)
	// 	const updateJoint1 = function (object: {
	// 	  rotX1: number;
	// 	  rotX2: number;
	// 	  rotX3: number
	// 	}, elapsed: number) {
	// 	  joint1.rotation.x = object.rotX1;
	// 	  joint2.rotation.x = object.rotX2;
	// 	  joint3.rotation.x = object.rotX3;
	// 	}
	// 	jointsTween1.onUpdate(updateJoint1)
	// 	jointsTween2.onUpdate(updateJoint1)
	// 	jointsTween1.start()
	//   }
	  
	
	//   createRobotArm()
	  
	//   animate()

    
	initSounds(){
		
		this.listener = new THREE.AudioListener();
        this.camera.add( this.listener );
		this.sfx = new SFX(this.camera, `${this.assetsPath}factory/sfx/`, this.listener);
		this.sfx.load('computerAmbience', true, 0.1);
		this.user.initSounds();
		this.npcHandler.npcs.forEach( npc => npc.initSounds() ); //modified
		this.npcHandler65.npcs.forEach( npc => npc.initSounds() ); //modified
	}
	
	startRendering(){
		if (
			this.npcHandler.ready 
			&& this.npcHandler65.ready
			&& this.user.ready 
			&& this.bulletHandler //modified
			== undefined
			)
			{
			this.controller = new Controller(this);
			this.bulletHandler = new BulletHandler(this); //modified
			this.renderer.setAnimationLoop( this.render.bind(this) );
			this.ui.visible = true;
			this.initSounds();
			//this.skyIsland.rotationX += 0.1;
		}
	}

	render() {
		const game = this.game;

		const self = this;
		
		const dt = this.clock.getDelta();

		// if (this.fans !== undefined){
        //     this.fans.forEach(fan => {
        //         fan.rotateY(dt); 
        //     });
        // }


		if (this.npcHandler !== undefined ) this.npcHandler.update(dt);
		if (this.npcHandler65 !== undefined ) this.npcHandler65.update(dt); //added
		if (this.user !== undefined ) this.user.update(dt);
		if (this.controller !== undefined) this.controller.update(dt);
		if (this.bulletHandler !== undefined) this.bulletHandler.update(dt); //modified
		if (this.tween !== undefined) this.tween.update(dt);
		if (this.turtle !== undefined) this.turtle.update(dt);
		//if (this.portal !== undefined) this.portal.update(dt);
		//this.planet.rotateY += 0.1;
		//if (this.speechBubble!==undefined) this.speechBubble.show(this.camera.position);
		//if (this.speechBubble!==undefined) this.speechBubble.update(msg);
		// if (this.speechBubble1!==undefined) this.speechBubble1.update(msg);
		// if (this.speechBubble2!==undefined) this.speechBubble2.update(msg);
		// if (this.speechBubble3!==undefined) this.speechBubble3.update(msg);
		// if (this.speechBubble4!==undefined) this.speechBubble4.update(msg);
		// if (this.speechBubble5!==undefined) this.speechBubble5.update(msg);
		// if (this.speechBubble6!==undefined) this.speechBubble6.update(msg);

		if (this.robotBall !== undefined) this.robotBall.update(dt);


		// this.percentage = this.lerp(this.percentage, this.scrollY, 0.08);
		// this.t1.seek(this.percentage * (64000 / this.maxHeight));

		this.ui.actionBtn.style = 'display:none;';
		let trigger = false;
		
		if (this.doors !== undefined){
			console.log("door indefined");
			this.doors.forEach(function(door){
				if (this.user.object.position.distanceTo(door.trigger.position)<1){
					//game.actionBtn.style = 'display:block;';
					this.onAction = { action:'Yes', mode:'door', index:0 };
					trigger = true;
				}
			});
		}


        
        if (this.collect !== undefined && trigger){ // remove the exclamation from the target variable 
            this.collect.forEach(function(crystal){
				console.log("for each");
				if (crystal.visible && self.game.user.root.position.distanceTo(crystal.position)<1){
					this.actionBtn.style = 'displany:block;';
					this.onAction = { action:'No', mode:'collect', index:0, src:"usb.jpg" };
					trigger = true;
				}
			});
        }


		if (this.composer){
			this.composer.render();
		}else{
        	this.renderer.render( this.scene, this.camera );
		}


	

     }


 }

 export { Hex };