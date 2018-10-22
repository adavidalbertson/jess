import { boardDim, pieceTypes } from '../../../common/Constants.js';
import { setupNewBoard, getStateDiff } from '../../../common/Utils.js';
import { JOINED_GAME, MOVE_APPROVED, MOVE_REJECTED } from '../../../common/Actions.js';

const MOVE = 'GameState/MOVE';
const APPLY_DIFF = 'GameState/APPLY_DIFF';
const PENDING_MOVE = 'GameState/PENDING_MOVE';

// Reducer
export default function GameState(state = setupNewBoard(), action = {}) {
    const { QUEEN, PAWN } = pieceTypes;
    let newState = Object.assign({}, state);

    switch (action.type) {
        // case MOVE:
        //     const movedPiece = state.pieces[action.pieceID];
        //     const startRow = movedPiece.row;
        //     const startCol = movedPiece.col;
        //     let capturedPieceID = state.positions[action.endRow][action.endCol];
        //
        //     newState.enPassant = null;
        //
        //     if (movedPiece.type === PAWN) {
        //         if (action.endRow === 0 || action.endRow === boardDim - 1) {
        //             newState.pieces[action.pieceID].type = QUEEN;
        //         }
        //
        //         if (!movedPiece.hasMoved && Math.abs(startRow - action.endRow) === 2) {
        //             newState.enPassant = {
        //                 row: (startRow + action.endRow) / 2,
        //                 col: action.endCol,
        //                 pieceID: action.pieceID
        //             };
        //         }
        //
        //         if (state.enPassant
        //             && action.endRow === state.enPassant.row
        //             && action.endCol === state.enPassant.col) {
        //             capturedPieceID = state.enPassant.pieceID;
        //         }
        //     }
        //
        //     if (capturedPieceID) {
        //         let capturedPiece = newState.pieces[capturedPieceID];
        //         newState.pieces[capturedPieceID].captured = true;
        //         newState.positions[capturedPiece.row][capturedPiece.col] = null;
        //         newState.captured.push(capturedPieceID);
        //     }
        //
        //     newState.pieces[action.pieceID].row = action.endRow;
        //     newState.pieces[action.pieceID].col = action.endCol;
        //     newState.pieces[action.pieceID].hasMoved = true;
        //
        //     newState.positions = newState.positions.map((row, rowNum) => {
        //         if (rowNum == startRow) {
        //             row[startCol] = null;
        //         }
        //
        //         if (rowNum == action.endRow) {
        //             row[action.endCol] = action.pieceID;
        //         }
        //
        //         return row;
        //     });
        //
        //     newState.turn = newState.turn ? 0 : 1;
        //     return newState;
        // case APPLY_DIFF:
        // case MOVE:
            // let piece = newState.pieces[action.pieceID];
            // let diff = getStateDiff(piece, action.endRow, action.endCol, newState);
            // console.log(diff);

            // if (diff.pieces) {
            //     diff.pieces.forEach(piece => { newState.pieces[piece.id] = piece; });
            // }

            // if (diff.captured) {
            //     diff.captured.forEach(pieceID => { newState.captured.push(pieceID); });
            // }

            // if (diff.positions) {
            //     diff.positions.forEach((row, rowNum) => {
            //         row.forEach((pieceID, colNum) => {
            //             newState.positions[rowNum][colNum] = pieceID;
            //         });
            //     });
            // }

            // if (diff.enPassant) {
            //     newState.enPassant = diff.enPassant;
            // }

            // return Object.assign({}, newState);
        case PENDING_MOVE:
            newState.pendingMove = true;
            return newState;
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
        case MOVE_REJECTED:
            console.log('Move got rejected:', action.payload.reason);
            newState.pendingMove = false;
            return newState;
        default: return state;
    }
}

// Action Creators
export function movePiece(pieceID, endRow, endCol) {
    return {
        type: MOVE,
        pieceID,
        endRow,
        endCol
    };
}

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
