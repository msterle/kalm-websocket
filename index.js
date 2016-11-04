/**
 * WebSocket Adapter
 * @module adapters/ws
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const ws = require('uws');

/* Methods -------------------------------------------------------------------*/

/**
 * Converts ArrayBuffers to Buffers (cycle)
 * @private
 * @param {ArrayBuffer} ab The ArrayBuffer to convert
 * @returns {Buffer} The resulting Buffer
 */
function _abToBuffer(ab) {
	let buffer = new Buffer(ab.byteLength || ab.data.length);
	let view = ab.data || new Uint8Array(ab);
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = view[i];
	}
	return buffer;
}

/**
 * Listens for WebSocket connections on the selected port.
 * @param {Server} server The Kalm Server reference
 * @param {function} callback The success callback for the operation
 */
function listen(server, callback) {
	server.listener = new ws.Server(server.options.port);

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
	process.nextTick(callback);
}

/**
 * Creates a client
 * @param {Client} client The client to create the socket for
 * @returns {Socket} The created WebSocket client
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = new ws('ws://' + client.options.hostname + ':' + client.options.port);
	}

	socket.on('message', (evt) => {
		console.log(evt);
		client.handleRequest(_abToBuffer(evt));	// Browser ArrayBuffer to node Buffer
	});

	socket.on('error', client.handleError.bind(client));

	socket.on('connect', client.handleConnect.bind(client));

	return socket;
}

/**
 * Attempts to disconnect the socket
 * @param {Socket} socket The socket to disconnect
 */
function disconnect(client) {
	if (client.socket && client.socket.disconnect) {
		client.socket.disconnect();
		process.nextTick(client.handleDisconnect.bind(client));
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen,
	send,
	createSocket,
	stop,
	disconnect
};