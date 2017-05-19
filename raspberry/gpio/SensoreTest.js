//Usato per simulare il comportamento di un sensore,
//L'evento viene generato su chiamata invece che
//da gpio
const EventEmitter = require('events');
class Sensor extends EventEmitter{

  //gpio: gpio rappresentante il gpio rapsberry
  //listener: copia nome evento,funzione da chiamare
  //{"event":"riseUp",function:"callback"}
  constructor(sensorInfo,listeners){
      super();
      console.log("Inizializzazione sensore "+sensorInfo.type+" in "+sensorInfo.location)
      this.sensorInfo = sensorInfo
      this.gpio=sensorInfo.gpio
      this.listeners=listeners
      //inserisco le funzioni di callBack
      for(var index in this.listeners){
          var callbackFunction = listeners[index].function;
          this.on(listeners[index].event,callbackFunction)

        console.log("Aggiunta funzione di callback :  per sensore su gpio  "+sensorInfo.gpio)
      }
  }

  sensorRiseUp(){
    // i parametri dopo il nome dell'evento sono quelli
    //che vengono passati alla funzione di callback
    console.log("Emesso evento RiseUp da sensore "+this.gpio)
    this.emit("RiseUp",this.sensorInfo)
  }
  sensorFallingDown(){
    this.emit("FallingDown",this.sensorInfo)
  }


}
module.exports=Sensor
