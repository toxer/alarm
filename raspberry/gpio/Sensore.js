//interfaccia con raspbery, rilancia al controller
//gli eventi relativi ai sensori sul gpio

const EventEmitter = require('events');
const gpio = require('rpi-gpio');

class Sensor extends EventEmitter {

	constructor(sensorInfo, listeners) {
		super();
		console.log("Inizializzazione sensore " + sensorInfo.type + " in " + sensorInfo.location)
		this.sensorInfo = sensorInfo
		this.gpio = sensorInfo.gpio
		this.listeners = listeners
		//inserisco le funzioni di callBack
		for (var index in this.listeners) {
			var callbackFunction = listeners[index].function;
			this.on(listeners[index].event, callbackFunction)
			console.log("Aggiunta funzione di callback :  per sensore su gpio  " + sensorInfo.gpio)
		}
		this.initSensor();
	}


	//inizializza il sensore
	initSensor() {
		//setup del sensore in lettura
		gpio.setup(this.gpio, gpio.DIR_IN, gpio.EDGE_BOTH, this.readInput);
		console.log("Setup del sensore su gpio " + this.gpio)
		//attivo l'event listener sul sensore che, dopo aver controllato
		//che il valore sia diverso da quello attuale, rilancia l'evento al controller
		//chiamando una delle due funzioni
		var self = this
		gpio.on('change', function (channel, value) {
			//attenzione, la libreria gpio agisce globalmete, devo verificare
			//che il canale sia lo stesso di questo sensore
			//nel caso passo questo sensore come paramentro attraverso 
			//self perchè nel metodo annidato this viene sovrascritto dal nuovo cntesto.
			if (channel == self.gpio && value != self.lastValue) {
				//console.log('Channel ' + channel + ' value is now ' + value);
				self.lastValue = value
				if (value) {
					self.sensorRiseUp();
				} else {
					self.sensorFallingDown();
				}

			}

		});
		process.on('SIGINT', function () {
			console.log("Reset dei sensori in uscita")
			gpio.destroy()
		});

	}

	readInput() {


	}

	sensorRiseUp() {
		// i parametri dopo il nome dell'evento sono quelli
		//che vengono passati alla funzione di callback
		console.log("Emesso evento RiseUp da sensore " + this.gpio)
		this.emit("RiseUp", this.sensorInfo)
	}
	sensorFallingDown() {
		console.log("Emesso evento FallingDown da sensore " + this.gpio)
		this.emit("FallingDown", this.sensorInfo)
	}
	// do app specific cleaning before exiting

}

module.exports = Sensor
