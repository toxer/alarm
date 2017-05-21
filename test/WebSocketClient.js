//usato per testare il server websocket

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

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
       ws.send('sensorsStatus');
    }
  }
})


ws.on('open', function open() {
  console.log("Connesso al server")
});

ws.on('message', function incoming(data) {
  console.log(data);
});