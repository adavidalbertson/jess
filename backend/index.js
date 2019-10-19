const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http).of('app1');
const path = require('path');
require('local-include-js');

const defaultHandlers = require('react-redux-socket/server/handlers/');
const ioActionHandler = require('react-redux-socket/server');

ioActionHandler(io)
    .plugins(defaultHandlers.logConnection(console.log))
    .plugins(include('./handlers/Socket.js')).log()
    .plugins(include('./handlers/GameState.js').log(console.log))
    // .onDisconnect(socketHandler.handleDisconnect);

app.use(express.static(path.join(__dirname, '../frontend/dist/')));

app.get('/', (req, res) => res.send('You got a response!'));

const PORT = process.env.HTTP_PORT || 4040;

http.listen(4040, function () {
    console.log(`listening on *:${PORT}`);
});
