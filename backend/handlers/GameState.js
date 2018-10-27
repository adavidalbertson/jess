const utils = require("../../common/Utils.js");
const actions = require("../../common/Actions.js");
const uuidv1 = require("uuid/v1");

let gameID;
let game;

const handleMessageActions = function(action, socketEnv, next) {
    let { dispatch, broadcast, socket, games, socketToGame } = socketEnv;

    switch (action.type) {
        case actions.NEW_GAME:
            gameID = socketToGame[socket.id];

            let playerOne = {
                socketID: socket.id
            };

            let gameState = utils.setupNewBoard();

            game = {
                id: gameID,
                players: [null, null],
                gameState
            };

            game.players[0] = playerOne;

            games[gameID] = game;

            // seem to need this dummy dispatch or else broadcast loses its scope
            dispatch({
                type: "null"
            });

            broadcast({
                type: actions.NEW_GAME,
                payload: {
                    gameID,
                    playerColor: 0,
                    gameState
                }
            });

            break;

        case actions.JOIN_GAME:
            gameID = action.payload.gameID;
            game = games[gameID];

            if (game === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST
                });
                break;
            } else if (game.players.filter(p => p != null).length > 1) {
                dispatch({
                    type: actions.GAME_IS_FULL
                });
                break;
            } else {
                const player = {
                    socketID: socket.id
                };

                let playerColor = game.players.indexOf(null);

                if (playerColor == null || playerColor < 0 || playerColor > 1) {
                    dispatch({
                        type: actions.GAME_IS_FULL
                    });
                    break;
                }

                game.players[playerColor] = player;

                dispatch({
                    type: actions.JOINED_GAME,
                    payload: {
                        gameID: gameID,
                        playerColor,
                        gameState: game.gameState
                    }
                });

                broadcast({
                    type: actions.OPPONENT_JOINED,
                    payload: {
                        playerColor
                    }
                });
            }

            break;

        case actions.SUBMIT_MOVE:
            gameID = socketToGame[socket.id];
            game = games[gameID];

            if (game === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST
                });
                break;
            } else {
                let gameState = game.gameState;

                if (
                    game.players[gameState.turn] != null &&
                    socket.id === game.players[gameState.turn].socketID
                ) {
                    let move = action.payload.move;
                    let legal = false;

                    try {
                        legal = utils.isLegalMove(
                            move.piece,
                            move.endRow,
                            move.endCol,
                            gameState.positions,
                            gameState.pieces,
                            gameState.enPassant
                        );
                    } catch (e) {
                        dispatch({
                            type: actions.MOVE_REJECTED,
                            payload: {
                                reason: "Invalid move format."
                            }
                        });
                    }

                    if (legal) {
                        let nextState = utils.getNextState(
                            move.piece,
                            move.endRow,
                            move.endCol,
                            gameState
                        );

                        game.gameState = nextState;

                        if (
                            utils.isCheckMate(
                                nextState.positions,
                                nextState.pieces,
                                nextState.turn
                            )
                        ) {
                            broadcast({
                                type: actions.GAME_OVER,
                                payload: {
                                    gameState: nextState,
                                    winner: gameState.turn,
                                    reason: "Checkmate"
                                }
                            });
                        } else {
                            broadcast({
                                type: actions.MOVE_APPROVED,
                                payload: {
                                    gameState: nextState
                                }
                            });
                        }
                    } else {
                        dispatch({
                            type: actions.MOVE_REJECTED,
                            payload: {
                                reason: "Illegal move."
                            }
                        });
                    }
                } else {
                    dispatch({
                        type: actions.MOVE_REJECTED,
                        payload: {
                            reason: "It's not your turn."
                        }
                    });
                    break;
                }
            }

            break;
    }

    next();
};

module.exports = function(reactReduxSocketServer) {
    reactReduxSocketServer.onActionIn(handleMessageActions);
};

module.exports.log = _log => {
    log = _log;
    return module.exports;
};
