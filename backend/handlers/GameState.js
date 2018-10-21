const utils = require('../../common/Utils.js');
const actions = require('../../common/Actions.js');
const uuidv1 = require('uuid/v1');

let games = {};
let socketToGame = {};
let gameID;

const handleMessageActions = function (action, socketEnv, next) {
    // let { dispatch, broadcast, socket, games, socketToGame } = socketEnv;
    let { dispatch, broadcast, socket } = socketEnv;

    // let games = socketEnv.games;
    // let socketToGame = socketEnv.socketToGame;

    switch (action.type) {
        case actions.NEW_GAME:
            // gameID = socketToGame[socket.id];
            gameID = uuidv1();

            let playerOne = {
                socketID: socket.id
            }

            let gameState = utils.setupNewBoard();

            let game = {
                id: gameID,
                players: [
                    playerOne
                ],
                gameState
            };

            // socketEnv.games[gameID] = game;
            games[gameID] = game;
            socketToGame[socket.id] = gameID;

            socketEnv.socket = socketEnv.socket.join(gameID)
            socketEnv.io = socketEnv.io.in(gameID)
            socketEnv.broadcast = action => socketEnv.io.emit('react redux action', action)
            socketEnv.touched = true;

            socket = socket.join(gameID);

            dispatch({
                type: actions.JOINED_GAME,
                payload: {
                    gameID,
                    gameState
                }
            });

            broadcast({
                type: "CAN_YOU_SEE",
                payload: {

                }
            });

            break;
        case actions.JOIN_GAME:
            gameID = action.payload.gameID;

            if (games[gameID] === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST,
                });
                break;
            } else if (games[gameID].players.length > 1) {
                dispatch({
                    type: actions.GAME_IS_FULL
                })
            } else {
                const player = {
                    socketID: socket.id
                }

                games[gameID].players.push(player);
                socketToGame[socket.id] = gameID;

                // socket.join(gameID);

                dispatch({
                    type: actions.JOINED_GAME,
                    payload: {
                        gameID: gameID,
                        gameState: games[gameID].gameState
                    }
                });

                socketEnv.socket = socketEnv.socket.join(gameID)
                socketEnv.io = socketEnv.io.in(gameID)
                socketEnv.broadcast = action => socketEnv.io.emit('react redux action', action)
                socketEnv.touched = true;

                broadcast({
                    type: "CAN_YOU_SEE_ME_TOO",
                    payload: {
    
                    }
                });

                console.log(games[gameID].players);
            }

            break;

        case actions.SUBMIT_MOVE:
            gameID = socketToGame[socket.id];
            // gameID = action.payload.gameID;

            if (games[gameID] === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST,
                });
                break;
            } else {
                let currentGameState = games[gameID].gameState;
                let move = action.payload.move;
                let legal = utils.isLegalMove(
                    move.piece,
                    move.endRow,
                    move.endCol,
                    currentGameState.positions,
                    currentGameState.pieces,
                    currentGameState.enPassant);

                if (legal) {
                    let nextState = utils.getNextState(
                        move.piece,
                        move.endRow,
                        move.endCol,
                        currentGameState);

                    games[gameID].gameState = nextState;

                    socketEnv.socket = socketEnv.socket.join(gameID)
                    socketEnv.io = socketEnv.io.in(gameID)
                    socketEnv.broadcast = action => socketEnv.io.emit('react redux action', action)
                    socketEnv.touched = true;

                    broadcast({
                        type: actions.MOVE_APPROVED,
                        payload: {
                            gameState: nextState
                        }
                    });
                } else {
                    dispatch({
                        type: actions.MOVE_REJECTED
                    })
                }
            }

            break;
    }

    next();
}

// const handleDisconnect = function (socketEnv, next) {
//     console.log('THE SOCKET WAS DISCONNECTED OH NO');
//     let { socket } = socketEnv;

//     let gameID = socketEnv.socketToGame[socket.id];

//     if (gameID === undefined) {
//         console.log('wasn\'t in a game anyway');
//     } else {
//         if (games[gameID].players.length > 1) {
//             games[gameID].players = games[gameID].players.filter(player => player.socketID !== socket.id);
//             console.log(games[gameID].players);
//         } else {
//             delete games[gameID];
//         }
//     }

//     delete socketEnv.socketToGame[socket.id];

//     next();
// }

module.exports = function (reactReduxSocketServer) {
    reactReduxSocketServer.onActionIn(handleMessageActions);
    // reactReduxSocketServer.onDisconnect(handleDisconnect);
}

module.exports.log = _log => { log = _log; return module.exports }
