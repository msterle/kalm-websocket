/**
 * WebSocket Adapter
 * @module adapters/ws
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const is_browser = (this.hasOwnProperty('Document'));

const ws = (is_browser)?require('./lib/ws-browser'):require('uws');

/* Local variables -----------------------------------------------------------*/

const send_options = { binary: true };

/* Methods -------------------------------------------------------------------*/

/**
 * Converts ArrayBuffers to Buffers (cycle)
 * @private
 * @param {ArrayBuffer} ab The ArrayBuffer to convert
 * @returns {Buffer} The resulting Buffer
 */
function _abToBuffer(ab) {
	let buffer = Buffer.allocUnsafe(ab.byteLength || ab.data.length);
	let view = ab.data || new Uint8Array(ab);
	const len = buffer.length;
	for (let i = 0; i < len; i++) {
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
function send(socket, payload, timestamp) {
	if (socket && socket.sendBytes) socket.sendBytes(payload);
	else {
		if (socket) socket.send(payload, send_options);
	}
}

/**
 * Stops listening for WebSocket connections and closes the Server.
 * @param {Server} server The Kalm Server reference
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.listener.close();
	setTimeout(callback, 0);
}

/**
 * Creates a client
 * @param {Client} client The client to create the socket for
 * @returns {Socket} The created WebSocket client
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = new ws('ws://' + client.options.hostname + ':' + client.options.port);
		if (is_browser) socket.binaryType = 'arraybuffer';
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
		setTimeout(client.handleDisconnect.bind(client), 0);
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