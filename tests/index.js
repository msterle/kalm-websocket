/**
 * Kalm websockets test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const assert = require('chai').assert;
const Kalm = require('kalm');
const websocket = require('../index');

/* Models --------------------------------------------------------------------*/

const adapterFormat = {
	listen: function() {},
	send: function() {},
	stop: function() {},
	createSocket: function() {},
	disconnect: function() {}
};

/* Suite ---------------------------------------------------------------------*/

describe('Adapters', () => {

	describe('methods', () => {
		it('register', () => {
			Kalm.adapters.register('ws', websocket);
		});

		it('resolve', () => {
			let ws_test = Kalm.adapters.resolve('ws');
			assert.isObject(ws_test, 'ws is not a valid adapter object');
			allMembersTypeMatch(ws_test, adapterFormat);
		});
	});

	describe('Smoke test', () => {
		it('run ws + json', (done) => {
			let server = new Kalm.Server({ adapter:'ws', port:8000 });
			server.subscribe('test', (data) => {
				assert.deepEqual(data, {foo:'bar'});
				server.stop(done);
			});

			server.on('ready', () => {
				let client = new Kalm.Client({ adapter:'ws', port:8000 });
				client.send('test', {foo:'bar'});
			});
		});
	});
});

/* Tooling -------------------------------------------------------------------*/

/**
 * Checks that all properties are present and of the proper type
 */
function allMembersTypeMatch(set1, model) {
	for (let i in model) {
		let type = typeof model[i];
		assert.property(set1, i, 'property ' + i + ' is missing');
		assert.typeOf(set1[i], type, 'property ' + i + ' should be ' + type);
	}
	return true;
}