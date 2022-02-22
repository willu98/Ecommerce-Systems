#!/usr/bin/env node

const { createServer } = require('net');

const port   = process.argv[2] || 4413;
const server = createServer();

server.listen(port, () => console.log(`Server Listening at: ${server.address().address}:${server.address().port}`));
server.on('connection', (socket) => {
  const client = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Connection from ${client}`);

  socket.on('error', (err) => console.log(`Error: ${err}`));
  socket.on('end', () => console.log(`Closing connection with ${client}`));
  socket.on('data', function (request) {
    let values = request.toString().split(/\s+/g).map((token) => +token);
    if (values.length >= 4 && values.every(validate)) {
      socket.write('' + computeDistance(...values.map(asRadian)));
      socket.end();
    } else {
      socket.write(`Don't understand: ${request}`);
      socket.end();
    }
  });  
});

/// Helper functions

function validate(value, i) {
  let range = i % 2 == 0 ? 90 : 180;
  return typeof value === 'number' 
    && !Number.isNaN(value)
    && value >= -range
    && value <= range;
}

function asRadian(n) {
  return n * Math.PI / 180;
}

function computeDistance(t1, n1, t2, n2) {
  let y = Math.cos(t1) * Math.cos(t2);
  let x = Math.pow(Math.sin((t2 - t1) / 2), 2) + y * Math.pow(Math.sin((n2 - n1) / 2), 2);
  return 12742 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}