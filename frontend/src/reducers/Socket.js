import { MakeSocketAction } from "react-redux-socket/client";

import actions from "../../../common/Actions.js";

export default function Socket(state = { msgs: [] }, action = {}) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case actions.NEW_GAME:
            //fall through
        case actions.JOINED_GAME:
            newState.gameID = action.payload.gameID;
            return newState;
        case actions.GAME_DOES_NOT_EXIST:
        case actions.GAME_IS_FULL:
            delete newState.gameID;
            return newState;

        default:
            return state;
    }
}

export function newGame() {
    return MakeSocketAction({
        type: actions.NEW_GAME
    });
}

export function submitMove(move) {
    return MakeSocketAction({
        type: actions.SUBMIT_MOVE,
        payload: {
            move
        }
    });
}
