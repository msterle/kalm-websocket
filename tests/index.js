/**
 * Kalm websockets test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const assert = require('chai').assert;
const Kalm = require('kalm');
const ws = require('../index');

/* Suite ---------------------------------------------------------------------*/

describe('Websocket', () => {

  it('run ws + json', (done) => {
    const server = Kalm.listen({ transport: ws, port:8000 });
    server.on('connection', c => {
      c.subscribe('test', (data) => {
        assert.deepEqual(data.body, {foo:'bar'});
        server.stop(done);
      });
    });

    const client = Kalm.connect({ transport: ws, port:8000 });
    client.write('test', {foo:'bar'});
  });
});
