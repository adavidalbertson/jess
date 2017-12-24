const utils = require('../../common/Utils.js');
const actions = require('../../common/Actions.js');
const uuidv1 = require('uuid/v1');

let games = {};
let socketToGame = {};
let gameID;

const handleMessageActions = function(action, socketEnv, next) {
    const { dispatch, broadcast, socket } = socketEnv;

    switch(action.type) {
        case actions.NEW_GAME:
            gameID = uuidv1();

            const playerOne = {
                socketID: socket.id
            }

            const gameState = utils.setupNewBoard();

            const game = {
                id: gameID,
                players: [
                    playerOne
                ],
                gameState
            };

            games[gameID] = game;
            socketToGame[socket.id] = gameID;

            dispatch({
                type: actions.JOINED_GAME,
                payload: {
                    gameID,
                    gameState
                }
            });

            console.log(game.players);

            break;
        case actions.JOIN_GAME:
            gameID = action.payload.gameID;
            if (games[gameID] === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST,
                });
                break;
            } else {
                const player = {
                    socketID: socketEnv.socket.id
                }

                games[gameID].players.push(player);
                socketToGame[socket.id] = gameID;

                dispatch({
                    type: actions.JOINED_GAME,
                    payload: {
                        gameID: gameID,
                        gameState: games[gameID].gameState
                    }
                });

                console.log(games[gameID].players);
            }

            break;
    }

    next();
}

const handleDisconnect = function(socketEnv, next) {
    console.log('THE SOCKET WAS DISCONNECTED OH NO');
    let { socket } = socketEnv;

    let gameID = socketToGame[socket.id];

    if (gameID === undefined) {
        console.log('wasn\'t in a game anyway');
    } else {
        if (games[gameID].players.length > 1) {
            games[gameID].players = game[gameID].players.filter(player => player.socketID !== socket.id);
        } else {
            delete games[gameID];
        }
    }

    delete socketToGame[socket.id];

    next();
}

module.exports = function(reactReduxSocketServer) {
    reactReduxSocketServer.onActionIn(handleMessageActions);
    reactReduxSocketServer.onDisconnect(handleDisconnect);
}

module.exports.log = _log => { log = _log; return module.exports }
