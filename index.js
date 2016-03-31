/**
 * WebSocket Adapter
 * @adapter ws
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var SocketIO = require('socket.io');
var SocketIOClient = require('socket.io-client');

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for WebSocket connections on the selected port.
 * @method listen
 * @param {Server} server The Kalm Server reference
 * @param {function} callback The success callback for the operation
 */
function listen(server, callback) {
	server.listener = SocketIO(server.options.port);

	server.listener.on('connection', server._handleRequest.bind(server));
	server.listener.on('error', function _handleServerError(err) {
		server.emit('error', err);
	});

	process.nextTick(callback);
}

/**
 * Sends a message with a socket client
 * @method send
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	socket.send(payload);
}

/**
 * Stops listening for WebSocket connections and closes the Server.
 * @method stop
 * @param {Server} server The Kalm Server reference
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.listener.close(callback || function() {});
}

/**
 * Creates a client
 * @method createSocket
 * @param {Client} client The client to create the socket for
 * @returns {Socket} The created WebSocket client
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = SocketIOClient.connect(client.options.hostname);
	}

	socket.on('message', client._handleRequest.bind(client));
	socket.on('error', function _handleSocketError(err) {
		client.emit('error', err);
	});

	return socket;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop
};