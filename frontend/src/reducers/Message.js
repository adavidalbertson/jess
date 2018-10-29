import uuidv1 from "uuid/v1";

import {
    NEW_GAME,
    JOINED_GAME,
    OPPONENT_JOINED,
    OPPONENT_LEFT,
    GAME_DOES_NOT_EXIST,
    GAME_IS_FULL,
    MOVE_REJECTED,
    MOVE_APPROVED,
    GAME_OVER
} from "../../../common/Actions.js";

export const SUCCESS = "Messages/SUCCESS";
export const FAIL = "Messages/FAIL";

// Reducer
export default function Messages(state = {}, action = {}) {
    let newState = Object.assign({}, state);
    newState.ID = uuidv1();

    switch (action.type) {
        case NEW_GAME:
            newState.message = "Started new game.";
            newState.type = SUCCESS;
            newState.playerColor = action.payload.playerColor;
            return newState;
        case JOINED_GAME:
            newState.message = "Joined game.";
            newState.type = SUCCESS;
            newState.playerColor = action.payload.playerColor;
            return newState;
        case OPPONENT_JOINED:
            if (action.payload.playerColor != state.playerColor) {
                newState.message = "Opponent joined.";
                newState.type = SUCCESS;
                return newState;
            } else {
                newState.message = "Joined game.";
                newState.type = SUCCESS;
                return newState;
            }
        case OPPONENT_LEFT:
            newState.message = "Opponent disconnected.";
            newState.type = FAIL;
            return newState;
        case GAME_DOES_NOT_EXIST:
            newState.message = "Game does not exist.";
            newState.type = FAIL;
            return newState;
        case GAME_IS_FULL:
            newState.message = "Game is full.";
            newState.type = FAIL;
            return newState;
        case GAME_OVER:
            if (action.payload.winner < 0 || action.payload.winner > 1) {
                newState.message = action.payload.reason
                    ? "Draw: " + action.payload.reason
                    : "Draw.";
                newState.type = SUCCESS;
            } else if (action.payload.winner === state.playerColor) {
                newState.message = action.payload.reason
                    ? "Victory: " + action.payload.reason
                    : "Victory.";
                newState.type = SUCCESS;
            } else {
                newState.message = action.payload.reason
                    ? "Defeat: " + action.payload.reason
                    : "Defeat.";
                newState.type = FAIL;
            }
            return newState;
        case MOVE_REJECTED:
            newState.message = action.payload.reason
                ? "Move rejected: " + action.payload.reason
                : "Move rejected."
                newState.type = FAIL;
                return newState;
        default:
            return state;
    }
}
