import React from 'react';
// import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Square from './Square.js';

import { squareSize, boardDim } from '../../../common/Constants';

class Board extends React.Component {
    render() {
        const { pieces, positions, movePiece, playerColor } = this.props;
        let squares = [];
        let piece;
        for (let displayRow = 0; displayRow < boardDim; displayRow++) {
            for (let displayCol = 0; displayCol < boardDim; displayCol++) {
                let row = playerColor === 0 ? displayRow : boardDim - displayRow - 1;
                let col = playerColor === 0 ? displayCol : boardDim - displayCol - 1;

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
                ));
            }
        }

        return (
            <div id="board">
                {squares}
            </div>
        )
    }
}

export default DragDropContext(HTML5Backend)(Board);
