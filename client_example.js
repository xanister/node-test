/**
 * client_example.js
 * Basic example of node client
 */

// Create dom element to show messages
var messageContainer = document.createElement("div");
document.body.appendChild(messageContainer);

// Create new node client
var nc = new NodeClient();

// Set callbacks as needed
nc.messageCallback = function(response) {
    messageContainer.innerHTML += ("<p>" + response.message + "</p>");
};

// Start it up
nc.start("http://example.com:3000");
