# kalm-websocket

Web-socket adapter for [Kalm](https://github.com/fed135/Kalm)

[![kalm-websocket](https://img.shields.io/npm/v/kalm-websocket.svg)](https://www.npmjs.com/package/kalm-websocket)
[![Build Status](https://travis-ci.org/fed135/kalm-websocket.svg?branch=master)](https://travis-ci.org/fed135/kalm-websocket)
[![Dependencies Status](https://david-dm.org/fed135/kalm-websocket.svg)](https://www.npmjs.com/package/kalm-websocket)

## Usage

Using with Kalm:

    var Kalm = require('kalm');
    var ws = require('kalm-websocket');
    
    Kalm.adapters.register('ws', ws);

    var server = new Kalm.Server({
	    port: 3000,
	    adapter: 'ws',
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
	    hostname: 'http://127.0.0.1',	// Put your server addr
	    port: 3000,
	    adapter: 'ws',
	    channels: {
		    '/': function(data) {
			    console.log('GOT "' + data + '" on main channel!');
		    }
		  }
    });

    