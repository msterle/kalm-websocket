# kalm-websocket

*Websocket adapter for [kalm.js](https://github.com/kalm/kalm.js)*

[![kalm-websocket](https://img.shields.io/npm/v/kalm-websocket.svg)](https://www.npmjs.com/package/kalm-websocket)
[![Node](https://img.shields.io/badge/node->%3D4.0-blue.svg)](https://nodejs.org)
[![Build Status](https://travis-ci.org/kalm/kalm-websocket.svg?branch=master)](https://travis-ci.org/kalm/kalm-websocket)
[![Dependencies Status](https://david-dm.org/kalm/kalm-websocket.svg)](https://www.npmjs.com/package/kalm-websocket)

## Install

    npm install kalm-websocket


## Usage

Setting up your server:

```node
    const Kalm = require('kalm');
    const ws = require('kalm-websocket');
    
    const server = Kalm.listen({
        port: 3000,
        transport: ws
    });

    server.on('connection', (client) => {
        client.subscribe('/', (data) => {
            console.log(data);  // 'Hello from Browser!'
        });
    });
    
```

Using in your browser:

```node
    // Install kalm and kalm-websocket via a package manager (recommended).
         
    import Kalm from 'kalm';
    import ws from 'kalm-websocket';
    
    const client = Kalm.connect({
        hostname: '127.0.0.1',  // Your server's hostname
        port: 3000,             // Your server's port
        adapter: ws
    });

    client.write('Hello from Browser');
    
```


## Testing

`npm test`


## Contribute

Please do! This is an open source project - if you see something that you want, [open an issue](//github.com/kalm/kalm.js/issues/new) or file a pull request.

If you have a major change, it would be better to open an issue first so that we can talk about it. 

I am always looking for more maintainers, as well. Get involved. 


## License 

[Apache 2.0](LICENSE) (c) 2017 Frederic Charette