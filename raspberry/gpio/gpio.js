var gpio = require('rpi-gpio');
var lastValue=undefined;
//gpio.setup(7, gpio.DIR_IN, gpio.readInput);
gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH,readInput);

gpio.setup(11,gpio.DIR_OUT)

function readInput(){
gpio.read(7, function(err, value) {
  console.log("Read "+value)

      gpio.write(11,!value)
  });

}



function readErr(value){
println(value)
}

//gpio.write(11,!gpio.read(7))

// do app specific cleaning before exiting
 process.on('SIGINT', function () {
  console.log("EXIT")
  gpio.destroy()
 });


gpio.on('change', function(channel, value) {
  if (value != lastValue){
    console.log('Channel ' + channel + ' value is now ' + value);
    lastValue=value
    write(value)
}

});


function write(value){
  gpio.write(11,!value)
}
