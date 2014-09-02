// Custom libraries
UniverseObject = require("./UniverseObject");
Entity = require("./Entity");

// Globals
uos = {};
var app, io, fs;

function GameServer(port) {
    this.port = port || 3000;
    app = require('http').createServer(this.serverHandler);
    io = require('socket.io')(app);
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
        app.listen(3000);

        // Create some zombies
        for (i = 0; i < 50; i++) {
            var e = new Entity();
            e.warp(Math.floor(Math.random() * 1500), Math.floor(Math.random() * 1500));
            uos[e.id] = e;
        }

        // Emit welcome message on connection
        io.sockets.on('connection', function(socket) {
            // Add new entity for client
            uos[socket.id] = new Entity(socket.id, "Entity!!!", {name: "player"});
            uos[socket.id].speed = 2;
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
                uos[id].decide(uos[id].goal);
                uos[id].act();
            }
        }, 33);
    };
}

module.exports = GameServer;