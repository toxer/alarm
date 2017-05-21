//file di controllo principale, gestisce l'algoritmica
//del sistema di allarme attraverso la notifica degli eventi dei vari sensori
//smista il risultato dell'elaborazione alle altre parti del sistema
//Viene usato per avere un'interfaccia stabile verso raspberry
//mentre quella che gestisce i sensori può essere modificata nel tempo


const debug = require('../config/configuration.json').debug.debugControllerRaspberry
const EventEmitter = require('events');
const Sensor = require("../raspberry/gpio/SensoreRpio")
const sensorConfiguration = require("../config/sensors.json")

class Controller extends EventEmitter {
  constructor(riseUpFunctions, fallingDownFunctions) {
    super()

    //configurazione json dei listeners
    //in questo caso il solo controller
    // e le funzioni di riseUp e fallingDown che vengono passate nel costrutter
    var listeners = [{ "event": "RiseUp", "function": this.callbackOnRiseUp },
    { "event": "FallingDown", "function": this.callbackOnFallingDown }];

    //aggiungo le eventuali funzioni che trovo nel costruttore
    //sono quelle che venono invocate su chi ha instanziato il controller
    if (riseUpFunctions) {
      for (var index in riseUpFunctions) {
        listeners.push({ "event": "RiseUp", "function": riseUpFunctions[index] })
      }
    }
    if (fallingDownFunctions) {
      for (var index in fallingDownFunctions) {
        listeners.push({ "event": "FallingDown", "function": fallingDownFunctions[index] })
      }
    }

    this.sensorsConfig = sensorConfiguration.sensors
    this.sensors = [];
    for (var index in this.sensorsConfig) {
      //inizializzazione sensori
      var sensor = new Sensor(this.sensorsConfig[index], listeners, this)
      this.sensors.push(sensor)
    }


  }

  //ATTENZIONE: this nelle funzioni di callBack non si riferisce a questa istanza di controller.
  //per questo viene ripassato indietro raspberryController che è il controller che effettivamente
  //a generato il sensore

  //funzione che preleva l'evento dal sensore in caso di RISEUP e rilancia un evento 
  callbackOnRiseUp(sensorInfo, raspberryController) {
    if (debug) {
      console.log("Il controller del raspberry ha ricevuto evento da sensore su gpio" + sensorInfo.gpio + " posizionato in " + sensorInfo.location + " stato up")
    }
    raspberryController.emit("RaspberrySensorUp", sensorInfo)


  }


  //funzione che preleva l'evento dal sensore in caso di FALLINGDOWN e rilancia un evento 
  callbackOnFallingDown(sensorInfo, raspberryController) {
    if (debug) {
      console.log("Il controller del raspberry ha ricevuto evento da sensore su gpio" + sensorInfo.gpio + " posizionato in " + sensorInfo.location + " stato down")
    }
    raspberryController.emit("RaspberrySensorDown", sensorInfo)
  }


  getSensorsStatus() {
    var sensorStatus = []
    for (var index in this.sensors) {
      sensorStatus.push(this.sensors[index].readSensorStatus());
    }
    return sensorStatus;
  }


  simulateEvent(stato) {
    console.log("Inizio simulazione di eventi")
    for (var sensorIndex in this.sensors) {
      if (stato) {
        this.sensors[sensorIndex].sensorRiseUp()
      } else {
        this.sensors[sensorIndex].sensorFallingDown()
      }
    }
  }

}
module.exports.Controller = Controller
//var testController = new Controller()
/*testController.simulateEvent(true);
testController.simulateEvent(true);
testController.simulateEvent(true);
testController.simulateEvent(false);
testController.simulateEvent(false);
testController.simulateEvent(true);
*/
