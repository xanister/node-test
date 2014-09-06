/**
 * NodeClient.js
 * Basic live data nodejs/socket.io client
 *
 * Author: Nicholas Frees
 * Date: 09/06/2014
 */

/**
 * NodeClient
 *
 * @returns {NodeClient}
 */
function NodeClient() {
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

    /**
     * Data synced to server
     * @access public
     * @var object
     */
    this.data = {};

    /**
     * Update server with client inputs
     */
    this.inputUpdate = function() {
        socket.emit("clientInput", inputs);
    };

    /**
     * Connection callback
     */
    this.onConnect = function() {
        console.log("connection opened");
    };

    /**
     * Disconnect callback
     */
    this.onDisconnect = function() {
        console.log("connection closed");
    };

    /**
     * Error callback
     * @param {object} e
     */
    this.onError = function(error) {
        console.log(error);
    };

    /**
     * Message recieved callback
     * @param {string} message
     */
    this.onMessage = function(message) {
        console.log(message);
    };

    /**
     * Open connectionand bind server/input callback events
     * @param {string} serverAddress
     */
    this.start = function(serverAddress) {
        // Open connection
        socket = io.connect(serverAddress);

        // Bind events
        var nodeClient = this;

        /**
         * On error
         * @param {object} error
         */
        socket.on('error', function(error) {
            nodeClient.onError(error);
        });

        /**
         * On message
         * @param {string} message
         */
        socket.on('message', function(message) {
            nodeClient.onMessage(message);
        });

        /**
         * On connection
         * @param {object} response
         */
        socket.on("connection", function(response) {
            nodeClient.id = response.id;
            nodeClient.connected = true;
            nodeClient.onConnect(response);
        });

        /**
         * On disconnect
         */
        socket.on('disconnect', function() {
            nodeClient.connected = false;
            nodeClient.onDisconnect();
        });

        /**
         * On update
         * @param {object} data
         */
        socket.on("update", function(data) {
            nodeClient.data = data;
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