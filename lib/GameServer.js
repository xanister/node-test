// Custom libraries
UniverseObject = require("./UniverseObject");
Entity = require("./Entity");

// Globals
var uos = {};
var io, fs;

function GameServer(port) {
    this.port = port || 3000;
    this.app = require('http').createServer(this.serverHandler);
    io = require('socket.io')(this.app);
    fs = require('fs');

    this.serverHandler = function(req, res) {
        fs.readFile(__dirname + '/index.html',
                function(err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error loading index.html');
                    }

                    res.writeHead(200);
                    res.end(data);
                });
    };

    this.init = function() {
        this.app.listen(3000);

        // Create some zombies
        for (i = 0; i < 10; i++) {
            var e = new Entity();
            e.warp(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));
            uos[e.id] = e;
        }

        // Emit welcome message on connection
        io.sockets.on('connection', function(socket) {
            // Add new entity for client
            uos[socket.id] = new Entity(socket.id, "Entity!!!", {name: "player"});

            // Connect
            socket.emit('connection', {id: socket.id});

            // Accept input
            socket.on("clientInput", function(data) {
                uos[data.id].inputs = data.inputs;
            });
        });

        // World interval
        setInterval(function() {
            io.sockets.emit("update", {uos: uos});
            for (var id in uos) {
                uos[id].decide(uos[id].baseGoal);
                uos[id].act();
            }
        });
    };
}

module.exports = GameServer;