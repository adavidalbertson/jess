const rules = require("../../common/ChessRules.js");
const actions = require("../../common/Actions.js");

let gameID;
let game;

const handleMessageActions = function(action, socketEnv, next) {
    let { dispatch, broadcast, socket, games, socketToGame } = socketEnv;
    let gamestate;

    switch (action.type) {
        case actions.NEW_GAME:
            gameID = socketToGame[socket.id];
            if (gameID === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST
                });

                break;
            }

            let playerOne = {
                socketID: socket.id
            };

            gameState = rules.setupNewBoard();

            game = {
                id: gameID,
                players: [null, null],
                gameState
            };

            game.players[0] = playerOne;

            games[gameID] = game;

            dispatch({
                type: actions.JOINED_GAME,
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
            }

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

            break;

        case actions.SUBMIT_MOVE:
            gameID = socketToGame[socket.id];
            if (gameID === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST
                });

                break;
            }

            game = games[gameID];
            if (game === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST
                });

                break;
            }

            gameState = game.gameState;

            if (
                game.players[gameState.turn] == null ||
                socket.id !== game.players[gameState.turn].socketID
            ) {
                dispatch({
                    type: actions.MOVE_REJECTED,
                    payload: {
                        reason: "It's not your turn."
                    }
                });

                break;
            }

            let move = action.payload.move;
            let legal = false;

            try {
                legal = rules.isLegalMove(
                    move.piece,
                    move.endRow,
                    move.endCol,
                    gameState
                );
            } catch (e) {
                dispatch({
                    type: actions.MOVE_REJECTED,
                    payload: {
                        reason: "Invalid move format."
                    }
                });

                break;
            }

            if (!legal.result) {
                dispatch({
                    type: actions.MOVE_REJECTED,
                    payload: {
                        reason: legal.reason
                    }
                });

                break;
            }

            let nextState = rules.getNextState(
                move.piece,
                move.endRow,
                move.endCol,
                gameState
            );

            game.gameState = nextState;

            if (rules.isCheckMate(nextState, nextState.turn)) {
                game.gameState.winner = gameState.turn;

                broadcast({
                    type: actions.GAME_OVER,
                    payload: {
                        gameState: nextState,
                        winner: gameState.turn,
                        reason: "Checkmate"
                    }
                });

                break;
            } else {
                broadcast({
                    type: actions.MOVE_APPROVED,
                    payload: {
                        gameState: nextState
                    }
                });

                break;
            }

            break;

        case actions.RESTART_GAME:
            gameID = socketToGame[socket.id];
            if (gameID === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST
                });

                break;
            }

            game = games[gameID];
            let players = game.players;

            if (
                game.gameState.winner !== undefined &&
                players[game.gameState.winner].socketID !== socket.id
            ) {
                break;
            }

            let swap = false;

            if (
                players[action.payload.playerColor] == null ||
                players[action.payload.playerColor].socketID !== socket.id
            ) {
                players.reverse();
                swap = true;
            }

            game.gameState = rules.setupNewBoard();

            broadcast({
                type: actions.RESTART_GAME,
                payload: {
                    gameState: rules.setupNewBoard(),
                    swap
                }
            });

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
