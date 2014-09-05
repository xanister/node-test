/**
 * NodeClient constructor
 * @returns {NodeClient}
 */
function NodeClient() {
    var connected,
            inputs,
            serverData,
            socket,
            socketId;

    /**
     * Bind server/input callback events
     */
    this.bindEvents = function() {
        var nodeClient = this;

        // Server callbacks
        socket.on('error', function() {
            console.error(arguments);
        });
        socket.on('message', function() {
            console.log(arguments);
        });
        socket.on("connection", function(response) {
            console.log("connection opened");
            nodeClient.setSocketId(response.id);
            nodeClient.setConnected(true);
            nodeClient.setServerData(response.data);
            nodeClient.getSocket().emit("clientInput", {inputs: nodeClient.getInputs(), id: nodeClient.getSocketId()});
        });
        socket.on('disconnect', function() {
            console.log("connection closed");
            nodeClient.setSocketId(false);
            nodeClient.setConnected(false);
        });
        socket.on("update", function(response) {
            nodeClient.setServerData(response.data);
        });

        // Desktop input callbacks
        document.onkeydown = function(event) {
            var keyPressed = String.fromCharCode(event.keyCode);
            nodeClient.setInput(keyPressed, true);
            nodeClient.getSocket().emit("clientInput", {inputs: nodeClient.getInputs(), id: nodeClient.getSocketId()});
        };
        document.onkeyup = function(event) {
            var keyPressed = String.fromCharCode(event.keyCode);
            nodeClient.setInput(keyPressed, false);
            nodeClient.getSocket().emit("clientInput", {inputs: nodeClient.getInputs(), id: nodeClient.getSocketId()});
        };

        // Mobile input callbacks
        document.addEventListener("touchstart", function(event) {
            event.preventDefault();
            var touchCount = nodeClient.getInputs().touchCount;
            nodeClient.setInput("touchCount", touchCount + 1);
            nodeClient.setInput("touchX", event.changedTouches[0].clientX);
            nodeClient.setInput("touchY", event.changedTouches[0].clientY);
            nodeClient.setInput("touchStartX", event.changedTouches[0].clientX);
            nodeClient.setInput("touchStartY", event.changedTouches[0].clientY);
            nodeClient.getSocket().emit("clientInput", {inputs: nodeClient.getInputs(), id: nodeClient.getSocketId()});
        });
        document.addEventListener("touchmove", function(event) {
            event.preventDefault();
            nodeClient.setInput("touchX", event.changedTouches[0].clientX);
            nodeClient.setInput("touchY", event.changedTouches[0].clientY);
            nodeClient.getSocket().emit("clientInput", {inputs: nodeClient.getInputs(), id: nodeClient.getSocketId()});
        });
        document.addEventListener("touchend", function(event) {
            event.preventDefault();
            var touchCount = nodeClient.getInputs().touchCount;
            nodeClient.setInput("touchCount", touchCount - 1);
            nodeClient.setInput("touchX", event.changedTouches[0].clientX);
            nodeClient.setInput("touchY", event.changedTouches[0].clientY);
            nodeClient.getSocket().emit("clientInput", {inputs: nodeClient.getInputs(), id: nodeClient.getSocketId()});
        });
    };

    /**
     * Create connection to server
     * @param {string} serverAddress
     */
    this.connect = function(serverAddress) {
        inputs = {touchX: 0, touchY: 0, touchStartX: 0, touchStartY: 0, touchCount: 0};
        socket = io.connect(serverAddress);
        this.bindEvents();
    };

    this.getConnected = function() {
        return connected;
    };

    this.getId = function() {
        return id;
    };

    this.getInputs = function() {
        return inputs;
    };

    this.getServerData = function() {
        return serverData;
    };

    this.getSocket = function() {
        return socket;
    };

    this.getSocketId = function() {
        return socketId;
    };

    this.setConnected = function(con) {
        connected = con;
    };

    this.setInput = function(key, value) {
        inputs[key] = value;
    };

    this.setServerData = function(data) {
        serverData = data;
    };

    this.setSocketId = function(id) {
        socketId = id;
    };
}