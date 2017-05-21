//interfaccia con raspbery, rilancia al controller
//gli eventi relativi ai sensori sul gpio
//libreria migliore rispettoa  quella gpio di Sensore
//reperibile in https://github.com/jperkin/node-rpio
const debug = require('../../config/configuration.json').debug.debugSensore
const EventEmitter = require('events');
const rpio = require('rpio');

class Sensor extends EventEmitter {
    constructor(sensorInfo, listeners, raspberryController) {
        super();
        this.raspberryController = raspberryController
        console.log("Inizializzazione sensore " + sensorInfo.type + " in " + sensorInfo.location)
        this.sensorInfo = sensorInfo
        this.gpio = sensorInfo.gpio
        this.listeners = listeners
        //inserisco le funzioni di callBack
        for (var index in this.listeners) {
            var callbackFunction = listeners[index].function;
            this.on(listeners[index].event, callbackFunction)
            if (debug) {
                console.log("Aggiunta funzione di callback :  per sensore su gpio  " + sensorInfo.gpio)
            }
        }
        this.initSensor();
    }

    //inizializza il sensore
    initSensor() {
        //setup del sensore in lettura
        //con il rpi_pull_up lo stato senza indicazioni è 1
        rpio.open(this.gpio, rpio.INPUT, rpio.PULL_UP);
        this.lastValue = rpio.read(this.gpio)

        //attivo la funzione di change
        rpio.poll(this.gpio, change);
        var self = this;
        function change(pin) {
            //qui la funzione di polling agisce direttamente
            //dando il pin e non serve ricontrollare come per la libreria gpio
            var value = rpio.read(pin);
            if (value != self.lastValue) {
                if (value) {
                    self.sensorRiseUp();
                } else {
                    self.sensorFallingDown();
                }
                self.lastValue = value;
            }
        }


    }
    sensorRiseUp() {
        // i parametri dopo il nome dell'evento sono quelli
        //che vengono passati alla funzione di callback
        if (debug) {
            console.log("Emesso evento RiseUp da sensore " + this.gpio)
        }
        //aggiorno lo stato del sensore
        this.sensorInfo.status=rpio.read(this.gpio)
        this.emit("RiseUp", this.sensorInfo, this.raspberryController)
     

    }
    sensorFallingDown() {
        if (debug) {
            console.log("Emesso evento FallingDown da sensore " + this.gpio)
        }
        this.sensorInfo.status=rpio.read(this.gpio)
        this.emit("FallingDown", this.sensorInfo, this.raspberryController)
    }

    readSensorStatus(){
        var status =  rpio.read(this.gpio)
        this.sensorInfo.status=status
        return this.sensorInfo;

    }    

}



module.exports = Sensor
