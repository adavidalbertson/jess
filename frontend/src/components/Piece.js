import React from 'react';

import { getPieceResource } from '../../../common/Utils.js';

export default class BoardPiece extends React.Component {
    render() {
        const { piece } = this.props;


        let pieceResource = getPieceResource(piece.color, piece.type);

        return (
            <div style={{
                font: '60px Arial',
                color: 'black',
                textAlign: 'center'
            }}>
                {pieceResource}
            </div>
        );
    }
}
