import React from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';

import Piece from './Piece.js';

import { movePiece } from '../reducers/GameState.js';

import { dragItemTypes } from '../../../common/Constants.js';
import { isLegalMove } from '../../../common/Utils.js';

const moveSource = {
    canDrag(props) {
        const { piece, turn, pendingMove, playerColor } = props;
        return piece.color === turn && piece.color === playerColor && !pendingMove;
    },

    beginDrag(props) {
        const { piece } = props;
        return {
            piece
        };
    },

    endDrag(props, monitor) {
        if (monitor.didDrop()) {
            const { piece, movePiece } = props;
            const { endRow, endCol } = monitor.getDropResult();
            movePiece(piece, endRow, endCol);
        }
    }
};

function collect(dragSourceConnect, monitor) {
    return {
        connectDragSource: dragSourceConnect.dragSource(),
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag()
    }
}

class BoardPiece extends React.Component {
    render() {
        const { piece, connectDragSource, isDragging, canDrag } = this.props;

        return connectDragSource(
            <div style={{
                cursor: canDrag ? 'move' : 'default',
                opacity: isDragging ? 0.5 : 1
            }}
            >
                <Piece piece={piece} />
            </div>
        );
    }
}

export default connect(state => ({
    pendingMove: state.GameState.pendingMove,
    playerColor: state.GameState.playerColor,
    turn: state.GameState.turn
}))(DragSource(dragItemTypes.PIECE, moveSource, collect)(BoardPiece));

// export default DragSource(dragItemTypes.PIECE, moveSource, collect)(BoardPiece);
