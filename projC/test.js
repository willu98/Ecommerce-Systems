#!/usr/bin/env node

const { createConnection } = require('net');
const { createInterface } = require('readline');

const host = process.argv[2];
const port = process.argv[3];
const client = createConnection(port, host);

// command-line interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

let response = [];
let connection;

client.on('error', () => console.log(`Error when connecting ${connection}.`));
client.on('close', () => console.log(`Disconnected from ${connection}`));
client.on('connect', () => {
  connection = `${client.remoteAddress}:${client.remotePort}`;
  console.log(`Connected to ${connection}`);
  rl.question("Request: ", (request) => {
    client.write(request);
    client.end();
  });
});

client.on('data', (chunk) => response.push(chunk));
client.on('end', () => {
  console.log(response.join(""));
  rl.close();
});