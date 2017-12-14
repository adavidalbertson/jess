import React from 'react';

import { squareSize, boardDim } from '../../../common/Constants';

class Board extends React.Component {
    componentDidMount() {
        const ctx = this.refs.canvas.getContext('2d');
        let drawOrder = 0;
        for (let col = 0; col < boardDim; col++) {
            let colName = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][col];
            for (let row = 0; row < boardDim; row++) {
                if ((col + row) % 2 == 1) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
                }
                ctx.font = '10px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = 'gray';
                ctx.fillText(colName + (boardDim - row), col * squareSize, (row + 1) * squareSize);
            }
        }
    }
    render() {
        return (
            <canvas
                ref="canvas"
                width={boardDim * squareSize}
                height={boardDim * squareSize}
                style={{position: 'absolute'}}
                />
        );
    }
}

export default Board;
