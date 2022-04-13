const WebSocket = require("ws");

function onError(err) {
    console.error(`onError: ${err.message}`);
}
 
function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send(`recebido!`);
}
 
function onConnection(ws) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', onConnection);
 
    console.log(`App Web Socket Server is running!`);
    return wss;
}