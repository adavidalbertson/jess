const constants = Object.freeze({
    squareSize: 60,
    boardDim: 8,

    dragItemTypes: {
        PIECE: 'ITEM_TYPE_PIECE'
    },

    pieceTypes: {
        KING: 'K',
        QUEEN: 'q',
        BISHOP: 'b',
        KNIGHT: 'k',
        ROOK: 'r',
        PAWN: 'p'
    }
});

module.exports = constants;
