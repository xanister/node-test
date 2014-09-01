function GameClient() {
    window.gameClient = this;
    window.uos = {};
    this.serverAddress = 'http://forest.anslemgalaxy.com:3000';
}

GameClient.prototype.init = function() {
    this.socket = io.connect(this.serverAddress);

    this.socket.on('error', function() {
        console.error(arguments)
    });
    this.socket.on('message', function() {
        console.log(arguments)
    });
    this.socket.on("connection", function(client) {
        window.gameClient.id = client.id;
        window.gameClient.bindInputEvents();
    });
    this.socket.on("clientInput", function() {
        console.log(arguments);
    });
    this.socket.on("update", function() {
        window.uos = arguments[0].uos;
        window.uo = window.uos[window.gameClient.id];
    });
};

GameClient.prototype.bindInputEvents = function() {
    document.onkeypress = function(event) {
        var keyPressed = String.fromCharCode(event.keyCode);
        window.gameClient.socket.emit("clientInput", {keyPressed: keyPressed, id: window.gameClient.id});
    };
};