const utils = require('../../common/Utils.js');
const actions = require('../../common/Actions.js');
const uuidv1 = require('uuid/v1');

let gameID;

const handleMessageActions = function (action, socketEnv, next) {
    let { dispatch, broadcast, socket, games, socketToGame } = socketEnv;

    switch (action.type) {
        case actions.NEW_GAME:
            gameID = socketToGame[socket.id];

            let playerOne = {
                socketID: socket.id
            };

            let gameState = utils.setupNewBoard();

            let game = {
                id: gameID,
                players: [
                    playerOne
                ],
                gameState
            };

            games[gameID] = game;

            dispatch({
                type: actions.JOINED_GAME,
                payload: {
                    gameID,
                    gameState
                }
            });

            broadcast({
                type: actions.NEW_GAME
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
                });
            } else {
                const player = {
                    socketID: socket.id
                };

                games[gameID].players.push(player);

                dispatch({
                    type: actions.JOINED_GAME,
                    payload: {
                        gameID: gameID,
                        gameState: games[gameID].gameState
                    }
                });

                broadcast({
                    type: actions.OPPONENT_JOINED
                });

                console.log(games[gameID].players);
            }

            break;

        case actions.SUBMIT_MOVE:
            gameID = socketToGame[socket.id];

            if (games[gameID] === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST,
                });
                break;
            } else {
                let currentGameState = games[gameID].gameState;
                let move = action.payload.move;
                let legal = false;

                try {
                    legal = utils.isLegalMove(
                        move.piece,
                        move.endRow,
                        move.endCol,
                        currentGameState.positions,
                        currentGameState.pieces,
                        currentGameState.enPassant);
                } catch (e) {
                    dispatch({
                        type: actions.MOVE_REJECTED
                    });
                }

                if (legal) {
                    let nextState = utils.getNextState(
                        move.piece,
                        move.endRow,
                        move.endCol,
                        currentGameState);

                    games[gameID].gameState = nextState;

                    broadcast({
                        type: actions.MOVE_APPROVED,
                        payload: {
                            gameState: nextState
                        }
                    });
                } else {
                    dispatch({
                        type: actions.MOVE_REJECTED
                    });
                }
            }

            break;
    }

    next();
}

module.exports = function (reactReduxSocketServer) {
    reactReduxSocketServer.onActionIn(handleMessageActions);
}

module.exports.log = _log => { log = _log; return module.exports }
