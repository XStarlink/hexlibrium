//const Moralis = require("moralis");
/* Moralis init code */
const serverUrl = "https://sqddgitgrn5r.usemoralis.com:2053/server";
const appId = "gfL7RpTRmNzgD7h1zXYfsn8Op3LGEpSUESkAKRag";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({
      signingMessage: "Log in using Moralis",
    })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
document.getElementById("upload").onclick = upload;
//console.log(v);

async function upload(){

  // const fileInput = document.getElementById("file");
  // const data = fileInput.files[0]
  // const file = new Moralis.File("moralis.png", data);
  // await file.saveIPFS();
  // console.log(file.hash());
  // console.log(file.ipfs());

  // Save file input to IPFS
  const data = fileInput.files[0]
  //const file = new Moralis.File(data.name, data)
  const file = new Moralis.File("moralis.png", data);
  await file.saveIPFS();

  console.log(file.ipfs(), file.hash())

  // Save file reference to Moralis
  const jobApplication = new Moralis.Object('Applications')
  jobApplication.set('name', 'Satoshi')
  jobApplication.set('resume', file)
  await jobApplication.save()

  // Retrieve file
  const query = new Moralis.Query('Applications')
  query.equalTo('name', 'Satoshi')
  query.find().then(function ([application]) {
    const ipfs = application.get('resume').ipfs()
    const hash = application.get('resume').hash()
    console.log('IPFS url', ipfs)
    console.log('IPFS hash', hash)
  })
}

// // Save file input to IPFS
// const data = fileInput.files[0]
// const file = new Moralis.File(data.name, data)
// await file.saveIPFS();

// //console.log(file.ipfs(), file.hash())

// // Save file reference to Moralis
// const jobApplication = new Moralis.Object('Applications')
// jobApplication.set('name', 'Satoshi')
// jobApplication.set('resume', file)
// await jobApplication.save()

// // Retrieve file
// const query = new Moralis.Query('Applications')
// query.equalTo('name', 'Satoshi')
// query.find().then(function ([application]) {
//    const ipfs = application.get('resume').ipfs()
//    const hash = application.get('resume').hash()
//    console.log('IPFS url', ipfs)
//    console.log('IPFS hash', hash)
// })

