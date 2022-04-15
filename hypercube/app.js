const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 1000;

express()
  .use(express.static(path.join(__dirname, 'src')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('view'))
  .get('/hexlibrium', (req, res)=> res.render('hexlibrium'))
  .get('/blockly', (req, res)=> res.render('blockly'))
  //.get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));