// Custom libraries
UniverseObject = require("./UniverseObject");
Entity = require("./Entity");
Region = require("./Region");
NodeServer = require("./NodeServer");

function GameServer() {
    var interval, nodeServer, region;

    // Initialize the world
    this.init = function() {
        nodeServer = new NodeServer();
        nodeServer.init(3000, this.onConnect, this.onDisconnect);


        region = new Region();

        // Create some zombies
        for (i = 0; i < 50; i++) {
            var e = new Entity(region);
            e.warp(Math.floor(Math.random() * 1500), Math.floor(Math.random() * 1500));
            region.addUo(e);
        }

        // World interval
        interval = setInterval(this.run, 33);
    };

    this.onConnect = function(client) {
        // Add new entity for client
        var e = new Entity(region, false, "player", {name: "player"}, "hero");
        e.speed = 2;
        e.client = client;

        region.addUo(e);
    };

    this.onDisconnect = function(client) {
        region.removeUo(client.id);
    };

    this.run = function() {
        // Update connected clients
        var uos = region.getUos();
        nodeServer.sendData(uos);

        // Update entities
        for (var id in uos) {
            var uo = uos[id];
            uo.decide(uo.goal);
            uo.act();
        }
    };
}

module.exports = GameServer;