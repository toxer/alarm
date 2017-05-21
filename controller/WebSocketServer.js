//server di interazione tramite websocket 
//per ricevere righieste di informazioni sullo 
//stato dei sensori e del sistema
const WebSocket = require('ws');
const EventEmitter = require('events');
const debug = require('../config/configuration.json').debug.debugServer


class WebSocketServer extends EventEmitter {
    constructor(porta, functions) {
        super();
        this.wss = new WebSocket.Server({ port: porta });

        var self = this;

        this.wss.on('connection', function connection(ws, req) {
            if (debug) {
                console.log("Ricevuta connessione dal server " +req.connection.remoteAddress)
            }
            ws.on('message', function incoming(message) {
                if (debug) {
                    console.log("Ricevuto messaggio : " + message)
                }
                //estrapolo l'oggetto da usare come this nel apply
                //questo è obbligatorio perchè le classi javascript
                //non sono come le classi java e this è contestualizzato
                //durante la chiamata
                var thisObj = functions.thisObj;
                //estrapolo la funzione
                try {
                    var action = JSON.parse(message).action;
                    if (action == undefined) {
                        throw "Action not valid"
                    }
                    //eseguo la funzione
                    for (var index in functions.functions) {


                        if (functions.functions[index].action === action) {
                            //eseguo la funzione e ritorno il risultato
                            var response = functions.functions[index].function.apply(thisObj)
                            if (debug) {
                                var resToSend = JSON.stringify(response);
                                console.log("Risposta: " + resToSend)
                            }
                            ws.send(resToSend)
                            return;
                        }
                        throw "Action " + action + " not mapped"
                    }
                }
                catch (err) {
                    console.error(err)
                    var error = new Object();
                    error.action = "error";
                    error.payload = err
                    ws.send(JSON.stringify(error));
                }

            });

        });
    }
    sendData(messageObject) {
        this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(messageObject));
            }
        });
    }

}

module.exports.WebSocketServer = WebSocketServer


