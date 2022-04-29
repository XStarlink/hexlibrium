//const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const Moralis = require('moralis/node');
const request = require("request-promise");
const fs = require('fs');

const { chownSync } = require('fs');
const axios = require('axios').default;


const serverUrl = "https://j0lip0zao6vv.usemoralis.com:2053/server";
const appId = "H4IUDMf6Zm1QYt16U1oIsLqDSLuooY7pJrI6LrI4";
const masterKey = "Vlp0Dp6vQqJ4qVg2BCSXydaKbwxSMBqvjm21NINf";

Moralis.start({ serverUrl, appId, masterKey })



const PORT = process.env.PORT || 1000;


express()
  .use(express.static(path.join(__dirname, 'src')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('view'))
  .get('/login', (req, res) => res.render('moralis'))
  .post('/login',express.urlencoded({extended: true}), async (req, res) =>{

    let u = await req.body

    // const buffer = Buffer.from(`${u.file}`, "base64");
    // fs.writeFileSync(`${path.join(__dirname,'src/images/out.png')}`, buffer);

    const image = u.file;
    const file = new Moralis.File("image.png", { base64: image });
    
    const imageIPFS = await file.saveIPFS({useMasterKey:true});
    console.log(imageIPFS)
    res.render('moralis')
  //   const options = {
  //     uri:`http://localhost:1000/images/out.png` ,
  //     resolveWithFullResponse: true,
  //     encoding: null, // <-- this is important for binary data like images.
  //   };

  //   request(options)
  //     .then((response) => {
        
  //       const data = Array.from(Buffer.from(response.body, "binary"));
  //       const contentType = response.headers["content-type"];
  //       const file = new Moralis.File("logo", data, contentType);
  //       file.saveIPFS({useMasterKey:true}).then((res) => {
  //         res.save()
  //         return file.save();
  //       })
        
  //     //file.save()
  //     })
  //     .then((file) =>{

  //       console.log(file.url())
  //       res.render('moralis')
  //     }) 
  //     .catch(console.error);

  } )
  .get('/game', (req, res) => res.render('index'))
  .get('/hexlibrium', (req, res)=> res.render('hexlibrium'))
  .get('/blockly', (req, res)=> res.render('blockly'))
  //.get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


// var express = require('express');
// var app = express();
// var path = require('path');
// var PORT = 1000;
  
// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname,'views'))

// app.get('/', function (req, res, next) {
//     res.render('view.ejs');
// })
  
// // Static Middleware 
// app.use(express.static(path.join(__dirname, 'src')))

// app.listen(PORT, function(err){
//     if (err) console.log(err);
//     console.log("Server listening on PORT", PORT);
// });


// var express    = require('express')
// var serveIndex = require('serve-index')
// var path = require('path')
// var serveStatic = require('serve-static')
// var app = express()
// var port = process.env.PORT || 1000;
// /**for files */
// app.use(serveStatic(path.join(__dirname, 'src')));
// /**for directory */
// app.use('/', express.static('src'), serveIndex('src', {'icons': true}))

// // Listen
// app.listen(port,  function () {
//   console.log('listening on port:',+ port );
// })

///////////////////////////////////////////////////////////////////////////////////

//const { alchemyApiKey, mnemonic } = require('./secrets.json');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1", //https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 // "127.0.0.1"
      port: 7545, //7545 
      network_id: "*" // Match any network id
    }
    ,
    develop: {
      port: 8545
    },

    // ropsten: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`),
    //   network_id: 3,       // Ropsten's id
    //   gas: 5500000,        // Ropsten has a lower block limit than mainnet
    //   confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    //  },
     
//    },
//  };
  }
};

 


// require('dotenv').config()
// const express = require('express');
// const app = express();
// const path = require('path')
// const route = require('./routers/main')
// const adminRoute = require('./routers/adminRoute')
// const morgan = require('morgan')
// const mongoose = require('mongoose')
// const database = require('./database/database')
// const userRouter = require('./routers/userRouter')
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// //const {ExpressPeerServer} = require('peer')
// const session = require('express-session')
// // const peer = ExpressPeerServer(http , {
// // 	debug:true
// //   });
// //var Blockly = require('blockly');

// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname,'views'))
// app.use(session({
//     secret:process.env.TOKEN_SECRET, cookie:{maxAge:999999}, resave:false, saveUninitialized:true
// }))
// app.use(express.static(path.join(__dirname,'public')));
// //app.use(express.static(path.join(__dirname,'views')));
// app.use(express.static(path.join(__dirname,'public/aps')));
// app.use(express.static(path.join(__dirname,'public/src')));
// //app.use(express.static(path.join(__dirname,'node_modules/three/examples/fonts')));
// app.use(route)
// //app.use('/peerjs', peer);
// app.use(morgan('dev'))
// app.use(express.json(), userRouter )
// // app.use(loggedRouter)
// app.use(express.json(), adminRoute)

// ///////////// Nik Code //////////////////////
// io.sockets.on('connection', function(socket){
// 	socket.userData = { x:0, y:0, z:0, heading:0 };//Default values;
 
// 	console.log(`${socket.id} connected`);
// 	socket.emit('setId', { id:socket.id });
	
//     socket.on('disconnect', function(){
// 		socket.broadcast.emit('deletePlayer', { id: socket.id });
//     });	
	
// 	socket.on('init', function(data){
// 		console.log(`socket.init ${data.model}`);
// 		socket.userData.model = data.model;
// 		socket.userData.colour = data.colour;
// 		socket.userData.x = data.x;
// 		socket.userData.y = data.y;
// 		socket.userData.z = data.z;
// 		socket.userData.heading = data.h;
// 		socket.userData.pb = data.pb,
// 		socket.userData.action = "Idle";
// 	});
	
// 	socket.on('update', function(data){
// 		socket.userData.x = data.x;
// 		socket.userData.y = data.y;
// 		socket.userData.z = data.z;
// 		socket.userData.heading = data.h;
// 		socket.userData.pb = data.pb,
// 		socket.userData.action = data.action;
// 	});
	
// 	socket.on('chat message', function(data){
// 		console.log(`chat message:${data.id} ${data.message}`);
// 		io.to(data.id).emit('chat message', { id: socket.id, message: data.message });
// 	})
// ///////////////////////////////////////////////
// let cli = []
// socket.on('newUser' , (id , room)=>{
// 	cli.push(id)
// 	cli.push(room)
// 	socket.join(room);
// 	socket.to(room).broadcast.emit('userJoined' , id);
// 	socket.on('disconnectt' , ()=>{
		
// 		socket.to(room).broadcast.emit('userDisconnect' , id);
// 		socket.disconnect(id)
// 		var i = cli.indexOf(socket);
// 		cli.splice(i, 1);
		
// 	})
//   })
//   })

// http.listen(process.env.PORT||3000, function(){
//   console.log('listening on *:3000');
// });
// ////////////////////////// Nik Code ///////////////////////
// setInterval(function(){
// 	const nsp = io.of('/');
//     let pack = [];
	
//     for(let id in io.sockets.sockets){
//         const socket = nsp.connected[id];
// 		//Only push sockets that have been initialised
// 		if (socket.userData.model!==undefined){
// 			pack.push({
// 				id: socket.id,
// 				model: socket.userData.model,
// 				colour: socket.userData.colour,
// 				x: socket.userData.x,
// 				y: socket.userData.y,
// 				z: socket.userData.z,
// 				heading: socket.userData.heading,
// 				pb: socket.userData.pb,
// 				action: socket.userData.action
// 			});    
// 		}
//     }
// 	if (pack.length>0) io.emit('remoteData', pack);
// }, 40);
 
// ////////////////////////////////////////////////////////////////
// const Blockly = require('blockly')
// require('blockly/blocks')
// require('blockly/javascript')

// const Gamepad = require('blockly-gamepad')


// // //blocky

// var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
// <block type="text_print" x="37" y="63">
//   <value name="TEXT">
//     <shadow type="text">
//       <field name="TEXT">Hello from Blockly!</field>
//     </shadow>
//   </value>
// </block>
// </xml>`;

// try {
//   var xml = Blockly.Xml.textToDom(xmlText);

//   // Create workspace and import the XML
//   var workspace = new Blockly.Workspace();
//   Blockly.Xml.domToWorkspace(xml, workspace);

//   // Convert code and log output
//   var code = Blockly.Python.workspaceToCode(workspace);
//   console.log(code);
// }
// catch (e) {
//   console.log(e);
// }


