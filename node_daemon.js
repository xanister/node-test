var NodeServer = require("./NodeServer");

function onClientConnect(client) {
    ns.message(client.id, "Welcome " + client.id);
    ns.broadcast(client.id + " has connected.");
}

function onClientDisconnect(client) {
    ns.broadcast(client.id + " has disconnected.");
}

var ns = new NodeServer();
ns.start(3000, onClientConnect, onClientDisconnect);