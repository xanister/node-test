function GameClient() {
    // Make globally available
    window.gameClient = this;

    // Basic vars
    this.uos = {};
    this.serverAddress = 'http://forest.anslemgalaxy.com:3000';
    this.inputs = {};

    // Initialize
    this.init = function() {
        this.socket = io.connect(this.serverAddress);
        this.bindEvents();
    };

    this.bindEvents = function() {
        // Server callbacks
        this.socket.on('error', function() {
            console.error(arguments);
        });
        this.socket.on('message', function() {
            console.log(arguments);
        });
        this.socket.on("connection", function(client) {
            window.gameClient.id = client.id;
        });
        this.socket.on("clientInput", function() {
            console.log(arguments);
        });
        this.socket.on("update", function() {
            window.gameClient.uos = arguments[0].uos;
        });

        // Input callbacks
        document.onkeydown = function(event) {
            var keyPressed = String.fromCharCode(event.keyCode);
            window.gameClient.inputs[keyPressed] = true;
            window.gameClient.socket.emit("clientInput", {inputs: window.gameClient.inputs, id: window.gameClient.id});
        };

        document.onkeyup = function(event) {
            var keyPressed = String.fromCharCode(event.keyCode);
            delete window.gameClient.inputs[keyPressed];
            window.gameClient.socket.emit("clientInput", {inputs: window.gameClient.inputs, id: window.gameClient.id});
        };
    };
}