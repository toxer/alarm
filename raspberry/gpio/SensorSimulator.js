const EventEmitter = require('events');

class SensorSimulator  extends EventEmitter{

    constructor(gpioNumber,listeners){
      super();
      this.gpioNumber=gpioNumber;
      this.listeners=listeners;  //copia evento,funzione

    //inizializzo i listeners
    for(var index in this.listeners){
      console.log(listeners[index].evento)
      this.on(listeners[index].evento,listeners[index].funzione);
    }



    }
    sendChangeSensor(eventName){
        this.emit(eventName)

    }

  }
module.exports.Sensor={SensorSimulator}
