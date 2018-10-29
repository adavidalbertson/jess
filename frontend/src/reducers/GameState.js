import { boardDim, pieceTypes } from "../../../common/Constants.js";
import { setupNewBoard, getStateDiff } from "../../../common/Utils.js";
import {
    NEW_GAME,
    RESTART_GAME,
    JOINED_GAME,
    MOVE_APPROVED,
    MOVE_REJECTED,
    GAME_OVER
} from "../../../common/Actions.js";

const PENDING_MOVE = "GameState/PENDING_MOVE";

// Reducer
export default function GameState(state = setupNewBoard(), action = {}) {
    const { QUEEN, PAWN } = pieceTypes;
    let newState = Object.assign({}, state);

    switch (action.type) {
        case PENDING_MOVE:
            newState.pendingMove = true;
            return newState;
        // case NEW_GAME:
        //fall through
        case JOINED_GAME:
            newState.playerColor = action.payload.playerColor;
        //fall through
        case MOVE_APPROVED:
            newState.pieces = action.payload.gameState.pieces;
            newState.positions = action.payload.gameState.positions;
            newState.enPassant = action.payload.gameState.enPassant;
            newState.captured = action.payload.gameState.captured;
            newState.turn = action.payload.gameState.turn;
            newState.pendingMove = false;
            return newState;
        case GAME_OVER:
            newState.pieces = action.payload.gameState.pieces;
            newState.positions = action.payload.gameState.positions;
            newState.enPassant = action.payload.gameState.enPassant;
            newState.captured = action.payload.gameState.captured;
            newState.turn = action.payload.gameState.turn;
            newState.pendingMove = true;
            newState.gameOver = true;
            newState.won = action.payload.winner === state.playerColor;
            return newState;
        case RESTART_GAME:
            newState.pieces = action.payload.gameState.pieces;
            newState.positions = action.payload.gameState.positions;
            newState.enPassant = action.payload.gameState.enPassant;
            newState.captured = action.payload.gameState.captured;
            newState.turn = action.payload.gameState.turn;
            newState.pendingMove = false;
            newState.gameOver = false;
            newState.won = false;
            newState.playerColor = (state.playerColor + action.payload.swap) % 2;
            return newState;
        case MOVE_REJECTED:
            newState.pendingMove = false;
            return newState;
        default:
            return state;
    }
}

// Action Creators
export function pendingMove() {
    return {
        type: PENDING_MOVE
    };
}

export function moveApproved(nextState) {
    return {
        type: MOVE_APPROVED,
        nextState
    };
}

export function moveRejected() {
    return {
        type: MOVE_REJECTED
    };
}
