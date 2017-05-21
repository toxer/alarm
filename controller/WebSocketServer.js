//server di interazione tramite websocket 
//per ricevere righieste di informazioni sullo 
//stato dei sensori e del sistema
const WebSocket = require('ws');
const EventEmitter = require('events');
const debug = require('../config/configuration.json').debug.debugServer


class WebSocketServer extends EventEmitter {
    constructor(porta, functions) {
        super();
        const wss = new WebSocket.Server({ port: porta });

        var self = this;
        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                if (debug) {
                    console.log("Ricevuto messaggio : " + message)
                }
                //estrapolo l'oggetto da usare come this nel apply
                //questo è obbligatorio perchè le classi javascript
                //non sono come le classi java e this è contestualizzato
                //durante la chiamata
                var thisObj = functions.thisObj;
                //eseguo la funzione
                for (var index in functions.functions) {

                    if (functions.functions[index].message === message) {
                        //eseguo la funzione e ritorno il risultato
                        var response = functions.functions[index].function.apply(thisObj)
                        if (debug) {
                            var resToSend = JSON.stringify(response);
                            console.log("Risposta: " + resToSend)
                        }
                        ws.send(resToSend)
                        return;
                    }
                }
            });
            ws.send('Message not mapped');
        });
    }

}

module.exports.WebSocketServer = WebSocketServer


