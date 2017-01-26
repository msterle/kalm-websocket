# kalm-websocket

*Web-socket adapter for [Kalm](https://github.com/fed135/Kalm)*

<a href="https://github.com/fed135/Kalm" align="left">
<img src="http://i231.photobucket.com/albums/ee109/FeD135/kalm_logo_bolded.png" height="64">
</a>
<a href="http://www.w3.org/html/logo/">
<img src="https://www.w3.org/html/logo/badge/html5-badge-h-connectivity.png" width="133" height="64" alt="HTML5 Powered with Connectivity / Realtime" title="HTML5 Powered with Connectivity / Realtime">
</a>

[![kalm-websocket](https://img.shields.io/npm/v/kalm-websocket.svg)](https://www.npmjs.com/package/kalm-websocket)
[![Build Status](https://travis-ci.org/fed135/kalm-websocket.svg?branch=master)](https://travis-ci.org/fed135/kalm-websocket)
[![Dependencies Status](https://david-dm.org/fed135/kalm-websocket.svg)](https://www.npmjs.com/package/kalm-websocket)

## Usage

Using with Kalm:

```node
    const Kalm = require('kalm');
    const ws = require('kalm-websocket');
    
    Kalm.adapters.register('ws', ws);

    let server = new Kalm.Server({
	    port: 3000,
	    adapter: 'ws',
	    channels: {
		    '/': (data) => {
			    console.log('GOT "' + data + '" on main channel!');
		    }
		  }
    });
```

Using in your browser:

```node
    // Install kalm and kalm-websocket via a package manager (recommended).
		 
    const Kalm = require('kalm');
    const ws = require('kalm-websocket');
    
    Kalm.adapters.register('ws', ws);

    let client = new Kalm.Client({
	    hostname: '127.0.0.1',	// Put your server addr
	    port: 3000,
	    adapter: 'ws',
	    channels: {
		    '/': (data) => {
			    console.log('GOT "' + data + '" on main channel!');
		    }
		  }
    });
```

## Building

You may want to build an AMD compatible module via the `npm run build` command, or use the one made for you in the bin folder. Note that it is not minified.

If anyone with good webpack and modern front-end development skills is intrested in helping me make this library UMD compatible, it would be **greatly appreciated!** 
