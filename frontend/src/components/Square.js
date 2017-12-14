import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';

import BoardPiece from './BoardPiece.js';

import { squareSize, dragItemTypes } from '../../../common/Constants';

const squareTarget = {
    drop(props) {
        const { row, col } = props;

        return {
            endRow: row,
            endCol: col
        };
    }
};

function collect(dragSourceConnect, monitor) {
    return {
        connectDropTarget: dragSourceConnect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class Square extends React.Component {
    render() {
        const { row, col, piece, connectDropTarget, isOver, movePiece } = this.props;
        const fill = (row + col) % 2 == 1 ? 'gray' : 'white';

        return connectDropTarget(
            <div style={{
                width: squareSize + 'px',
                height: squareSize + 'px',
                backgroundColor: fill
            }}>
            {piece !== undefined && !piece.captured
                && <BoardPiece
                        piece={piece}
                        row={row}
                        col={col}
                        // turn={turn}
                        movePiece={movePiece}
                    />
            }
            </div>
        )

    }
}

export default DropTarget(dragItemTypes.PIECE, squareTarget, collect)(Square)
