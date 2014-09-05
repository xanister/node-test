// Custom libraries
UniverseObject = require("./UniverseObject");
Entity = require("./Entity");

function NodeServer() {
    var app, clients, connectCallback, disconnectCallback, fs, io, port, uos;

    // Get connected clients
    this.getClients = function() {
        return clients;
    };

    this.addClient = function(socket) {
        clients[socket.id] = {id: socket.id, socket: socket, inputs: {}};
    };

    this.getClient = function(id) {
        return clients[id];
    };

    this.removeClient = function(id) {
        delete clients[id];
    };

    // Initialize the world
    this.init = function(p, cCallback, dCallback) {
        // Start listening
        port = p;
        connectCallback = cCallback;
        disconnectCallback = dCallback;
        clients = {};

        app = require('http').createServer(this.serverHandler);
        fs = require('fs');
        io = require('socket.io')(app);

        try {
            app.listen(port);
        } catch (e) {
            console.log(e);
        }

        // Listen for connections
        var nodeServer = this;
        io.sockets.on('connection', function(socket) {
            console.log("Client[" + socket.id + "] connected");

            nodeServer.addClient(socket);

            // Connect
            socket.emit('connection', {id: socket.id});

            // Accept input
            socket.on("clientInput", function(response) {
                nodeServer.getClients(response.id).inputs = response.inputs;
            });

            // Update on disconnect
            socket.on("disconnect", function() {
                console.log("Client[" + socket.id + "] disconnected");
                nodeServer.removeClient(socket.id);

                nodeServer.disconnectCallback({id: socket.id});
            });

            nodeServer.connectCallback({id: socket.id});
        });
    };

    this.log = function(message) {
        console.log(message);
    };

    // Send data to clients
    this.sendData = function(data) {
        io.sockets.emit("update", {data: data});
    };

    this.sendMessage = function(message) {
        io.sockets.emit("message", {message: message});
    };

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
}

module.exports = NodeServer;