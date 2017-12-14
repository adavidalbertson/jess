const utils = require('../../common/Utils.js');
const actions = require('../../common/Actions.js');
const uuidv1 = require('uuid/v1');

let games = {};

const handleMessageActions = function(action, socketEnv, next) {
    const { dispatch, broadcast } = socketEnv;

    switch(action.type) {
        case actions.NEW_GAME:
            const gameID = uuidv1();

            const playerOne = {
                socketID: socketEnv.socket.id
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

            dispatch({
                type: actions.JOINED_GAME,
                payload: {
                    gameID,
                    gameState
                }
            });

            break;
        case actions.JOIN_GAME:
            if (games[action.payload.gameID] === undefined) {
                dispatch({
                    type: actions.GAME_DOES_NOT_EXIST,
                });
                break;
            } else {
                const player = {
                    socketID: socketEnv.socket.id
                }

                games[action.payload.gameID].players.push(player);

                dispatch({
                    type: actions.JOINED_GAME,
                    payload: {
                        gameID: action.payload.gameID,
                        gameState: games[action.payload.gameID].gameState
                    }
                });
            }

            break;
    }

    next()
}

module.exports = function(reactReduxSocketServer) {
    reactReduxSocketServer.onActionIn(handleMessageActions)
}

module.exports.log = _log => { log = _log; return module.exports }
