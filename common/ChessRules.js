const { boardDim, pieceTypes, pieceColors, BASE_PIECES } = require("./Constants.js");

const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;
const { BLACK, WHITE } = pieceColors;

function setupEmptyBoard() {
    let pieces = [];
    let positions = [[], [], [], [], [], [], [], []];
    let captured = [];

    return {
        board: {
            pieces,
            positions,
            captured,
            turn: 0,
            enPassant: null,
            moves: 0,
            gameOver: false
        },

        withPieces(...pieces) {
            for (const piece of pieces) {
                let oldPiece = this.board.pieces[piece.id];
                if (oldPiece != null) {
                    this.board.positions[oldPiece.row][oldPiece.col] = null;
                }

                this.board.pieces[piece.id] = piece;
                this.board.positions[piece.row][piece.col] = piece.id;
            }

            return this;
        },

        withStartingPieces(...basePieces) {
            return this.withPieces(...basePieces.map(bp => newPieceFromBase(bp)));
        },

        movePiece(basePiece, row, col) {
            let piece = this.board.pieces[basePiece.id];
            let legal;
            legal = this.isLegalMove(piece, row, col);
            if (!legal.result) {
                this.print();
                throw new Error("Illegal move! " + legal.reason);
            }
    
            // let newState = setupEmptyBoard();
            // newState.board = this.getNextState(piece, row, col);
    
            // return newState;
            return this.getNextState(piece, row, col);
        },

        withBoard(board) {
            this.board = board;
            return this;
        },

        isLegalMove(piece, endRow, endCol, turn = this.board.turn) {
            const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;
            const { positions, pieces, enPassant } = this.board;
        
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
        
                        if (this.isCheck(piece.color))
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
                        if (throughSquares.some(sq => this.isUnderAttack(sq.row, sq.col, piece.color))) {
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
        
            const nextState = this.getNextState(piece, endRow, endCol);
        
            if(nextState.isCheck(piece.color))
                return illegal("Cannot move into check");
        
            return {result: true, reason: "That move is legal"};
        },

        getNextState(piece, endRow, endCol) {
            let newBoard = JSON.parse(JSON.stringify(this.board)); //deep copy
        
            let nextState = setupEmptyBoard();
            nextState.board = newBoard;

            const { QUEEN, PAWN, KING, ROOK } = pieceTypes;
            const startRow = piece.row;
            const startCol = piece.col;
            let capturedPieceID = newBoard.positions[endRow][endCol];
        
            newBoard.enPassant = null;
        
            if (piece.type === PAWN) {
                if (endRow === 0 || endRow === boardDim - 1) {
                    newBoard.pieces[piece.id].type = QUEEN;
                }
        
                if (!piece.hasMoved && Math.abs(startRow - endRow) === 2) {
                    newBoard.enPassant = {
                        row: (startRow + endRow) / 2,
                        col: endCol,
                        pieceID: piece.id
                    };
                }
        
                if (
                    newBoard.enPassant &&
                    endRow === newBoard.enPassant.row &&
                    endCol === newBoard.enPassant.col
                ) {
                    capturedPieceID = newBoard.enPassant.pieceID;
                }
            }
        
            if (piece.type === KING && piece.row === endRow && Math.abs(piece.col - endCol) === 2) {
                let direction = (piece.col - endCol) / 2;
                let rook = newBoard.pieces.find(
                    p => p != null
                    && p.color === piece.color
                    && p.type === ROOK
                    && !p.hasMoved
                    && (piece.col - p.col) * direction > 0
                );
        
                newBoard.pieces[rook.id].col = piece.col - direction;
                newBoard.pieces[rook.id].hasMoved = true;
                newBoard.positions[rook.row][rook.col] = null;
                newBoard.positions[rook.row][piece.col - direction] = rook.id;
            }
        
            if (capturedPieceID) {
                let capturedPiece = newBoard.pieces[capturedPieceID];
                newBoard.pieces[capturedPieceID].captured = true;
                newBoard.positions[capturedPiece.row][capturedPiece.col] = null;
                if (newBoard.captured == null) {
                    newBoard.captured = [];
                }
                newBoard.captured.push(capturedPieceID);
            }
        
            newBoard.pieces[piece.id].row = endRow;
            newBoard.pieces[piece.id].col = endCol;
            newBoard.pieces[piece.id].hasMoved = true;
        
            newBoard.positions[startRow][startCol] = null;
            newBoard.positions[endRow][endCol] = piece.id;
        
            newBoard.turn = newBoard.turn ? 0 : 1;
        
            return nextState;
        },

        isUnderAttack(row, col, pieceColor, includeKing = true) {
            const pieces = this.board.pieces;
        
            let opposingPieces = pieces.filter(
                p =>
                    p != null &&
                    p.color !== pieceColor &&
                    !p.captured &&
                    (includeKing || p.type !== pieceTypes.KING)
            );
        
            for (let piece of opposingPieces) {
                if (this.isLegalMove(piece, row, col, piece.color).result) {
                    return true;
                }
            }
        
            return false;
        },

        getAttackers(row, col, pieceColor) {
            const pieces = this.board.pieces;
        
            if (!this.isUnderAttack(row, col, pieceColor)) {
                return [];
            }
        
            let attackers = [];
        
            for (let piece of pieces) {
                // For some reason filtering these out beforehand causes attackers to
                // not always be found.
                if (piece == null || piece.color === pieceColor) continue;
        
                if (this.isLegalMove(piece, row, col, piece.color).result) attackers.push(piece);
            }
        
            return attackers;
        },

        isCheck(pieceColor) {
            const pieces = this.board.pieces;
            const { KING } = pieceTypes;
        
            let king = pieces.find(
                piece => piece != null && piece.type === KING && piece.color === pieceColor
            );
        
            return this.isUnderAttack(king.row, king.col, king.color);
        },

        isCheckMate(pieceColor) {
            const pieces = this.board.pieces;
        
            if (!this.isCheck(pieceColor)) {
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
        
                    if (!this.isLegalMove(king, king.row + r, king.col + c, king.color).result) {
                        continue;
                    }
        
                    if (!this.isUnderAttack(king.row + r, king.col + c, king.color)) {
                        return false;
                    }
                }
            }
        
            for (let attacker of this.getAttackers(king.row, king.col, king.color)) {
                if (this.isUnderAttack(attacker.row, attacker.col, attacker.color)) {
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
                        this.isUnderAttack(
                            square.row,
                            square.col,
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
        },

        // For testing
        toString() {
            let str = " ------------------------ \n";
            for (j = 0; j < 8; j++) {
                let row = this.board.positions[j];
                str += "|";
                for (i = 0; i < 8; i++) {
                    const pid = row[i];
                    const shade = (i + j) % 2 == 1 ? "▒" : " ";
                    if (pid == null)
                        str += shade + shade + shade;
                    else {
                        let piece = this.board.pieces[pid]
                        str += shade + getPieceResource(piece.color, piece.type) + shade;
                    }
                }
                str += "|\n"
            }
            str += " ------------------------ ";
            return str;
        },

        print() {
            console.log(this.toString());
        },

        withPieceAt(basePiece, row, col) {
            return this.withPieces(movedPiece(basePiece, row, col));
        },
    
        pieceAt(row, col) {
            return this.board.pieces[this.positions[row][col]];
        },
    
        getPiece(basePiece) {
            return this.board.pieces[basePiece.id];
        },
    
        onTurn(turn) {
            this.board.turn = turn;
            return this;
        },

        equivalentTo(that) {
            const a = this.board;
            const b = that.board;

            if (a.turn != b.turn) {
                return false;
            }

            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    let aPieceId = a.positions[r][c];
                    let bPieceId = b.positions[r][c];
        
                    if (aPieceId != null && bPieceId != null && aPieceId === bPieceId) {
                        let aPiece = a.pieces[aPieceId];
                        let bPiece = b.pieces[bPieceId];
        
                        if (aPiece.pieceType !== bPiece.pieceType || aPiece.pieceColor !== bPiece.pieceColor) {
                            return false;
                        }
                    } else if (aPieceId == null && bPieceId == null) {
                        continue;
                    } else {
                        return false;
                    }
                }
            }
        
            return true;
        }
    };
}

function setupNewBoard() {
    return setupEmptyBoard()
        .withStartingPieces(...Object.values(BASE_PIECES));
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

function movedPiece(basePiece, row, col) {
    piece = newPieceFromBase(basePiece);
    piece.row = row;
    piece.col = col;
    piece.hasMoved = true;

    return piece;
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

function isLegalMove(board, piece, endRow, endCol) {
    let gameState = setupEmptyBoard().withBoard(board);
    return gameState.isLegalMove(piece, endRow, endCol);
}

module.exports = {
    setupEmptyBoard,
    setupNewBoard,
    getPieceResource,
    isLegalMove
};
