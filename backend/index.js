const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http).of('app1');
require('local-include-js');

const defaultHandlers = require('react-redux-socket/server/handlers/');
const ioActionHandler = require('react-redux-socket/server');

ioActionHandler(io)
    .plugins(defaultHandlers.logConnection(console.log))
    .plugins(include('./handlers').log(console.log));

http.listen(4040, function(){
  console.log('listening on *:4040');
});
