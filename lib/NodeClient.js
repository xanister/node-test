/**
 * NodeClient.js
 * Basic live data nodejs/socket.io client
 *
 * Author: Nicholas Frees
 * Date: 09/06/2014
 */

/**
 * NodeClient
 * @param {function} messageCallback
 * @param {function} updateCallback
 * @param {function} connectCallback
 * @param {function} disconnectCallback
 * @param {function} errorCallback
 * @returns {NodeClient}
 */
function NodeClient(messageCallback, updateCallback, connectCallback, disconnectCallback, errorCallback) {
    /**
     * IO socket
     * @access private
     * @var object
     */
    var socket;

    /**
     * Connected flag
     * @access public
     * @var bool
     */
    this.connected = false;

    /**
     * Data synced to server
     * @access public
     * @var object
     */
    this.data = {};

    /**
     * Client id
     * @access public
     * @var string
     */
    this.id = false;

    /**
     * Client inputs
     * @access public
     * @var object
     */
    this.inputs = {touchX: 0, touchY: 0, touchStartX: 0, touchStartY: 0, touchCount: 0};

    /*
     * Server time update was last run
     * @access public
     * @var Date
     */
    this.lastUpdateTime = false;

    /**
     * Update server with client inputs
     */
    this.inputUpdate = function() {
        socket.emit("clientInput", this.inputs);
    };

    /**
     * Connection callback
     * @param {object} response
     */
    this.connectCallback = connectCallback || function(response) {
        console.log("Connection opened. ID: " + response.id);
    };

    /**
     * Disconnect callback
     */
    this.disconnectCallback = disconnectCallback || function() {
        console.log("Connection closed");
    };

    /**
     * Error callback
     * @param {object} response
     */
    this.errorCallback = errorCallback || function(response) {
        console.log(response.error);
    };

    /**
     * Message recieved callback
     * @param {string} response
     */
    this.messageCallback = messageCallback || function(response) {
        console.log(response.message);
    };

    /**
     * Update data callback
     */
    this.updateCallback = updateCallback || false;

    /**
     * Open connection and bind server/input callback events
     * @param {string} serverAddress
     */
    this.start = function(serverAddress) {
        // Open connection
        socket = io.connect(serverAddress, {'sync disconnect on unload': true});

        // Bind events
        var nodeClient = this;

        /**
         * On error
         * @param {object} response
         */
        socket.on('error', function(response) {
            nodeClient.errorCallback(response);
        });

        /**
         * On message
         * @param {string} response
         */
        socket.on('message', function(response) {
            nodeClient.messageCallback(response);
        });

        /**
         * On connection
         * @param {object} response
         */
        socket.on("connection", function(response) {
            nodeClient.id = response.id;
            nodeClient.connected = true;
            nodeClient.connectCallback(response);
        });

        /**
         * On disconnect
         * TODO: stop gracefully when server disappears unexpectedly
         */
        socket.on('disconnect', function() {
            socket.disconnect();
            nodeClient.connected = false;
            nodeClient.disconnectCallback();
        });

        /**
         * On update
         * @param {object} response
         */
        socket.on("update", function(response) {
            nodeClient.data = response.data;
            nodeClient.lastUpdateTime = response.time;
        });

        /**
         * Client keydown
         * @param {Event} event
         */
        document.onkeydown = function(event) {
            var keyPressed = String.fromCharCode(event.keyCode);
            nodeClient.inputs[keyPressed] = true;
            nodeClient.inputUpdate();
        };

        /**
         * Client keyup
         * @param {Event} event
         */
        document.onkeyup = function(event) {
            var keyPressed = String.fromCharCode(event.keyCode);
            nodeClient.inputs[keyPressed] = false;
            nodeClient.inputUpdate();
        };

        /**
         * Client touchstart
         * @param {Event} event
         */
        document.addEventListener("touchstart", function(event) {
            event.preventDefault();
            nodeClient.inputs["touchCount"]++;
            nodeClient.inputs["touchX"] = event.changedTouches[0].clientX;
            nodeClient.inputs["touchY"] = event.changedTouches[0].clientY;
            nodeClient.inputs["touchStartX"] = event.changedTouches[0].clientX;
            nodeClient.inputs["touchStartY"] = event.changedTouches[0].clientY;
            nodeClient.inputUpdate();
        });

        /**
         * Client touchmove
         * @param {Event} event
         */
        document.addEventListener("touchmove", function(event) {
            event.preventDefault();
            nodeClient.inputs["touchX"] = event.changedTouches[0].clientX;
            nodeClient.inputs["touchY"] = event.changedTouches[0].clientY;
            nodeClient.inputUpdate();
        });

        /**
         * Client touchend
         * @param {Event} event
         */
        document.addEventListener("touchend", function(event) {
            event.preventDefault();
            nodeClient.inputs["touchCount"]--;
            nodeClient.inputs["touchX"] = event.changedTouches[0].clientX;
            nodeClient.inputs["touchY"] = event.changedTouches[0].clientY;
            nodeClient.inputUpdate();
        });
    };
}
