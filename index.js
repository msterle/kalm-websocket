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
function listen(handlers, options) {
  const listener = new ws.Server({ port: options.port });
  listener.on('connection', handlers.handleConnection);
  listener.on('error', handlers.handleError);
  return Promise.resolve(listener);
}

/**
 * Sends a message with a socket client
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
  if (socket.sendBytes) socket.sendBytes(payload);
  else {
    socket.send(payload, send_options);
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
function createSocket(client) {
  const socket = new ws(`ws://${client.hostname}:${client.port}`);
  socket.binaryType = 'nodebuffer';
  socket.__pending = true;

  return socket;
}

function getOrigin(socket) {
  return {
    host: socket._socket.remoteAddress,
    port: socket._socket.remotePort
  };
}

function attachSocket(socket, handlers) {
  if (is_browser) {
    socket.onmessage = evt => handlers.handleRequest(_abToBuffer(evt.data));
    socket.onerror = handlers.handleError;
    socket.onclose = handlers.handleDisconnect;
    socket.onopen = handlers.handleConnect;
  }
  else {
    socket.on('message', evt => handlers.handleRequest(_abToBuffer(evt)));
    socket.on('error', handlers.handleError);
    socket.on('close', handlers.handleDisconnect);
    if (socket.__pending) {
      delete socket.__pending;
      socket.on('open', handlers.handleConnect);
    }
  }
}

/**
 * Attempts to disconnect the socket
 * @param {Socket} socket The socket to disconnect
 */
function disconnect(client, callback) {
  client.socket.close();
  setTimeout(callback, 0);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
  listen,
  send,
  createSocket,
  attachSocket,
  getOrigin,
  stop,
  disconnect
};