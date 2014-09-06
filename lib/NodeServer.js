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
 * @param {function} connectCallback
 * @param {function} disconnectCallback
 * @param {function} inputCallback
 * @returns {NodeServer}
 */
function NodeServer(connectCallback, disconnectCallback, inputCallback) {
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
    this.connectCallback = connectCallback || false;

    /**
     * On client disconnect callback
     * @access public
     * @var function
     */
    this.disconnectCallback = disconnectCallback || false;

    /**
     * On client input callback
     * @access public
     * @var function
     */
    this.inputCallback = inputCallback || false;

    /**
     * Send message to all connected clients
     * @param {string} message
     */
    this.broadcast = function(message) {
        socket.sockets.emit("message", {time: this.getTime(), message: message});
    };

    /**
     * Get current server time
     * @returns {Date}
     */
    this.getTime = function() {
        return new Date();
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
        if (this.clients[clientId])
            this.clients[clientId].emit("message", {time: this.getTime(), message: message});
    };

    /**
     * Start server
     * @param {integer} port
     */
    this.start = function(port) {
        socket = IO.listen(port || 3000);

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
                if (nodeServer.inputCallback)
                    nodeServer.inputCallback({id: client.id, inputs: inputs});
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
        socket.sockets.emit("update", {time: this.getTime(), data: data});
    };
}

module.exports = NodeServer;