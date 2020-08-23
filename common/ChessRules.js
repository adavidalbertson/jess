const { boardDim, pieceTypes, pieceColors, BASE_PIECES } = require("./Constants.js");

const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;
const { BLACK, WHITE } = pieceColors;

function setupNewBoard() {
    let pieces = [];
    let positions = [[], [], [], [], [], [], [], []];
    let captured = [];

    let board = {
        gameState: {
            pieces,
            positions,
            captured,
            turn: 0,
            enPassant: null,
            moves: 0,
            gameOver: false
        },
        withPieces: function(...pieces) {
            for (const piece of pieces) {
                let oldPiece = this.gameState.pieces[piece.id];
                if (oldPiece != null) {
                    this.gameState.positions[oldPiece.row][oldPiece.col] = null;
                }

                this.gameState.pieces[piece.id] = piece;
                this.gameState.positions[piece.row][piece.col] = piece.id;
            }

            return this;
        },
        withStartingPieces: function(...basePieces) {
            return this.withPieces(...basePieces.map(bp => newPieceFromBase(bp)));
        }
    };

    return board.withStartingPieces(...Object.values(BASE_PIECES)).gameState;
}

function printBoard(state) {
    let str = " ------------------------ \n";
    for (j = 0; j < 8; j++) {
        let row = state.positions[j];
        str += "|";
        for (i = 0; i < 8; i++) {
            const pid = row[i];
            const shade = (i + j) % 2 == 1 ? "▒" : " ";
            if (pid == null)
                str += shade + shade + shade;
            else {
                let piece = state.pieces[pid]
                str += shade + getPieceResource(piece.color, piece.type) + shade;
            }
        }
        str += "|\n"
    }
    str += " ------------------------ ";
    console.log(str);
    return str;
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
    };
}

function newPieceFromBase(basePiece) {
    return {
        id: basePiece.id,
        color: basePiece.color,
        type: basePiece.type,
        hasMoved: false,
        captured: false,
        row: basePiece.startingRow,
        col: basePiece.startingCol
    }
}

function getPieceResource(color, type) {
    const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;

    switch (type) {
        case KING:
            return color === BLACK ? "♚" : "♔";
        case QUEEN:
            return color === BLACK ? "♛" : "♕";
        case BISHOP:
            return color === BLACK ? "♝" : "♗";
        case KNIGHT:
            return color === BLACK ? "♞" : "♘";
        case ROOK:
            return color === BLACK ? "♜" : "♖";
        case PAWN:
            return color === BLACK ? "♟" : "♙";
    }
}

function illegal(reason) {
    return {result: false, reason};
}

