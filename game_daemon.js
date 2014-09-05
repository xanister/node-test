/*
 var GameServer = require("./lib/GameServer");

 var gs = new GameServer();
 gs.init();
 */
var NodeServer = require("./lib/NodeServer");

function onClientConnect(client) {
    ns.sendMessage("Welcome!");
    console.log("DD");
}

function onClientDisconnect(client) {
    ns.sendMessage("Goodbye!");
}

var ns = new NodeServer;
ns.init(3000, onClientConnect, onClientDisconnect);
ns.sendMessage("FF");