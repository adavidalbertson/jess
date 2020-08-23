const pieceTypes ={
    KING: 'K',
    QUEEN: 'q',
    BISHOP: 'b',
    KNIGHT: 'k',
    ROOK: 'r',
    PAWN: 'p'
};

const pieceColors = {
    BLACK: 1,
    WHITE: 0
};

const BLACK_BACK_ROW = 0;
const WHITE_BACK_ROW = 7;
const BLACK_PAWN_ROW = 1;
const WHITE_PAWN_ROW = 6;

const BASE_PIECES = {
    BLACK_ROOK_1: {id: 0, color: pieceColors.BLACK, type: pieceTypes.ROOK, startingRow: BLACK_BACK_ROW, startingCol: 0},
    WHITE_ROOK_1: {id: 1, color: pieceColors.WHITE, type: pieceTypes.ROOK, startingRow: WHITE_BACK_ROW, startingCol: 0},
    BLACK_KNIGHT_1: {id: 2, color: pieceColors.BLACK, type: pieceTypes.KNIGHT, startingRow: BLACK_BACK_ROW, startingCol: 1},
    WHITE_KNIGHT_1: {id: 3, color: pieceColors.WHITE, type: pieceTypes.KNIGHT, startingRow: WHITE_BACK_ROW, startingCol: 1},
    BLACK_BISHOP_1: {id: 4, color: pieceColors.BLACK, type: pieceTypes.BISHOP, startingRow: BLACK_BACK_ROW, startingCol: 2},
    WHITE_BISHOP_1: {id: 5, color: pieceColors.WHITE, type: pieceTypes.BISHOP, startingRow: WHITE_BACK_ROW, startingCol: 2},
    BLACK_QUEEN: {id: 6, color: pieceColors.BLACK, type: pieceTypes.QUEEN, startingRow: BLACK_BACK_ROW, startingCol: 3},
    WHITE_QUEEN: {id: 7, color: pieceColors.WHITE, type: pieceTypes.QUEEN, startingRow: WHITE_BACK_ROW, startingCol: 3},
    BLACK_KING: {id: 8, color: pieceColors.BLACK, type: pieceTypes.KING, startingRow: BLACK_BACK_ROW, startingCol: 4},
    WHITE_KING : {id: 9, color: pieceColors.WHITE, type: pieceTypes.KING, startingRow: WHITE_BACK_ROW, startingCol: 4},
    BLACK_BISHOP_2: {id: 10, color: pieceColors.BLACK, type: pieceTypes.BISHOP, startingRow: BLACK_BACK_ROW, startingCol: 5},
    WHITE_BISHOP_2: {id: 11, color: pieceColors.WHITE, type: pieceTypes.BISHOP, startingRow: WHITE_BACK_ROW, startingCol: 5},
    BLACK_KNIGHT_2: {id: 12, color: pieceColors.BLACK, type: pieceTypes.KNIGHT, startingRow: BLACK_BACK_ROW, startingCol: 6},
    WHITE_KNIGHT_2: {id: 13, color: pieceColors.WHITE, type: pieceTypes.KNIGHT, startingRow: WHITE_BACK_ROW, startingCol: 6},
    BLACK_ROOK_2: {id: 14, color: pieceColors.BLACK, type: pieceTypes.ROOK, startingRow: BLACK_BACK_ROW, startingCol: 7},
    WHITE_ROOK_2: {id: 15, color: pieceColors.WHITE, type: pieceTypes.ROOK, startingRow: WHITE_BACK_ROW, startingCol: 7},

    BLACK_PAWN_0: {id: 16, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 0},
    BLACK_PAWN_1: {id: 17, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 1},
    BLACK_PAWN_2: {id: 18, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 2},
    BLACK_PAWN_3: {id: 19, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 3},
    BLACK_PAWN_4: {id: 20, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 4},
    BLACK_PAWN_5: {id: 21, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 5},
    BLACK_PAWN_6: {id: 22, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 6},
    BLACK_PAWN_7: {id: 23, color: pieceColors.BLACK, type: pieceTypes.PAWN, startingRow: BLACK_PAWN_ROW, startingCol: 7},

    WHITE_PAWN_0: {id: 24, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 0},
    WHITE_PAWN_1: {id: 25, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 1},
    WHITE_PAWN_2: {id: 26, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 2},
    WHITE_PAWN_3: {id: 27, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 3},
    WHITE_PAWN_4: {id: 28, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 4},
    WHITE_PAWN_5: {id: 29, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 5},
    WHITE_PAWN_6: {id: 30, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 6},
    WHITE_PAWN_7: {id: 31, color: pieceColors.WHITE, type: pieceTypes.PAWN, startingRow: WHITE_PAWN_ROW, startingCol: 7},
};

const constants = Object.freeze({
    squareSize: 60,
    boardDim: 8,

    dragItemTypes: {
        PIECE: 'ITEM_TYPE_PIECE'
    },

    pieceTypes,
    pieceColors,
    BASE_PIECES
});

module.exports = constants;
