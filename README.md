# kalm-websocket

Web-socket adapter for Kalm

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Dependencies Status](https://david-dm.org/fed135/Kalm.svg)](https://www.npmjs.com/package/kalm)

## Usage

Using with Kalm:

    var Kalm = require('kalm');
    var ws = require('kalm-websocket');
    
    Kalm.adapters.register('ws', ws);

    var server = new Kalm.Server({
	    port: 3000,
	    adapter: 'ws',
	    encoder: 'msg-pack',
	    channels: {
		    '/': function(data) {
			    console.log('GOT "' + data + '" on main channel!');
		    }
		  }
    });


Using in your browser:

    // Install kalm and kalm-websocket via a package manager (recommended).
		 
    var Kalm = require('kalm');
    var ws = require('kalm-websocket');
    
    Kalm.adapters.register('ws', ws);

    var server = new Kalm.Server({
	    hostname: 'http://127.0.0.1:3000',	// Put your server addr.
	    adapter: 'ws',
	    encoder: 'msg-pack',
	    channels: {
		    '/': function(data) {
			    console.log('GOT "' + data + '" on main channel!');
		    }
		  }
    });

    