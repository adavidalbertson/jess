const { newPiece, newPieceFromBase, isLegalMove, getNextState, isCheck, isCheckMate, isUnderAttack, printBoard } = require("./ChessRules.js");
const { pieceTypes, pieceColors, BASE_PIECES } = require("./Constants.js");

const { KING, QUEEN, BISHOP, KNIGHT, ROOK, PAWN } = pieceTypes;
const { BLACK, WHITE } = pieceColors;

const {
    BLACK_ROOK_1,
    WHITE_ROOK_1,
    BLACK_KNIGHT_1,
    WHITE_KNIGHT_1,
    BLACK_BISHOP_1,
    WHITE_BISHOP_1,
    BLACK_QUEEN,
    WHITE_QUEEN,
    BLACK_KING,
    WHITE_KING,
    BLACK_BISHOP_2,
    WHITE_BISHOP_2,
    BLACK_KNIGHT_2,
    WHITE_KNIGHT_2,
    BLACK_ROOK_2,
    WHITE_ROOK_2,

    BLACK_PAWN_0,
    BLACK_PAWN_1,
    BLACK_PAWN_2,
    BLACK_PAWN_3,
    BLACK_PAWN_4,
    BLACK_PAWN_5,
    BLACK_PAWN_6,
    BLACK_PAWN_7,

    WHITE_PAWN_0,
    WHITE_PAWN_1,
    WHITE_PAWN_2,
    WHITE_PAWN_3,
    WHITE_PAWN_4,
    WHITE_PAWN_5,
    WHITE_PAWN_6,
    WHITE_PAWN_7
} = BASE_PIECES;

function setupNewTestBoard() {
    let pieces = [];
    let positions = [[], [], [], [], [], [], [], []];
    let captured = [];

    let board = {
        gameState: {
            pieces,
            positions,
            captured,
            turn: WHITE,
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
        },
        withPieceAt(basePiece, row, col) {
            return this.withPieces(movedPiece(basePiece, row, col));
        },
        pieceAt: function(row, col) {
            return this.gameState.pieces[this.positions[row][col]];
        },
        getPiece: function(basePiece) {
            return this.gameState.pieces[basePiece.id];
        },
        movePiece: function(basePiece, row, col) {
            let piece = this.gameState.pieces[basePiece.id];
            let legal;
            legal = isLegalMove(piece, row, col, this.gameState);
            if (!legal.result) {
                printBoard(this.gameState);
                throw new Error("Illegal move! " + legal.reason);
            }

            let newState = setupNewTestBoard();
            newState.gameState = getNextState(piece, row, col, this.gameState);

            return newState;
        },
        onTurn: function(turn) {
            this.gameState.turn = turn;
            return this;
        }
    };

    return board.withStartingPieces(BLACK_KING, WHITE_KING);
}

function setupFullTestBoard() {
    return setupNewTestBoard()
        .withStartingPieces(...Object.values(BASE_PIECES));
}

function equivalent(a, b) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let aPieceId = a.gameState.positions[r][c];
            let bPieceId = b.gameState.positions[r][c];

            if (aPieceId != null && bPieceId != null) {
                let aPiece = a.gameState.pieces[aPieceId];
                let bPiece = b.gameState.pieces[bPieceId];

                return aPiece.pieceType === bPiece.pieceType
                    && aPiece.pieceColor === bPiece.pieceColor;
            } else if (aPieceId == null && bPieceId == null) {
                continue;
            } else {
                return false;
            }
        }
    }

    return true;
}

function movedPiece(basePiece, row, col) {
    piece = newPieceFromBase(basePiece);
    piece.row = row;
    piece.col = col;
    piece.hasMoved = true;

    return piece;
}

test("Check", () => {
    let game = setupNewTestBoard()
        .withPieceAt(WHITE_ROOK_1, 4, 4);

    expect(isCheck(game.gameState, BLACK)).toBe(true);
});

test("Checkmate", () => {
    let game = setupNewTestBoard()
        .withPieceAt(BLACK_BISHOP_1, 2, 0)
        .withPieceAt(BLACK_QUEEN, 3, 7)
        .withPieceAt(BLACK_ROOK_1, 3, 4)
        .onTurn(BLACK);

    expect(isCheckMate(game.gameState, WHITE)).toBe(true);
});

test("Fool's Mate static", () => {
    let game = setupNewTestBoard()
        .withStartingPieces(WHITE_QUEEN, WHITE_BISHOP_2, WHITE_PAWN_3, WHITE_PAWN_4)
        .withPieceAt(BLACK_QUEEN, 4, 7)
        .onTurn(BLACK);

    printBoard(game.gameState);

    expect(isCheckMate(game.gameState, WHITE)).toBe(true);
});

test("Fool's Mate", () => {
    let game = setupFullTestBoard();
    game = game.movePiece(WHITE_PAWN_5, 5, 5)
    game = game.movePiece(BLACK_PAWN_4, 2, 4)
    game = game.movePiece(WHITE_PAWN_6, 4, 6)
    game = game.movePiece(BLACK_QUEEN, 4, 7);

    expect(isCheckMate(game.gameState, WHITE)).toBe(true);
});

test("legal castle kingside", () => {
    let before = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_2);

    let expected = setupNewTestBoard()
        .withPieceAt(WHITE_KING, 7, 6)
        .withPieceAt(WHITE_ROOK_2, 7, 5);

    let after = before.movePiece(WHITE_KING, 7, 6);

    expect(equivalent(expected, after)).toBe(true);
});