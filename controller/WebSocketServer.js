//server di interazione tramite websocket 
//per ricevere righieste di informazioni sullo 
//stato dei sensori e del sistema
const WebSocket = require('ws');
const EventEmitter = require('events');

class WebSocketServer extends EventEmitter {
    constructor() {
        super();
        const wss = new WebSocket.Server({ port: 8080 });
        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });

            ws.send('something from server');
        });
    }

}

var w = new WebSocketServer();



