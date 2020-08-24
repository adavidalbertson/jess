import { boardDim, pieceTypes } from "../../../common/Constants.js";
import { setupNewBoard, getStateDiff } from "../../../common/ChessRules.js";
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

        case JOINED_GAME:
            newState.playerColor = action.payload.playerColor;
            //fall through

        case MOVE_APPROVED:
            newState.pieces = action.payload.board.pieces;
            newState.positions = action.payload.board.positions;
            newState.enPassant = action.payload.board.enPassant;
            newState.captured = action.payload.board.captured;
            newState.turn = action.payload.board.turn;
            newState.pendingMove = false;
            return newState;

        case GAME_OVER:
            newState.pieces = action.payload.board.pieces;
            newState.positions = action.payload.board.positions;
            newState.enPassant = action.payload.board.enPassant;
            newState.captured = action.payload.board.captured;
            newState.turn = action.payload.board.turn;
            newState.pendingMove = true;
            newState.gameOver = true;
            newState.won = action.payload.winner === state.playerColor;
            return newState;

        case RESTART_GAME:
            newState.pieces = action.payload.board.pieces;
            newState.positions = action.payload.board.positions;
            newState.enPassant = action.payload.board.enPassant;
            newState.captured = action.payload.board.captured;
            newState.turn = action.payload.board.turn;
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
