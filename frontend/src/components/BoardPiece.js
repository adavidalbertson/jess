import React from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';

import Piece from './Piece.js';

import { movePiece } from '../reducers/GameState.js';

import { dragItemTypes } from '../../../common/Constants.js';
import { isLegalMove } from '../../../common/Utils.js';

const moveSource = {
    canDrag(props) {
        const { piece, turn, pendingMove } = props;
        return piece.color === turn && !pendingMove;
    },

    beginDrag(props) {
        const { piece } = props;
        // console.log('piced up!');
        return {
            piece
        };
    },

    endDrag(props, monitor) {
        if (monitor.didDrop()) {
            // const { piece, pieces, positions, enPassant } = props;
            const { piece, movePiece } = props;
            // console.log('droped!', props.piece)
            // console.log(monitor.getDropResult());
            const { endRow, endCol } = monitor.getDropResult();
            // if (isLegalMove(piece, endRow, endCol, positions, pieces, enPassant))
                // props.dispatch(movePiece(props.piece.id, endRow, endCol));
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
                opacity: isDragging ? 0.5 : 1}}
            >
                <Piece piece={piece}/>
            </div>
        );
    }
}

export default connect(state => ({
    pendingMove: state.GameState.pendingMove,
    turn: state.GameState.turn
}))(DragSource(dragItemTypes.PIECE, moveSource, collect)(BoardPiece));

// export default DragSource(dragItemTypes.PIECE, moveSource, collect)(BoardPiece);
