/**
 * WebSocket Adapter
 * @module adapters/ws
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var SocketIOClient = require('socket.io-client');
var SocketIO;

if (process.env.NODE_ENV !== 'browser') {
	SocketIO = require('socket.io');
}


/* Methods -------------------------------------------------------------------*/

/**
 * Listens for WebSocket connections on the selected port.
 * @param {Server} server The Kalm Server reference
 * @param {function} callback The success callback for the operation
 */
function listen(server, callback) {
	server.listener = SocketIO(server.options.port);

	server.listener.on('connection', server.handleRequest.bind(server));
	server.listener.on('error', (err) => {
		server.emit('error', err);
	});

	callback();
}

/**
 * Sends a message with a socket client
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	socket.send(payload);
}

/**
 * Stops listening for WebSocket connections and closes the Server.
 * @param {Server} server The Kalm Server reference
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.listener.close();
	return callback();
}

/**
 * Creates a client
 * @param {Client} client The client to create the socket for
 * @returns {Socket} The created WebSocket client
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = SocketIOClient.connect(client.options.hostname+':'+client.options.port);
	}

	socket.on('message', client.handleRequest.bind(client));

	socket.on('error', client.handleError.bind(client));

	socket.on('connect', client.handleConnect.bind(client));

	return socket;
}

/**
 * Attempts to disconnect the socket
 * @param {Socket} socket The socket to disconnect
 */
function disconnect(socket) {
	if (socket.disconnect) socket.disconnect();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop,
	disconnect: disconnect
};