function isLegalMove(piece, endRow, endCol, state, turn = state.turn) {
    const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;
    const { positions, pieces, enPassant } = state;

    if (piece.color != turn) {
        return illegal("It's not your turn");
    }

    if (piece.captured) {
        return illegal("That piece is captured");
    }

    if (piece.row === endRow && piece.col === endCol) {
        return illegal("The piece didn't move");
    }

    switch (piece.type) {
        case KING:
            if (piece.row === endRow && Math.abs(piece.col - endCol) === 2) {
                if (piece.hasMoved)
                    return illegal("Cannot castle if the king has moved");

                if (isCheck(state, piece.color))
                    return illegal("Cannot castle while in check");

                let direction = piece.col - endCol;

                let rook = pieces.find(p => 
                        p != null &&
                        p.color === piece.color &&
                        p.type === ROOK &&
                        (piece.col - p.col) * direction > 0);

                if (rook.hasMoved)
                    return illegal("Cannot castle with a rook that has moved");

                if (blocked(piece.row, piece.col, rook.row, rook.col, positions)) {
                    return illegal("Cannot castle if there are pieces between the king and the rook");
                }

                let throughSquares = intermediateSquares(piece.row, piece.col, endRow, endCol);
                if (throughSquares.some(sq => isUnderAttack(sq.row, sq.col, state, piece.color))) {
                    return illegal("The king cannot castle through any squares that are under attack");
                }

            } else if (
                Math.abs(piece.row - endRow) > 1 ||
                Math.abs(piece.col - endCol) > 1
            ) {
                return illegal("The king cannot move more than one square at a time");
            }
            
            break;

        case QUEEN:
            if (
                !vertHoriz(piece.row, piece.col, endRow, endCol) &&
                !diagonal(piece.row, piece.col, endRow, endCol)
            )
                return illegal("The queen can only move vertically, horizontally, or diagonally");
            break;

        case BISHOP:
            if (!diagonal(piece.row, piece.col, endRow, endCol)) {
                return illegal("Bishops can only move diagonally");
            }
            break;

        case KNIGHT:
            if (!knightMove(piece.row, piece.col, endRow, endCol)) {
                return illegal("Knights can only move knightwise");
            }
            break;

        case ROOK:
            if (!vertHoriz(piece.row, piece.col, endRow, endCol)) {
                return illegal("Rooks can only move vertically or horizontally");
            }
            break;

        case PAWN:
            if (piece.row === endRow) {
                return illegal("Pawns cannot move horizontally");
            }

            if (Math.abs(piece.row - endRow) > 2) {
                return illegal("Pawns cannot move further than two rows");
            }

            if (
                (piece.hasMoved || piece.col !== endCol) &&
                Math.abs(piece.row - endRow) > 1
            ) {
                return illegal("Pawns cannot move more than one row if it has moved or is capturing");
            }

            if ((piece.color === BLACK && piece.row > endRow) || (piece.color == WHITE && piece.row < endRow)) {
                return illegal("Pawns can only move forward");
            }

            if (piece.col === endCol) {
                if (positions[endRow][endCol]) {
                    return illegal("Pawns cannot capture vertically");
                }
            } else if (Math.abs(piece.col - endCol) === 1) {
                if (
                    !pieces[positions[endRow][endCol]] &&
                    (enPassant == null ||
                        (
                            enPassant != null &&
                            (
                                enPassant.row !== endRow ||
                                enPassant.col !== endCol ||
                                pieces[enPassant.pieceID].color === piece.color
                            )
                        )
                    )
                ) {
                    return illegal("Pawns can only move diagonally when capturing");
                }
            } else {
                return illegal("Pawns cannot move more than one column");
            }
            break;

        default:
            return illegal("I don't know, man. What did you do? That's not even a real piece!");
    }

    if (
        piece.type !== KNIGHT &&
        blocked(piece.row, piece.col, endRow, endCol, positions)
    ) {
        return illegal("That move is blocked by another piece");
    }

    const captureTarget = pieces[positions[endRow][endCol]];
    if (captureTarget && piece.color === captureTarget.color) {
        return illegal("Cannot capture a piece of the same color");
    }

    const nextState = getNextState(piece, endRow, endCol, {
        pieces,
        positions,
        enPassant
    });

    if(isCheck(nextState, piece.color))
        return illegal("Cannot move into check");

    return {result: true, reason: "That move is legal"};
}

function vertHoriz(startRow, startCol, endRow, endCol) {
    return startRow == endRow || startCol === endCol;
}

function diagonal(startRow, startCol, endRow, endCol) {
    return Math.abs(startRow - endRow) === Math.abs(startCol - endCol);
}

function knightMove(startRow, startCol, endRow, endCol) {
    return (
        (Math.abs(startRow - endRow) === 2 &&
            Math.abs(startCol - endCol) === 1) ||
        (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 2)
    );
}

function intermediateSquares(startRow, startCol, endRow, endCol) {
    let r = startRow;
    let c = startCol;
    let rInc = 0;
    let cInc = 0;

    if (startRow < endRow) {
        rInc = 1;
    } else if (startRow > endRow) {
        rInc = -1;
    }

    if (startCol < endCol) {
        cInc = 1;
    } else if (startCol > endCol) {
        cInc = -1;
    }

    r += rInc;
    c += cInc;

    let squares = [];

    while (r !== endRow || c !== endCol) {
        squares.push({ row: r, col: c });

        r += rInc;
        c += cInc;
    }

    return squares;
}

