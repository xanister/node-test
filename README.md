node-test
=========

Simple nodejs Server/Client system for live data executions.

=========

/**
 * server_example.js
 * Basic example of node server
 * Usage: nodejs server_example.js
 */

// Include the NodeServer
var NodeServer = require("./NodeServer");

// Create the node server
var ns = new NodeServer();

// Set callbacks as needed
ns.connectCallback = function(client) {
    ns.message(client.id, "Welcome " + client.id);
    ns.broadcast(client.id + " has connected.");
};
ns.disconnectCallback = function(client) {
    ns.message(client.id, "Goodbye " + client.id);
    ns.broadcast(client.id + " has disconnected.");
};

// Start it up
ns.start(3000);
