// import { boardDim, pieceTypes } from './Constants.js';
const { boardDim, pieceTypes } = require('./Constants.js');

function setupNewBoard() {
    const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;

    let pieces = [];
    let positions = [[], [], [], [], [], [], [], []];
    let captured = [];

    const backRows = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
    let curID = 0;

    for (let i = 0; i < boardDim; i++) {
        pieces[curID] = newPiece(curID, 1, backRows[i], 0, i);
        positions[0][i] = curID;
        pieces[curID + 8] = newPiece(curID + 8, 1, PAWN, 1, i);
        positions[1][i] = curID + 8;
        pieces[curID + 16] = newPiece(curID + 16, 0, PAWN, 6, i);
        positions[6][i] = curID + 16;
        pieces[curID + 24] = newPiece(curID + 24, 0, backRows[i], 7, i);
        positions[7][i] = curID + 24;

        curID++;
    }


    return {
        pieces,
        positions,
        captured,
        turn: 0,
        enPassant: null,
        moves: 0
    };
}

function newPiece(id, color, type, row, col) {
    return {
        id,
        color,
        type,
        hasMoved: false,
        captured: false,
        row,
        col
    }
}

function getPieceResource(color, type) {
    const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;

    switch (type) {
        case KING:
            return color ? '♚' : '♔';
        case QUEEN:
            return color ? '♛' : '♕';
        case BISHOP:
            return color ? '♝' : '♗';
        case KNIGHT:
            return color ? '♞' : '♘';
        case ROOK:
            return color ? '♜' : '♖';
        case PAWN:
            return color ? '♟' : '♙';
    }
}

function isLegalMove(piece, endRow, endCol, positions, pieces, enPassant, checkCheck = true) {
    const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;

    if (piece.captured)
        return false;

    if (piece.row === endRow && piece.col === endCol)
        return false;

    switch (piece.type) {
        case KING:
            if (Math.abs(piece.row - endRow) > 1 || Math.abs(piece.col - endCol) > 1)
                return false;
            break;
        case QUEEN:
            if (!vertHoriz(piece.row, piece.col, endRow, endCol)
                && !diagonal(piece.row, piece.col, endRow, endCol))
                return false;
            break;
        case BISHOP:
            if (!diagonal(piece.row, piece.col, endRow, endCol))
                return false;
            break;
        case KNIGHT:
            if (!knightMove(piece.row, piece.col, endRow, endCol))
                return false;
            break;
        case ROOK:
            if (!vertHoriz(piece.row, piece.col, endRow, endCol))
                return false;
            break;
        case PAWN:
            if (piece.row === endRow) {
                // console.log('pawn cannot stay in same row');
                return false;
            }

            if (Math.abs(piece.row - endRow) > 2) {
                // console.log('pawn cannot move more than two rows');
                return false;
            }

            if ((piece.hasMoved || piece.col !== endCol) && Math.abs(piece.row - endRow) > 1) {
                // console.log('pawn cannot move multiple rows if it has moved or is capturing');
                return false;
            }

            if (piece.col === endCol) {
                if (positions[endRow][endCol])
                    return false;

                if (piece.color && piece.row - endRow > 0) {
                    // console.log('black pawns can only move to higher rows');
                    return false;
                }

                if (!piece.color && piece.row - endRow < 0) {
                    // console.log('white pawns can only move to lower rows');
                    return false;
                }
            } else if (Math.abs(piece.col - endCol) === 1) {
                if (!pieces[positions[endRow][endCol]]
                    && (enPassant != null && (enPassant.row !== endRow || enPassant.col !== endCol))) {
                    // console.log('pawns can only move diagonally when capturing')
                    return false;
                }
            } else {
                // console.log('pawns cannot move more than one column');
                return false;
            }
            break;
        default: return false;
    }

    if (piece.type !== KNIGHT && blocked(piece.row, piece.col, endRow, endCol, positions))
        return false;

    const captureTarget = pieces[positions[endRow][endCol]];
    if (captureTarget && piece.color === captureTarget.color)
        return false;

    if (checkCheck) {
        const nextState = getNextState(piece, endRow, endCol, { pieces, positions, enPassant });
        const king = nextState.pieces.find(p => p.type === KING && p.color === piece.color);
        if (isUnderAttack(king.row, king.col, positions, pieces, piece.color))
            return false;
    }

    return true;
}

function vertHoriz(startRow, startCol, endRow, endCol) {
    return startRow == endRow || startCol === endCol;
}

function diagonal(startRow, startCol, endRow, endCol) {
    return Math.abs(startRow - endRow) === Math.abs(startCol - endCol);
}

function knightMove(startRow, startCol, endRow, endCol) {
    return (Math.abs(startRow - endRow) === 2 && Math.abs(startCol - endCol) === 1)
        || (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 2);
}

function blocked(startRow, startCol, endRow, endCol, positions) {
    let x = startRow;
    let y = startCol;
    let xInc = 0;
    let yInc = 0;

    if (startRow < endRow) {
        xInc = 1;
    } else if (startRow > endRow) {
        xInc = -1;
    }

    if (startCol < endCol) {
        yInc = 1;
    } else if (startCol > endCol) {
        yInc = -1;
    }

    x += xInc;
    y += yInc;

    while (x !== endRow || y !== endCol) {
        if (positions[x][y]) {
            return true;
        }

        x += xInc;
        y += yInc;
    }

    return false;
}

