const actions = require('../../common/Actions.js');
const uuidv1 = require('uuid/v1');

let games = {};
let socketToGame = {};

const handleSocketActions = function (action, socketEnv, next) {
    socketEnv.games = games;
    socketEnv.socketToGame = socketToGame;
    switch (action.type) {
        case actions.NEW_GAME:
            gameID = uuidv1();
            socketToGame[socketEnv.socket.id] = gameID;
            break;
        case actions.JOIN_GAME:
            gameID = action.payload.gameID;
            socketToGame[socketEnv.socket.id] = gameID;
            break;
        default:
            gameID = socketToGame[socketEnv.socket.id];
    }

    socketEnv.socket = socketEnv.socket.join(gameID);
    socketEnv.io = socketEnv.io.in(gameID);

    next();
}

const handleDisconnect = function (socketEnv, next) {
    console.log('THE SOCKET WAS DISCONNECTED OH NO');
    let { socket } = socketEnv;

    let gameID = socketToGame[socket.id];

    if (gameID === undefined || games[gameID] === undefined) {
        console.log('wasn\'t in a game anyway');
    } else {
        if (games[gameID].players.length > 1) {
            games[gameID].players = games[gameID].players.filter(player => player.socketID !== socket.id);
            console.log(games[gameID].players);
        } else {
            delete games[gameID];
        }
    }

    delete socketToGame[socket.id];

    next();
}

module.exports = function (reactReduxSocketServer) {
    reactReduxSocketServer.onActionIn(handleSocketActions);
    reactReduxSocketServer.onDisconnect(handleDisconnect);
}

module.exports.log = _log => { log = _log; return module.exports }
