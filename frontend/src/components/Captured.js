import React from 'react';
import { connect } from 'react-redux';

import Piece from './Piece.js';

import { boardDim, squareSize } from '../../../common/Constants';

export default class Captured extends React.Component {
    render() {
        const { pieces, captured } = this.props;

        let capturedPieces = [];
        captured.forEach(c => {
            const p = pieces[c];
            if (p.color === this.props.color) {
                capturedPieces.push(pieces[c]);
            }
        });

        return <div class="captured" style={{
            width: boardDim * squareSize,
            minHeight: squareSize + 5,
            display: 'flex',
            flexWrap: 'wrap'
        }}>
            { capturedPieces.map(p => (
                <Piece key={p.id} piece={p}/>
            )) }
        </div>
    }
}

// export default connect(state => ({
//         pieces: state.GameState.pieces,
//         positions: state.GameState.positions,
//         captured: state.GameState.captured
// }))(Captured);
