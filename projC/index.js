const { createConnection } = require('net');
const express = require('express');
const session = require('express-session');
const dao     = require('./dao.js');
const http = require('http');
const { info } = require('console');
const cors = require('cors');


const app  = express();
const port = process.argv[3] || 44130;

const hostTCP = process.argv[3];
const portTCP = process.argv[4];

app.enable('trust proxy');
app.use(cors());

app.use(session({
  name: 'project-C',  
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  proxy: true
}));


app.get('/GeoNode', function (req, res) {
    let connection;
    let response = [];
    const client = createConnection(portTCP, hostTCP);

    client.on('error', (err) => {
        console.log(`Error when connecting ${connection}.`);
        //res.write(`${err}`);
    });
    client.on('connect', () => {

        connection = `${client.remoteAddress}:${client.remotePort}`;
        console.log(`Connected to ${connection}`);
        //res.write(`Connected to ${connection}`);
        if(!req.session.lat && !req.session.lng){
            req.session.lat = req.query.lat;
            req.session.lng = req.query.lng;
            res.write('RECIEVED');
            res.end();
        }
        else{
            const request = `${req.session.lat} ${req.session.lng} ${req.query.lat} ${req.query.lng}`;
            client.write(request);
            client.end();
        }

    });

    client.on('data', (chunk) => {
        response.push(`The distance from (${req.session.lat}, ${req.session.lng}) to (${req.query.lat}, ${req.query.lng}) is: ${chunk} km`)
    });

    client.on('end', () => {
        res.write(response.join(""));
        res.end();
    });

    client.on('close', () => {
        console.log(`Disconnected from ${connection}`);
    });

});

app.get('/Catalog', function (req, res) {
    if(req.query.id){
        console.log('Request ' + req.url + ' from' + req.ip);
        //console.log(req.query.id);
        dao.getCatID(req.query.id, function(rows) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(rows));
            res.end();
        });
    } else{
        console.log('Request ' + req.url + ' from' + req.ip);
        dao.getAllCat(req.query.id, function(rows) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(rows));
            res.end();
        });
    }
});


app.get('/Trip', function (req, res) {
    //4BRcRJh3nJ6LNvs0reLpwHvrhCfSA3ac
    http.get(`http://www.mapquestapi.com/directions/v2/route?key=4BRcRJh3nJ6LNvs0reLpwHvrhCfSA3ac&from=${encodeURIComponent(req.query.from)}&to=${encodeURIComponent(req.query.to)}`, (response) => {
        //console.log('test');
        let result = '';
        response.on('data', (chunk) => { result += chunk; });

        response.on('end', () => {
            const respObj = {
                distance:0,
                time:0
            };

            try {
              const parsedData = JSON.parse(result);
              //console.log(parsedData.info.statuscode);
              if(parsedData.info.statuscode != 0 && parsedData.info.messages.includes("Unable to calculate route.")){
                //console.log('test');
                res.write(JSON.stringify(respObj));//, null, 4);
                res.end();
              }
              else{
                //console.log('test2');
                respObj.distance = parsedData.route.distance;
                respObj.time = parsedData.route.time;
                res.write(JSON.stringify(respObj));//, null, 4);
                res.end();
              }
            } catch (e) {
              console.error(e.message);
            }
        });
    });
});


const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`server listening to ${host}:${port}`);
});
