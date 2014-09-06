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
    ns.broadcast(client.id + " has disconnected.");
};

// Start it up
ns.start(3000);