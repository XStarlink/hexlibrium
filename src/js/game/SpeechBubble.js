import * as THREE from '/libs5/three128/three.module.js';
class SpeechBubble{
	constructor(game, msg, size=1, oopt, bubble){
		this.config = { size:12, padding:10, colour:'#fff', width:256, height:256 }; //font:'Calibri', 

		var oopt;

		const opt = {
			assets:[
				`${game.assetsPath}images/zs1.png`,
				`${game.assetsPath}images/zs2.png`,
				`${game.assetsPath}images/zs3.png`,
				`${game.assetsPath}images/zs4.png`,
				`${game.assetsPath}images/zs5.png`,
				`${game.assetsPath}images/zs6.png`,
				`${game.assetsPath}images/zs7.png`,
				`${game.assetsPath}images/zs8.png`,
				`${game.assetsPath}images/zs9.png`,
				`${game.assetsPath}images/zs10.png`,
				`${game.assetsPath}images/zs11.png`,
				`${game.assetsPath}images/zs12.png`,

				`${game.assetsPath}images/flowerOfLife.png`,
				`${game.assetsPath}images/sriYantra.png`,
				`${game.assetsPath}images/bluePaper.png`
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
		this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
		this.mesh.position.set(0,0,0);

		//const speech = (bubble) =>{
			if(bubble == true){
			game.scene.add(this.mesh);
			}if(bubble == false){
			this.game.scene.add(this.mesh);
			}
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
				if (msg!==undefined) self.update(msg);
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function ( err ) {
				console.error( 'An error happened.' );
			}
		);
		//console.log('teste')
	}
	
	update(msg){
		if (this.mesh===undefined) return;
		
		let context = this.context;
		
		if (this.mesh.userData.context===undefined){
			const canvas = this.createOffscreenCanvas(this.config.width, this.config.height);
			this.context = canvas.getContext('2d');
			context = this.context;
			context.font = `${this.config.size}pt ${this.config.font}`;
			context.fillStyle = this.config.colour;
			context.textAlign = 'center';
			this.mesh.material.map = new THREE.CanvasTexture(canvas);
		}
		
		const bg = this.img;
		context.clearRect(0, 0, this.config.width, this.config.height);
		context.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.config.width, this.config.height);
		this.wrapText(msg, context);
		
		this.mesh.material.map.needsUpdate = true;
	}
	
	createOffscreenCanvas(w, h) {
		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		return canvas;
	}
	
	wrapText(text, context){
		const words = text.split(' ');
        let line = '';
		const lines = [];
		const maxWidth = this.config.width - 2*this.config.padding;
		const lineHeight = this.config.size + 8;
		
		words.forEach( function(word){
			const testLine = `${line}${word} `;
        	const metrics = context.measureText(testLine);
        	const testWidth = metrics.width;
			if (testWidth > maxWidth) {
				lines.push(line);
				line = `${word} `;
			}else {
				line = testLine;
			}
		});
		
		if (line != '') lines.push(line);
		
		let y = (this.config.height - lines.length * lineHeight)/2;
		
		lines.forEach( function(line){
			context.fillText(line, 128, y);
			y += lineHeight;
		});
	}
	
	show(pos){
		if (this.mesh!==undefined && this.player!==undefined){
			this.mesh.position.set(this.player.object.position.x, this.player.object.position.y + 380, this.player.object.position.z);
			this.mesh.lookAt(pos);
		}
	}
}

export {SpeechBubble};