const actions = require("../../common/Actions.js");
const { setupNewBoard } = require("../../common/ChessRules.js");

let gameID;
let game;

const handleMessageActions = function(action, socketEnv, next) {
    let { dispatch, broadcast, socket, games, socketToGame } = socketEnv;
    let gameState;

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

            gameState = setupNewBoard();

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
                    board: gameState.board
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
                    board: game.gameState.board
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
                game.players[gameState.board.turn] == null ||
                socket.id !== game.players[gameState.board.turn].socketID
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
                legal = gameState.isLegalMove(
                    move.piece,
                    move.endRow,
                    move.endCol
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

            let nextState = gameState.movePiece(
                move.piece,
                move.endRow,
                move.endCol
            );

            game.gameState = nextState;

            if (nextState.isCheckMate(nextState.board.turn)) {
                game.gameState.winner = gameState.board.turn;

                broadcast({
                    type: actions.GAME_OVER,
                    payload: {
                        board: nextState.board,
                        winner: gameState.board.turn,
                        reason: "Checkmate"
                    }
                });

                break;
            } else {
                broadcast({
                    type: actions.MOVE_APPROVED,
                    payload: {
                        board: nextState.board
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

            game.gameState = setupNewBoard();

            broadcast({
                type: actions.RESTART_GAME,
                payload: {
                    board: game.gameState.board,
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
