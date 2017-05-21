//usato per testare il server websocket

const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.178.37:8080');

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
      var req = new Object()
      req.action = "sensorsStatus"
      ws.send(JSON.stringify(req));
    }
  }
})


ws.on('open', function open() {
  console.log("Connesso al server")
});

ws.on('message', function incoming(data) {
  console.log(data)
  var message = JSON.parse(data);
  if (message.action === "sensorStatusChange") {
    var payload = message.payload;
    //recupero le informazioni del sensore
    var status = payload.status;
    var location = payload.location
    var id = payload.id
    var zone = payload.zone;
    console.log("IL sensore " + id + " posizionato in " + location + " a copertura della " + zone + " ha cambiato stato in " + (status ? 'attivo' : 'disattivo'))
  }

});