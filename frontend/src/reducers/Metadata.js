// const NEW_GAME = 'metadata/NEW_GAME';
const JOIN_GAME = 'metadata/JOIN_GAME';

export default function Metadata(state = {}, action = {}) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        // case NEW_GAME:
        //     newState.gameID = action.gameID;
        //     newState.playerColor = 0;
        //     return newState;
        case JOIN_GAME:
            newState.gameID = action.gameID;
            newState.playerColor = action.playerColor;
            return newState;
        default: return state;
    }
}

// export function newGame(gameID) {
//     return {
//         type: NEW_GAME,
//         gameID
//     }
// }

export function joinGame(gameID, playerColor, nextState) {
    return {
        type: JOIN_GAME,
        gameID,
        playerColor,
        nextState
    }
}
