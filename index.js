/**
 * WebSocket Adapter
 * @module adapters/ws
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const is_browser = (require('os').platform() === 'browser');

const ws = (is_browser)?require('./lib/ws-browser'):require('uws');

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
	server.listener = new ws.Server({
		port: server.options.port
	}, callback);

	server.listener.on('connection', server.handleRequest.bind(server));
	server.listener.on('error', (err) => {
		server.emit('error', err);
	});
}

/**
 * Sends a message with a socket client
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	if (socket.sendBytes) socket.sendBytes(payload);
	else socket.send(payload, { binary: true });
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
		if (is_browser) socket.binaryType = "arraybuffer";
	}

	if (is_browser) {
		socket.onmessage = (evt) => {
			client.handleRequest(_abToBuffer(evt.data));	// Browser ArrayBuffer to node Buffer
		};

		socket.onerror = client.handleError.bind(client);

		socket.onclose = client.handleDisconnect.bind(client);

		socket.onopen = client.handleConnect.bind(client);
	}
	else {
		socket.on('message', (evt) => {
			client.handleRequest(_abToBuffer(evt));	// Browser ArrayBuffer to node Buffer
		});

		socket.on('error', client.handleError.bind(client));

		socket.on('connect', client.handleConnect.bind(client));

		socket.on('close', client.handleDisconnect.bind(client));
	}

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