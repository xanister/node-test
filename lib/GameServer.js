// Custom libraries
UniverseObject = require("./UniverseObject");
Entity = require("./Entity");

// Globals
var uos = {};

function GameServer(port) {
    this.port = port;
    this.app = require('http').createServer(this.serverHandler);
    this.io = require('socket.io')(this.app);
    this.fs = require('fs');

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

        // Emit welcome message on connection
        this.io.sockets.on('connection', function(socket) {
            // Add new entity for client
            uos[socket.id] = (new Entity(socket.id, "Entity!!!"));

            // Connect
            socket.emit('connection', {id: socket.id});

            // Accept input
            socket.on("clientInput", function(data) {
                var action = inputToAction(data.keyPressed);
                uos[data.id].setAction(action);
            });

            // Start broadcasting to this client
            setInterval(function() {
                uos[socket.id].run();
                socket.emit("update", {uos: uos});
            }, 33);
        });
    };
}

function inputToAction(input) {
    switch (input) {
        case 'd':
            return {name: 'step', args: {x: 1, y: 0}};
        default:
            return {name: 'idle', args: {}};
    }
}

module.exports = GameServer;