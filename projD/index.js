const { createConnection } = require('net');
const path    = require('path');
const express = require('express');
const session = require('express-session');
const dao     = require('./dao.js');
const http = require('http');
const cors = require('cors');
const app  = express();
const port = process.argv[2] || 0;
const labCPort = 44130;
const hostTCP = 0;
const portTCP = 0;

app.enable('trust proxy');

app.use(session({
  name: 'project-D',
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  proxy: true,
  cookie:{
    secure:false
  }
}));

// Enable CORS
app.use(cors());

// Use middleware to parse request body as JSON.
// bodyParser is deprecated and now merged into express itself.
app.use(express.json());

// Use middleware to serve static files from the public directory.
app.use(express.static(path.join(__dirname, 'public')));




// Log connections
app.use((req, res, next) => {
  console.log(`From ${req.ip}, Request ${req.url}`);
  next();
});


/*API*/
/**
 * API endpoint to obatin all products within a category, based on category id
 */
app.get('/api/products/category', function (req, res) {
  if(req.query.id){
    //console.log('Request ' + req.url + ' from' + req.ip);
    dao.getAllProducts_CId(req.query.id, function(rows) {
      //console.log(typeof rows);
      //console.log(rows);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(rows));
    });
  } else{
    dao.getAllProducts_CId(req.query.id, function(rows) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(req.session.cart));
    });
  }
});

app.get('/api/search', function (req, res) {
  //console.log('Request ' + req.url + ' from' + req.ip);
  dao.getAllProducts(req.query.id, function(rows) {
    //console.log(typeof rows);
    //console.log(rows);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(rows));
  });
});

app.get('/api/product/reccomended', function (req, res) {
  let connection;
  let response = [];
  const client = createConnection(36666, '::');

  client.on('error', (err) => {
      console.log(`Error when connecting ${connection}.`);
      //res.write(`${err}`);
  });
  client.on('connect', () => {

    connection = `${client.remoteAddress}:${client.remotePort}`;
    console.log(`Connected to ${connection}`);
    client.write('4');
    
  });

  client.on('data', (chunk) => {
      cosole.log(chunk);
      //response.push(`The distance from (${req.session.lat}, ${req.session.lng}) to (${req.query.lat}, ${req.query.lng}) is: ${chunk} km`);
  });

  client.on('end', () => {
      //res.write(response.join(""));
      //res.end();
  });

  client.on('close', () => {
      //console.log(`Disconnected from ${connection}`);
  });  
})


/**
 * API endpoint to obatin all products within a category, based on category id
 */
app.get('/api/products', function (req, res) {
  if(req.query.id){
    //console.log('Request ' + req.url + ' from' + req.ip);
    dao.getProduct_Id(req.query.id, function(rows) {
      //console.log(typeof rows);
      //console.log(rows);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(rows));
    });
  }
});


/**
 * gets the products in session cart,
 */
app.get('/api/cart', function (req, res) {
  req.session.cart = req.session.cart || [];
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(req.session.cart));
  res.end();
});


app.get('/api/Catalog', function (req, res) {
  const tmp = req.url.split('/api')[1];
  http.get(`http://localhost:${labCPort}${tmp}`, (response) => {
    let result = '';
    response.on('data', (chunk) => { result += chunk; });

    response.on('end', () => {
        try {
            res.send(result);
        } catch (e) {
            console.error(e.message);
        }
    });      
  });  
});


/**
 * post request to update users cart
 */
app.post( '/api/cart/update', function (req, res) {
  req.session.cart = req.session.cart || [];
  if (req.body.qty <= 0) {
    req.session.cart = req.session.cart.filter(item => 
      item.id != req.body.id
    );
  }
  else{
    if (req.session.cart.some(e => e.id === req.body.id)) {
      req.session.cart.map(item => {  
        if(item.id == req.body.id) {
          item.qty = req.body.qty;
        }
      });      
    } else {
      req.session.cart.push(req.body);
    }    
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(req.session.cart);
  console.log(req.session.cart);
});

app.post('/api/cart/checkout', function (req, res) {
      console.log(req.session.cart);
      console.log(req.body);
      req.session.cart = [];      
      res.setHeader('Content-Type', 'application/json');
      res.send(req.session.cart);
});

const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`server listening to ${host}:${port}`);
});
