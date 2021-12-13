    
    
    import { Mech } from './Mechanics.js';
    //var Blockly = require('blockly');
    //import Blockly from 'blockly';
    //import {Game} from "./gameBlockly";
    
    class UI{
    constructor(game){
        this.assetsPath = '/src/assets/';

        this.user = game.user;
  
        this.game = game;

        //this.controller = game.controller;

        const playBtn = document.getElementById('playBtn');        
        playBtn.style.cssText =  "position:absolute; bottom: 80px; left: 50%; transform: translateX(-50%); display: none;"       
        playBtn.addEventListener('click', this.playBtnPressed.bind(this));
        document.body.appendChild(playBtn);//added

        //rpg

        const sfxBtn = document.getElementById("sfx-btn");
        sfxBtn.style.cssText = "position:absolute; bottom:60%; width:40px; height:40px; background:#FF0000; border:#444 solid medium; border-radius:50%; left:5%; transform:translateX(-50%);";
        sfxBtn.addEventListener('click', this.toggleUser.bind(this));
        document.body.appendChild(sfxBtn);//added

        const briefcaseBtn = document.getElementById("briefcase-btn");
        briefcaseBtn.style.cssText = "position:absolute; bottom:50%; width:40px; height:40px; background:#00FF00; border:#444 solid medium; border-radius:50%; left:5%; transform:translateX(-50%);";
        briefcaseBtn.addEventListener('click', this.toggleBriefcase.bind(this));
        document.body.appendChild(briefcaseBtn);//added

        const cameraBtn = document.getElementById("camera-btn");
        cameraBtn.style.cssText = "position:absolute; bottom:40%; width:40px; height:40px; background:#0000FF; border:#444 solid medium; border-radius:50%; left:5%; transform:translateX(-50%);";
        cameraBtn.addEventListener('click', this.toggleTarget.bind(this));
        document.body.appendChild(cameraBtn);//added
        

    
        this.actionBtn = document.getElementById('action-btn');
        //this.actionBtn.style.cssText = "position:absolute; top20%; width:40px; height:40px; background:#FF0000; border:#444 solid medium; border-radius:50%; right:20%; transform:translateX(-50%);";//added
        this.actionBtn.addEventListener('click', this.contextAction.bind(this));
        document.body.appendChild(this.actionBtn);//added

        const fireBtn = document.createElement("div");
        fireBtn.setAttribute('id', 'fire-btn')
        fireBtn.style.cssText = "position:absolute; bottom:55px; width:40px; height:40px; background:#FFFFFF; border:#444 solid medium; border-radius:50%; left:50%; transform:translateX(-50%);";
        fireBtn.addEventListener('mousedown', this.fire.bind(this, true));
        fireBtn.addEventListener('mouseup', this.fire.bind(this, false));
        document.body.appendChild(fireBtn);

        const getBtn = document.createElement("div");
        getBtn.setAttribute('id', 'get-btn')
        getBtn.style.cssText = "position:absolute; bottom:55px; width:40px; height:40px; background:#FFFFFF; border:#444 solid medium; border-radius:50%; left:60%; transform:translateX(-50%);";
        getBtn.addEventListener('mousedown', this.getter.bind(this, true));
        getBtn.addEventListener('mouseup', this.getter.bind(this, false));
        document.body.appendChild(getBtn);

        const setBtn = document.createElement("div");
        setBtn.setAttribute('id', 'set-btn')
        setBtn.style.cssText = "position:absolute; bottom:55px; width:40px; height:40px; background:#FFFFFF; border:#444 solid medium; border-radius:50%; left:40%; transform:translateX(-50%);";
        setBtn.addEventListener('mousedown', this.setter.bind(this, true));
        setBtn.addEventListener('mouseup', this.setter.bind(this, false));
        document.body.appendChild(setBtn);

        const windowBtn = document.createElement("div");
        windowBtn.setAttribute('id', 'set-btn')
        windowBtn.style.cssText = "position:absolute; name: home; top:5%; width:60px; height:60px; background:#000000; border:#444 solid medium; border-radius:50%; right:5%; transform:translateX(-50%);";
        windowBtn.addEventListener('click', this.windowAction.bind(true));
        // windowBtn.addEventListener('mouseup', this.windowAction.bind(this, false));
        document.body.appendChild(windowBtn);

        //window
        // const windowBtn = document.getElementById('div');
        // windowBtn.setAttribute('id', 'windows-btn')
        // windowBtn.style.cssText = "position:absolute; name: home; top:5%; width:60px; height:60px; background:#ff0000; border:#444 solid medium; border-radius:50%; right:5%; transform:translateX(-50%);";
        // windowBtn.addEventListener('click', this.windowAction.bind(this));
        // document.body.appendChild(windowBtn);//added

       
   
    
        if(window.location.href == 'http://localhost:1000/'){
            console.log('awudhiuawd')
            let setBtn = document.getElementById('set-btn')
            let fireBtn = document.getElementById('fire-btn')
            let getBtn = document.getElementById('get-btn')
            let windowBtn = document.getElementById("windowBtn")
            let petRow = document.getElementById('petsRow')
            windowBtn.style.display = 'none'
            setBtn.style.display = 'none'
            fireBtn.style.display = 'none'
            getBtn.style.display = 'none'
            cameraBtn.style.display = 'none'
            briefcaseBtn.style.display = 'none'
            playBtn.style.display = 'none'
            sfxBtn.style.display = 'none'
            petRow.style.display = 'none'
        }else{
            console.log('rest') 
        }
        
        //blockly

        // var containerr = document.getElementById('containerr')
        // var bl = document.getElementById('bl')
        // var bc = document.getElementById('bc')
        // var playCode = document.getElementById('playCode')

        // bl.addEventListener('click', function(){
        //     bl.style.opacity = 0.7
        //     containerr.style.display = 'block'
            
        //     setTimeout(()=>{
        //     bc.style.display = 'block'
        //     bl.style.display = 'none'
        //     bl.style.opacity = 1
        //     },400)
            
        
        // })

        // bc.addEventListener('click', function(){
        //     bc.style.opacity = 0.7
        //     containerr.style.display = 'none'
            
        //     setTimeout(()=>{
        //     bc.style.display = 'none'
        //     bl.style.display = 'block'
        //     bc.style.opacity = 1
        //     },400)
            
        // })


        //graph
        // var graph = document.getElementById('graph')
        // var bll = document.getElementById('bll')
        // var bcc = document.getElementById('bcc')
        // document.body.appendChild(graph);

        // bll.addEventListener('click', function(){
        //     bll.style.opacity = 0.7
        //     graph.style.display = 'block'
            
        //     setTimeout(()=>{
        //     bcc.style.display = 'block'
        //     bll.style.display = 'none'
        //     bll.style.opacity = 1
        //     },400)
            
        
        // })

        // bcc.addEventListener('click', function(){
        //     bcc.style.opacity = 0.7
        //     graph.style.display = 'none'
            
        //     setTimeout(()=>{
        //     bcc.style.display = 'none'
        //     bll.style.display = 'block'
        //     bcc.style.opacity = 1
        //     },400)
            
        // })

        // //graph
        // var graph = document.getElementById('graph')
        // var bll = document.getElementById('bll')
        // var bcc = document.getElementById('bcc')
        // document.body.appendChild(graph);

        // bll.addEventListener('click', function(){
        //     bll.style.opacity = 0.7
        //     graph.style.display = 'block'
            
        //     setTimeout(()=>{
        //     bcc.style.display = 'block'
        //     bll.style.display = 'none'
        //     bll.style.opacity = 1
        //     },400)
            
        
        // })

        // bcc.addEventListener('click', function(){
        //     bcc.style.opacity = 0.7
        //     graph.style.display = 'none'
            
        //     setTimeout(()=>{
        //     bcc.style.display = 'none'
        //     bll.style.display = 'block'
        //     bcc.style.opacity = 1
        //     },400)
            
        // })

        // var iframeBlockly = document.createElement('iframe')

        // iframeBlockly.setAttribute('style', 'overflow: auto;', 'background: transparent') // width: 200%; height: 200%;

        // var closeLevel = document.createElement('button')
        // var closeText = document.createTextNode('Close Level')
        // closeLevel.appendChild(closeText)
        // closeLevel.classList.add('btn-primary')
        // closeLevel.classList.add('btn')
        // closeLevel.setAttribute('id','bhh')

        // var openLevel = document.createElement('button')
        // var openText = document.createTextNode('Open Level')
        // openLevel.appendChild(openText)
        // openLevel.classList.add('btn-primary')
        // openLevel.classList.add('btn')
        // openLevel.setAttribute('id','bjj')

        // document.body.appendChild(openLevel)    
        // document.body.appendChild(closeLevel)

        
        // var bhh = document.getElementById('bhh')
        // bhh.setAttribute('style', 'display:none;position: absolute;margin: auto;right:3%;background:coral;padding:10px;border: none;border-radius: 5px;top:3%;border: 2px solid chocolate;font-weight: 900;color:#fff;')
        // var bjj = document.getElementById('bjj')
        // bjj.setAttribute('style', 'position: absolute;margin: auto;right:3%;background:coral;padding:10px;border: none;border-radius: 5px;top:3%;border: 2px solid chocolate;font-weight: 900;color:#fff;')

        // iframeBlockly.style.cssText = 'position:absolute; top:1%; background:#FFFFFF; border:#444 solid medium; left:1%;'
        // //iframeBlockly.src = 'http://localhost:3000/src/html/blockly.html'
        // iframeBlockly.src = '/src/html/blockly.html'
        // iframeBlockly.className = 'iframeBlock'
        // iframeBlockly.style.display = 'none'
        // iframeBlockly.setAttribute("width", "50%")
        // iframeBlockly.setAttribute("height", "20%")

      

        // console.log(iframeBlockly)
        // document.body.appendChild(iframeBlockly)


        // bhh.addEventListener('click', function(){
        //     bhh.style.opacity = 0.7
        //     iframeBlockly.style.display = 'none'
        //     setTimeout(()=>{
        //     bjj.style.display = 'block'
        //     bhh.style.display = 'none'
        //     bhh.style.opacity = 1
        //     },400)
            
        
        // })

        // bjj.addEventListener('click', function(){
        //     bjj.style.opacity = 0.7
        //     iframeBlockly.style.display = 'block'
            
        //     setTimeout(()=>{
        //     bjj.style.display = 'none'
        //     bhh.style.display = 'block'
        //     bjj.style.opacity = 1
        //     },400)
            
        // })


       var iframeBlockly = document.createElement('iframe')

       iframeBlockly.setAttribute('style', 'overflow: auto;', 'background: transparent') // width: 200%; height: 200%;

        var closeLevel = document.createElement('button')
        var closeText = document.createTextNode('Close Level')
        closeLevel.appendChild(closeText)
        closeLevel.classList.add('btn-primary')
        closeLevel.classList.add('btn')
        closeLevel.setAttribute('id','bhh')

        var openLevel = document.createElement('button')
        var openText = document.createTextNode('Open Level')
        openLevel.appendChild(openText)
        openLevel.classList.add('btn-primary')
        openLevel.classList.add('btn')
        openLevel.setAttribute('id','bjj')

        document.body.appendChild(openLevel)    
        document.body.appendChild(closeLevel)

        
        var bhh = document.getElementById('bhh')
        bhh.setAttribute('style', 'display:none; position: absolute; margin: auto; left:50%;background:coral;padding:10px;border: none;border-radius: 5px;top:3%;border: 2px solid chocolate;font-weight: 900;color:#fff;')
        var bjj = document.getElementById('bjj')
        bjj.setAttribute('style', 'position: absolute;margin: auto;left:50%;background:coral;padding:10px;border: none;border-radius: 5px;top:3%;border: 2px solid chocolate;font-weight: 900;color:#fff;')

        iframeBlockly.style.cssText = 'position:absolute; top:1%; background:#FFFFFF; border:#444 solid medium; left:1%;'
        //iframeBlockly.src = 'http://localhost:1000/blockly'
        iframeBlockly.src = 'https://hexlibrium.herokuapp.com//blockly'

        iframeBlockly.className = 'iframeBlock'
        iframeBlockly.style.display = 'none'
        iframeBlockly.setAttribute("width", "50%")
        iframeBlockly.setAttribute("height", "20%")

      

        // console.log(iframeBlockly)
        document.body.appendChild(iframeBlockly)


        bhh.addEventListener('click', function(){
            bhh.style.opacity = 0.7
            iframeBlockly.style.display = 'none'
            setTimeout(()=>{
            bjj.style.display = 'block'
            bhh.style.display = 'none'
            bhh.style.opacity = 1
            },400)
            
        
        })

        bjj.addEventListener('click', function(){
            bjj.style.opacity = 0.7
            iframeBlockly.style.display = 'block'
            
            setTimeout(()=>{
            bjj.style.display = 'none'
            bhh.style.display = 'block'
            bjj.style.opacity = 1
            },400)

            // window.location.href = 'http://localhost:1000/blockly'
            
        })


        // const Blockly = require('blockly')
        // require('blockly/blocks')
        // require('blockly/javascript')

        // const Gamepad = require('blockly-gamepad')


		// let toolbox = document.getElementById('toolbox')

		// // init the Gamepad
		// Blockly.Gamepad.init({
		// 	toolbox,
		// 	blocks
		// })

		// // create the workspace
		// Blockly.inject('blocklyDiv', {
		// 	toolbox
		// })

		// // the gamepad is ready to use
		// let gamepad = new Blockly.Gamepad()


        // function getUrlVars() {
        //     var vars = {};
        //     var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        //         vars[key] = value;
        //     });
        //     return vars;
        // }

        // // global vars
        // let {
        //     start,
        //     categories,
        //     id
        // } = getUrlVars()

        // // update parameters
        // start = start != undefined
        // categories = categories != undefined
        // id = (id == '1') ? 0 : 1

        // // update the checkers
        // if (start) document.getElementById('start_check').checked = true
        // if (categories) document.getElementById('categories_check').checked = true

        // // set the toolbox
        // const toolbox = document.getElementById(categories ? 'toolbox_c' : 'toolbox')

        
        //planet////////////////////////////////

        // document.getElementById("seed").value = seed;
        // if (!document.getElementById("triangles").checked) {
        //     document.getElementById("tessellations").setAttribute("max", 6);
        //     document.getElementById("tessellations").value = 4;
        //     document.getElementById("tessellations-value").textContent = 4;
        // }
    
        // // Set variables then generate planet
        // document.getElementById("generate").addEventListener("click", function() {
        //     if (document.getElementById("seed").value === null || document.getElementById("seed").value === "" || document.getElementById("seed-random").checked) {
        //         seed     = Math.random();
        //         document.getElementById("seed").value = seed;
        //     } else {
        //         seed     = document.getElementById("seed").value;
        //     }
    
        //     lacunarity   = document.getElementById("lacunarity").value;
        //     persistance  = document.getElementById("persistance").value;
        //     octaves      = document.getElementById("octaves").value;
        //     planetSize   = document.getElementById("size").value;
        //     tessellation = document.getElementById("tessellations").value;
        //     minHeight    = Number(document.getElementById("min-height").value);
        //     maxHeight    = Number(document.getElementById("max-height").value);
        //     type         = document.querySelector("input[name='type']:checked").value;
    
        //     clearScene();
        //     beginWorker(type, planetSize, tessellation, minHeight, maxHeight, seed, lacunarity, persistance, octaves);
        // });
    
        // // Change max tessellation value depending on selected
        // var radios = document.querySelectorAll("input[type=radio][name='type']");
    
        // function changeHandler(event) {
        // if (this.value !== "NORMAL") {
        //     document.getElementById("tessellations").setAttribute("max", 6);
        //     document.getElementById("tessellations").value = 4;
        //     document.getElementById("tessellations-value").textContent = 4;
        // } else {
        //     document.getElementById("tessellations").setAttribute("max", 500);
        //     document.getElementById("tessellations").value = 100;
        //     document.getElementById("tessellations-value").textContent = 100;
        // }
        // }
    
        // Array.prototype.forEach.call(radios, function(radio) {
        //     radio.addEventListener("change", changeHandler);
        // });
    
        // // Adjust slider values
        // document.getElementById("lacunarity").addEventListener("input", function() {
        //     document.getElementById("lacunarity-value").textContent = document.getElementById("lacunarity").value;
        // });
    
        // document.getElementById("persistance").addEventListener("input", function() {
        //     document.getElementById("persistance-value").textContent = document.getElementById("persistance").value;
        // });
    
        // document.getElementById("octaves").addEventListener("input", function() {
        //     document.getElementById("octaves-value").textContent = document.getElementById("octaves").value;
        // });
    
        // document.getElementById("size").addEventListener("input", function() {
        //     document.getElementById("size-value").textContent = document.getElementById("size").value;
        // });
    
        // document.getElementById("tessellations").addEventListener("input", function() {
        //     document.getElementById("tessellations-value").textContent = document.getElementById("tessellations").value;
        // });
    
        // document.getElementById("min-height").addEventListener("input", function() {
        //     document.getElementById("min-height-value").textContent = document.getElementById("min-height").value;
        // });
    
        // document.getElementById("max-height").addEventListener("input", function() {
        //     document.getElementById("max-height-value").textContent = document.getElementById("max-height").value;
        // });
        //planet


        this.game = game;
    }



    set visible(value){
        const playBtn = document.getElementById('playBtn');
        const ui = document.getElementById('ui');
        const display = (value) ? 'block' : 'none';
        playBtn.style.display = display;
        ui.style.display = display;
    }

    playBtnPressed(){
        const playBtn = document.getElementById('playBtn');
        playBtn.style.display = 'none';
        const img = playBtn.getElementsByTagName('img')[0];
        img.src = `${this.assetsPath}factory/playagain.png`;
        this.game.startGame();
    }

    fire(mode){
        //console.log(`Fire:${mode}`);
        if (this.game.active) this.user.firing = mode;
    }

    contextAction(){
        if (this.game.active) this.game.contextAction();
        //console.log("context")
    }

    getter(mode){ //added
        //console.log(`Fire:${mode}`);
        if (this.game.active) this.user.getter = mode;
    }

    setter(mode){ //added
        //console.log(`Fire:${mode}`);
        if (this.game.active) this.user.setter = mode;
    }

    showGameover(){
        const gameover = document.getElementById('gameover');
        gameover.style.display = 'block';

        setTimeout(hideGameover, 2000);
        
        function hideGameover(){
            gameover.style.display = 'none';
            const playBtn = document.getElementById('playBtn');
            playBtn.style.display = 'block';
        }
    }

    // set ammo(value){
    //     const progressBar = document.getElementsByName('ammoBar')[0];
    //     const percent = `${value * 100}%`;
    //     progressBar.style.width = percent;
    // }

    // set health(value){
    //     const progressBar = document.getElementsByName('healthBar')[0];
    //     const percent = `${value * 100}%`;
    //     progressBar.style.width = percent;
    // }
    toggleUser(mode){
        //console.log(`Fire:${mode}`);
        if (this.game.active) this.user.toggleUser = mode;
        //if (this.game.active) this.turtle.update = mode;
    }

    toggleBriefcase(){
        
        const briefcase = document.getElementById("briefcase");
        const open = (briefcase.style.opacity > 0);
        
        if (open){
            briefcase.style.opacity = "0";
        }else{
            briefcase.style.opacity = "1";
        }
    }
    
    toggleTarget(){
        //console.log(`Fire:${mode}`);
        if (this.game.active) this.game.controller.changeTarget(0);
    }

    
    windowAction(){
        // if (this.game.active) this.game.controller.windowGate();

            //hexlibrium
            // let lv5 = document.querySelectorAll('.level')
            // let name = document.querySelectorAll('.name')
            // if(name[0].textContent == 'Impossible Ocean'){
            //     lvl[1].addEventListener('click',(e)=>{
            //         e.preventDefault()
                    window.location.href = 'https://hexlibrium.herokuapp.com/'
                    //window.location.href = 'http://localhost:1000/'
                // })
            // }
            //hexlibrium
    }



    //contextAction(){
        //this.mech = new Mech(this);
        //this.fire(true);
        //this.controller = new Controller(this);
        
    //} 
    
    // fire(mode){
    //     //console.log(`Fire:${mode}`);
    //     this.controller = new Controller(this);
    //     this.user.firing = mode;
    // }





}

export { UI };