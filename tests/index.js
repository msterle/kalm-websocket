/**
 * Kalm test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var assert = require('chai').assert;
//var Kalm = require('kalm');
var Kalm = require('/home/frederic/Documents/workspace/Kalm');
var websocket = require('../index');

/* Models --------------------------------------------------------------------*/

var adapterFormat = {
	listen: function() {},
	send: function() {},
	stop: function() {},
	createSocket: function() {},
	disconnect: function() {}
};

/* Suite ---------------------------------------------------------------------*/

describe('Adapters', function() {

	describe('methods', function() {
		it('register', function() {
			Kalm.adapters.register('ws', websocket);
		});

		it('resolve', function() {
			var ws_test = Kalm.adapters.resolve('ws');
			assert.isObject(ws_test, 'ws is not a valid adapter object');
			allMembersTypeMatch(ws_test, adapterFormat);
		});
	});

	describe('Smoke test', function() {
		it('run ws + json', function(done) {
			var server = new Kalm.Server({encoder: 'json', adapter:'ws', port:8000});
			server.subscribe('test', function(data) {
				assert.deepEqual(data, {foo:'bar'});
				server.stop(done);
			});

			server.on('ready', function() {
				var client = new Kalm.Client({encoder: 'json', adapter:'ws', port:8000, hostname:'http://0.0.0.0'});
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
	for (var i in model) {
		var type = typeof model[i];
		assert.property(set1, i, 'property ' + i + ' is missing');
		assert.typeOf(set1[i], type, 'property ' + i + ' should be ' + type);
	}
	return true;
}