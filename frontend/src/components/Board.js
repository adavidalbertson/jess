import React from 'react';
// import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Square from './Square.js';

import { squareSize, boardDim } from '../../../common/Constants';

class Board extends React.Component {
    render() {
        const { pieces, positions, movePiece } = this.props;
        let squares = [];
        let piece;
        for (let row = 0; row < boardDim; row++) {
            for (let col = 0; col < boardDim; col++) {
                piece = pieces[positions[row][col]];
                squares.push((
                    <Square
                        key={[row, col]}
                        row={row}
                        col={col}
                        piece={piece}
                        // turn={turn}
                        movePiece={movePiece}
                    />
                ))
            }
        }

        return (
            <div style={{
                    width: (boardDim * squareSize) + 'px',
                    height: (boardDim * squareSize) + 'px',
                    backgroundColor: 'red',
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                {squares}
            </div>
        )
    }
}

// export default connect(state => ({
//         pieces: state.GameState.pieces,
//         positions: state.GameState.positions,
//         // captured: state.GameState.captured
// }))(DragDropContext(HTML5Backend)(Board));

export default DragDropContext(HTML5Backend)(Board);
