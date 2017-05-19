//file di controllo principale, gestisce l'algoritmica
//del sistema di allarme attraverso la notifica degli eventi dei vari sensori
//smista il risultato dell'elaborazione alle altre parti del sistema
const EventEmitter = require('events');
const Sensor = require("../raspberry/gpio/SensoreTest")
class Controller extends EventEmitter{
  constructor(){
    super()
    //configurazione json dei listeners
    //in questo caso il solo controller
    var listeners=[{"event":"RiseUp","function":this.callbackOnRiseUp},
    {"event":"FallingDown","function":this.callbackOnFallingDown}];


    this.configuration=require("../config/sensors.json")
    this.sensorsConfig=this.configuration.sensors
    this.sensors = [];
    for (var index in this.sensorsConfig ){
        //inizializzazione sensori
        var sensor = new Sensor(this.sensorsConfig[index],listeners)
        this.sensors.push(sensor)
    }
  }

  //funzione che rilancia l'evento del sensore in caso di salita del segnale
  callbackOnRiseUp(sensorInfo){
    console.log("Ricevuto evento da sensore su gpio"+sensorInfo.gpio+" posizionato in "+sensorInfo.location+" stato up")
  }
  //funzione che rilancia l'evento del sensore in caso di discesa del segnale
  callbackOnFallingDown(sensorInfo){
    console.log("Ricevuto evento da sensore su gpio"+sensorInfo.gpio+" posizionato in "+sensorInfo.location+" stato down")
  }


  simulateEvent(stato){
      console.log("Inizio simulazione di eventi")
      for (var sensorIndex in this.sensors){
        if (stato){
          this.sensors[sensorIndex].sensorRiseUp()
        }else{
              this.sensors[sensorIndex].sensorFallingDown()
        }
      }
  }

}
module.exports.Controller=Controller
/*var testController = new Controller()
testController.simulateEvent(true);
testController.simulateEvent(true);
testController.simulateEvent(true);
testController.simulateEvent(false);
testController.simulateEvent(false);
testController.simulateEvent(true);
*/
