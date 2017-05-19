var sensor = require("./SensorSimulator").Sensor;




function onSensorChangeUp(){
  console.log("Sensor is changed with value UP")
}

function onSensorChangeDown(){
  console.log("Sensor is changed with value DOWN")
}

var listeners=[{evento:'sensorChangeUp',funzione:onSensorChangeUp},{evento:'sensorChangeDown',funzione:onSensorChangeDown}]



var sensore = new sensor.SensorSimulator(10,listeners)
sensore.sendChangeSensor('sensorChangeUp');
sensore.sendChangeSensor('sensorChangeUp');
sensore.sendChangeSensor('sensorChangeDown');
sensore.sendChangeSensor('sensorChangeUp');
