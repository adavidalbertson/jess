const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http).of('app1');
require('local-include-js');

const defaultHandlers = require('react-redux-socket/server/handlers/');
const ioActionHandler = require('react-redux-socket/server');

const socketHandler = require('./handlers/Socket.js');

ioActionHandler(io)
    .plugins(defaultHandlers.logConnection(console.log))
    // .plugins(defaultHandlers.joinRoom(socketHandler.putInRoom).log(console.log))
    // .plugins(include('./handlers/Socket.js')).log()
    .plugins(include('./handlers/GameState.js').log(console.log))
    // .onDisconnect(socketHandler.handleDisconnect);

http.listen(4040, function () {
    console.log('listening on *:4040');
});
