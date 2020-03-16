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

const frontendDist = path.join(__dirname, '../frontend/dist/');

app.use(express.static(frontendDist));

app.get('/*', (req, res) => {res.sendFile(path.join(frontendDist, 'index.html'))});

const PORT = process.env.HTTP_PORT || 8081;

http.listen(PORT, function () {
    console.log(`listening on *:${PORT}`);
});
