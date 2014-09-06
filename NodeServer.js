/**
 * NodeServer.js
 * Basic live data server
 *
 * Author: Nicholas Frees
 * Date: 09/06/2014
 */

/**
 * Requirements
 */
IO = require('socket.io');

/**
 * NodeServer
 *
 * @returns {NodeServer}
 */
function NodeServer() {
    /**
     * IO socket
     * @access private
     * @var object
     */
    var socket;

    /**
     * Connected clients
     * @access public
     * @var object
     */
    this.clients = {};

    /**
     * On client connect callback
     * @access public
     * @var function
     */
    this.connectCallback = false;

    /**
     * On client disconnect callback
     * @access public
     * @var function
     */
    this.disconnectCallback = false;

    /**
     * Send message to all connected clients
     * @param {string} message
     */
    this.broadcast = function(message) {
        socket.sockets.emit("message", message);
    };

    /**
     * Log out to server
     * @param {string} message
     */
    this.log = function(message) {
        console.log(message);
    };

    /**
     * Send message to specific connected client
     * @param {string} clientId
     * @param {string} message
     */
    this.message = function(clientId, message) {
        this.clients[clientId].emit("message", message);
    };

    /**
     * Start server
     * @param {integer} port
     * @param {function} cCallback
     * @param {function} dCallback
     */
    this.start = function(port, cCallback, dCallback) {
        socket = IO.listen(port || 3000);

        this.connectCallback = cCallback || false;
        this.disconnectCallback = dCallback || false;

        // Listen for connections and bind events per client
        var nodeServer = this;
        socket.on('connection', function(client) {
            console.log("Client[" + client.id + "] connected");

            // Save client
            nodeServer.clients[client.id] = client;

            // Send connection success to client
            client.emit('connection', {result: 'success', id: client.id});

            // Callback
            if (nodeServer.connectCallback)
                nodeServer.connectCallback({id: client.id});

            // Accept input
            client.on("clientInput", function(inputs) {
                nodeServer.clients[client.id].inputs = inputs;
            });

            // Update on disconnect
            client.on("disconnect", function() {
                console.log("Client[" + client.id + "] disconnected");
                delete nodeServer.clients[client.id];
                if (nodeServer.disconnectCallback)
                    nodeServer.disconnectCallback({id: client.id});
            });
        });
    };

    /**
     * Sync data to all connected clients
     * @param {object} data
     */
    this.update = function(data) {
        socket.sockets.emit("update", data);
    };
}

module.exports = NodeServer;