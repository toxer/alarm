//punto di ingresso dell'allarme
//require del controller per il raspberry
//consente di registrarsi per avere lo stato dei sensori

const raspberryController = require('./controller/RaspyController')
const configuration = require('./config/configuration.json')
const EventEmitter = require('events');
const Server = require('./controller/WebSocketServer')




//registro le funzioni di callback del raspberry in modo
//che a ogni evento sensore corrisponda un'azione

function onRiseUp(sensorInfo) {
    console.log("Rising up")
    //assemblo il messaggio da invaire al server
    var message = new Object();
    message.action = "sensorStatusChange"
    message.payload=sensorInfo
    server.sendData(message)
}
function onFallingDown(sensorInfo) {
    console.log("Falling down")
    var message = new Object();
    message.action = "sensorStatusChange"
    message.payload=sensorInfo
    server.sendData(message)

}


var raspController = new raspberryController.Controller([onRiseUp], [onFallingDown])

//funzioni che vengono attivate dai messaggi remoti al server
//attivo anche un server che si utilizza per chiedere 
//da remoto le informazioni sullo stato dei sensori e del sistema
//il server accetta una mappa messaggio, funzione da eseguire che restitusce la risposta
// va anche specificato l'oggetto su cui applicare la funzione, anche se si tratta di
//una classe.   
//questo è obbligatorio perchè le classi javascript
//non sono come le classi java e this è contestualizzato
//durante la chiamata

var serverFunctions = { "thisObj": raspController, "functions": [{ "action": "sensorsStatus", "function": raspController.getSensorsStatus }] }





var server = new Server.WebSocketServer(8080, serverFunctions);

//raspController.getSensorsStatus();


//attivazione gestione eventi da tastiera



if (configuration.keyboard.events) {

    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    console.log("Attivati eventi da tastiera")
    console.log("s-> Stato dei sensori")
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            if (str === 's') {
                console.log(raspController.getSensorsStatus());
            }
        }
    })
};