function blocked(startRow, startCol, endRow, endCol, positions) {
    for (let square of intermediateSquares(
        startRow,
        startCol,
        endRow,
        endCol
    )) {
        if (positions[square.row][square.col]) {
            return true;
        }
    }

    return false;
}

function getNextState(piece, endRow, endCol, state) {
    let newState = JSON.parse(JSON.stringify(state)); //deep copy

    const { QUEEN, PAWN, KING, ROOK } = pieceTypes;
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

        if (
            newState.enPassant &&
            endRow === newState.enPassant.row &&
            endCol === newState.enPassant.col
        ) {
            capturedPieceID = newState.enPassant.pieceID;
        }
    }

    if (piece.type === KING && piece.row === endRow && Math.abs(piece.col - endCol) === 2) {
        let direction = (piece.col - endCol) / 2;
        let rook = state.pieces.find(
            p => p != null
            && p.color === piece.color
            && p.type === ROOK
            && !p.hasMoved
            && (piece.col - p.col) * direction > 0
        );

        newState.pieces[rook.id].col = piece.col - direction;
        newState.pieces[rook.id].hasMoved = true;
        newState.positions[rook.row][rook.col] = null;
        newState.positions[rook.row][piece.col - direction] = rook.id;
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

    newState.positions[startRow][startCol] = null;
    newState.positions[endRow][endCol] = piece.id;

    newState.turn = state.turn ? 0 : 1;

    return newState;
}

function isUnderAttack(row, col, state, pieceColor, includeKing = true) {
    const { pieces } = state;

    let opposingPieces = pieces.filter(
        p =>
            p != null &&
            p.color !== pieceColor &&
            !p.captured &&
            (includeKing || p.type !== pieceTypes.KING)
    );

    for (let piece of opposingPieces) {
        if (isLegalMove(piece, row, col, state, piece.color).result) {
            return true;
        }
    }

    return false;
}

function getAttackers(row, col, state, pieceColor) {
    const { pieces } = state;

    if (!isUnderAttack(row, col, state, pieceColor)) {
        return [];
    }

    let attackers = [];

    for (let piece of pieces) {
        // For some reason filtering these out beforehand causes attackers to
        // not always be found.
        if (piece == null || piece.color === pieceColor) continue;

        if (isLegalMove(piece, row, col, state, piece.color).result) attackers.push(piece);
    }

    return attackers;
}

function isCheck(state, pieceColor) {
    const { pieces } = state;
    const { KING } = pieceTypes;

    let king = pieces.find(
        piece => piece != null && piece.type === KING && piece.color === pieceColor
    );

    return isUnderAttack(king.row, king.col, state, king.color);
}

function isCheckMate(state, pieceColor) {
    const { pieces } = state;

    if (!isCheck(state, pieceColor)) {
        return false;
    }

    const KING = pieceTypes.KING;
    
    let king = pieces.find(
        piece => piece != null && piece.type === KING && piece.color === pieceColor
    );

    for (let c = -1; c++; c <= 1) {
        for (let r = -1; r++; r <= 1) {
            if (r === 0 && c === 0)
                continue;

            if (!isLegalMove(king, king.row + r, king.col + c, state, king.color).result) {
                continue;
            }

            if (!isUnderAttack(king.row + r, king.col + c, state, king.color)) {
                return false;
            }
        }
    }

    for (let attacker of getAttackers(king.row, king.col, state, king.color)) {
        if (isUnderAttack(attacker.row, attacker.col, state, attacker.color)) {
            continue;
        }

        let squares = intermediateSquares(
            attacker.row,
            attacker.col,
            king.row,
            king.col
        );

        if (
            squares.some(square =>
                isUnderAttack(
                    square.row,
                    square.col,
                    state,
                    attacker.color,
                    false
                )
            )
        ) {
            continue;
        }

        return true;
    }

    return false;
}

module.exports = {
    setupNewBoard,
    getPieceResource,
    newPiece,
    newPieceFromBase,
    isLegalMove,
    isUnderAttack,
    isCheck,
    isCheckMate,
    getNextState,
    printBoard
};