function getStateDiff(piece, endRow, endCol, state) {
    let diff = {};

    if (!isLegalMove(piece, endRow, endCol, state.positions, state.pieces, state.enPassant)) {
        return diff;
    }

    const startRow = piece.row;
    const startCol = piece.col;

    diff.pieces = [];
    diff.pieces[piece.id] = piece;

    diff.positions = [];

    const { QUEEN, PAWN } = pieceTypes;
    let capturedPieceID = state.positions[endRow][endCol];

    if (piece.type === PAWN) {
        if (endRow === 0 || endRow === boardDim - 1) {
            piece.type = QUEEN;
        }

        if (!piece.hasMoved && Math.abs(startRow - endRow) === 2) {
            diff.enPassant = {
                row: (startRow + endRow) / 2,
                col: endCol,
                pieceID: piece.id
            };
        }

        if (state.enPassant
            && endRow === state.enPassant.row
            && endCol === state.enPassant.col) {
            capturedPieceID = state.enPassant.pieceID;
        }
    }

    if (capturedPieceID) {
        let capturedPiece = newState.pieces[capturedPieceID];
        capturedPiece.captured = true;
        diff.positions[capturedPiece.row] = [];
        diff.positions[capturedPiece.row][capturedPiece.col] = null;
        diff.captured = [capturedPieceID];
    }

    piece.row = endRow;
    piece.col = endCol;
    piece.hasMoved = true;

    diff.positions[startRow] = [];
    diff.positions[startRow][startCol] = null;
    diff.positions[endRow] = [];
    diff.positions[endRow][endCol] = piece.id;

    return diff;
}

function getNextState(piece, endRow, endCol, state) {
    // if (!isLegalMove(piece, endRow, endCol, state.positions, state.pieces, state.enPassant)) {
    //     return state;
    // }

    // let newState = Object.assign({}, state);
    let newState = JSON.parse(JSON.stringify(state)); //deep copy 

    const { QUEEN, PAWN } = pieceTypes;
    const startRow = piece.row;
    const startCol = piece.col;
    let capturedPieceID = newState.positions[endRow][endCol];

    newState.enPassant = null;

    if (piece.type === PAWN) {
        if (endRow === 0 || endRow === boardDim - 1) {
            newState.pieces[piece.id].type = QUEEN;
        }

        if (!piece.hasMoved && Math.abs(startRow - endRow) === 2) {
            newState.enPassant = {
                row: (startRow + endRow) / 2,
                col: endCol,
                pieceID: piece.id
            };
        }

        if (newState.enPassant
            && endRow === newState.enPassant.row
            && endCol === newState.enPassant.col) {
            capturedPieceID = newState.enPassant.pieceID;
        }
    }

    if (capturedPieceID) {
        let capturedPiece = newState.pieces[capturedPieceID];
        newState.pieces[capturedPieceID].captured = true;
        newState.positions[capturedPiece.row][capturedPiece.col] = null;
        if (newState.captured == null) {
            newState.captured = [];
        }
        newState.captured.push(capturedPieceID);
    }

    newState.pieces[piece.id].row = endRow;
    newState.pieces[piece.id].col = endCol;
    newState.pieces[piece.id].hasMoved = true;

    // newState.positions = newState.positions.map((row, rowNum) => {
    //     if (rowNum == startRow) {
    //         row[startCol] = null;
    //     }
    //
    //     if (rowNum == action.endRow) {
    //         row[action.endCol] = action.pieceID;
    //     }
    //
    //     return row;
    // });

    newState.positions[startRow][startCol] = null;
    newState.positions[endRow][endCol] = piece.id;

    newState.turn = state.turn ? 0 : 1;
    // return { nextState: newState };
    return newState;
}

function isUnderAttack(row, col, positions, pieces, pieceColor) {
    let opposingPieces = pieces.filter(p => p.color !== pieceColor)
    for (let piece in opposingPieces) {
        if (isLegalMove(opposingPieces[piece], row, col, positions, pieces, null, false)) {
            return true;
        }
    }

    return false;
}

function getAttackers(row, col, positions, pieces, pieceColor) {
    if (!isUnderAttack(row, col, positions, pieces, pieceColor)) {
        return [];
    }

    let attackers = [];

    for (let piece in pieces.filter(p => p.color !== pieceColor)) {
        if (isLegalMove(piece, row, col, positions, pieces, null, false)) {
            attackers.push(piece);
        }
    }

    return attackers;
}

function isCheck(positions, pieces, pieceColor) {
    const { KING } = pieceTypes;
    let king = pieces.find(piece => piece.type === KING && piece.color === pieceColor);

    if (!isUnderAttack(king.row, king.col, positions, pieces, king.color)) {
        return false;
    }

    for (let attacker in getAttackers(king.row, king.col, positions, pieces, king.color)) {
        if (!isUnderAttack(attacker.row, attacker.col, positions, pieces)) {
            return true;
        }
    }

    return false;
}

function isCheckMate(positions, pieces, pieceColor) {
    if (!isCheck(positions, pieces, pieceColor)) {
        return false;
    }

    const { KING } = pieceTypes;
    let king = pieces.find(piece => piece.type === KING && piece.color === pieceColor);

    for (let x = -1; x++; x <= 1) {
        for (let y = -1; y++; y <= 1) {
            if (!isLegalMove(king, king.row + y, king.col + x, positions, pieces, null)) {
                continue;
            }

            if (!isUnderAttack(king.row + y, king.col + x, positions, pieces, king.color)) {
                return false;
            }

            for (let attacker in getAttackers(king.row, king.col, positions, pieces, king.color)) {
                if (!isUnderAttack(attacker.row, attacker.col, positions, pieces, piece.color)) {
                    return true;
                }
            }
        }
    }
}

module.exports = {
    setupNewBoard,
    getPieceResource,
    isLegalMove,
    isUnderAttack,
    isCheck,
    isCheckMate,
    getStateDiff,
    getNextState
}
