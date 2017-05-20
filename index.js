//punto di ingresso dell'allarme
//require del controller per il raspberry
//consente di registrarsi per avere lo stato dei sensori

const raspberryController = require('./controller/RaspyController')
const EventEmitter = require('events');


//registro le funzioni di callback del raspberry in modo
//che a ogni evento sensore corrisponda un'azione

//ci sono due modi per farlo, o registrare due funzioni sul costruttore 
//del controller, o registrare gli eventi RaspberrySensorUp e RaspberrySensorDown sul controller
//il quale estende EventEmitter

function onRiseUp(sensorInfo){
    console.log("RiseUp")
    console.log(sensorInfo);
}
function onFallingDown(sensorInfo){
    console.log("Falling down")
    console.log(sensorInfo)

}

function createJsonPackage(sensorInfo){
    
}

var raspController = new raspberryController.Controller(onRiseUp,onFallingDown)

var ee = new EventEmitter();
var e2 = new EventEmitter();


