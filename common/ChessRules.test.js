const { setupEmptyBoard, setupNewBoard } = require("./ChessRules.js");
const { pieceColors, BASE_PIECES } = require("./Constants.js");

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
    return setupEmptyBoard().withStartingPieces(BLACK_KING, WHITE_KING);
}


test("Check", () => {
    let game = setupNewTestBoard()
        .withPieceAt(WHITE_ROOK_1, 4, 4);

    expect(game.isCheck(BLACK)).toBe(true);
});

test("Checkmate", () => {
    let game = setupNewTestBoard()
        .withPieceAt(BLACK_BISHOP_1, 2, 0)
        .withPieceAt(BLACK_QUEEN, 3, 7)
        .withPieceAt(BLACK_ROOK_1, 3, 4)
        .onTurn(BLACK);

    game.print();

    expect(game.isCheckMate(WHITE)).toBe(true);
});

test("Fool's Mate static", () => {
    let game = setupNewTestBoard()
        .withStartingPieces(WHITE_QUEEN, WHITE_BISHOP_2, WHITE_PAWN_3, WHITE_PAWN_4)
        .withPieceAt(BLACK_QUEEN, 4, 7)
        .onTurn(BLACK);

    game.print();

    expect(game.isCheckMate(WHITE)).toBe(true);
});

test("Fool's Mate", () => {
    let game = setupNewBoard();
    game = game.movePiece(WHITE_PAWN_5, 5, 5)
    game = game.movePiece(BLACK_PAWN_4, 2, 4)
    game = game.movePiece(WHITE_PAWN_6, 4, 6)
    game = game.movePiece(BLACK_QUEEN, 4, 7);

    expect(game.isCheckMate(WHITE)).toBe(true);
});

test("Legal castle kingside", () => {
    let before = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_2);

    let expected = setupNewTestBoard()
        .withPieceAt(WHITE_KING, 7, 6)
        .withPieceAt(WHITE_ROOK_2, 7, 5)
        .onTurn(BLACK);

    let after = before.movePiece(WHITE_KING, 7, 6);

    expect(expected.equivalentTo(after)).toBe(true);
});

test("Legal castle queenside", () => {
    let before = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_1);

    let expected = setupNewTestBoard()
        .withPieceAt(WHITE_KING, 7, 2)
        .withPieceAt(WHITE_ROOK_1, 7, 3)
        .onTurn(BLACK);

    let after = before.movePiece(WHITE_KING, 7, 2);

    expect(expected.equivalentTo(after)).toBe(true);
});

test("Can't castle if rook has moved", () => {
    let game = setupNewTestBoard()
        .withPieceAt(WHITE_ROOK_1, 7, 0);

    let legal = game.isLegalMove(game.getPiece(WHITE_KING), 7, 2);

    expect(legal.result).toBe(false);
    expect(legal.reason).toBe("Cannot castle with a rook that has moved");
});

test("Can't castle if king has moved", () => {
    let game = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_1)
        .withPieceAt(WHITE_KING, 7, 4);

    let legal = game.isLegalMove(game.getPiece(WHITE_KING), 7, 2);

    expect(legal.result).toBe(false);
    expect(legal.reason).toBe("Cannot castle if the king has moved");
});

test("Can't castle through pieces", () => {
    let game = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_1, WHITE_QUEEN);

    let legal = game.isLegalMove(game.getPiece(WHITE_KING), 7, 2);

    expect(legal.result).toBe(false);
    expect(legal.reason).toBe("Cannot castle if there are pieces between the king and the rook");
});

test("Can't castle through a square that is under attack", () => {
    let game = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_1, BLACK_QUEEN);

    let legal = game.isLegalMove(game.getPiece(WHITE_KING), 7, 2);

    expect(legal.result).toBe(false);
    expect(legal.reason).toBe("The king cannot castle through any squares that are under attack");
});

test("Can't castle when in check", () => {
    let game = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_1)
        .withPieceAt(BLACK_QUEEN, 1, 4);

    let legal = game.isLegalMove(game.getPiece(WHITE_KING), 7, 2);

    expect(legal.result).toBe(false);
    expect(legal.reason).toBe("Cannot castle while in check");
});

test("Can't castle into check", () => {
    let game = setupNewTestBoard()
        .withStartingPieces(WHITE_ROOK_1)
        .withPieceAt(BLACK_QUEEN, 1, 2);

    let legal = game.isLegalMove(game.getPiece(WHITE_KING), 7, 2);

    expect(legal.result).toBe(false);
    expect(legal.reason).toBe("Cannot move into check");
});