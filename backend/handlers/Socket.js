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
    socketEnv.io.rooms = [gameID];

    next();
}

const handleDisconnect = function (socketEnv, next) {
    let { socket } = socketEnv;

    let gameID = socketToGame[socket.id];
    let game = games[gameID];

    if (gameID === undefined || games[gameID] === undefined) {
    } else {
        if (game.players.filter(p => p != null).length > 1) {
            game.players = game.players
                .map(player => player.socketID === socket.id ? null : player);

                socketEnv.io = socketEnv.io.in(gameID);
                socketEnv.broadcast({
                    type: actions.OPPONENT_LEFT
                })
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
