import React from 'react';

import { getPieceResource } from '../../../common/ChessRules.js';

export default class BoardPiece extends React.Component {
    render() {
        const { piece } = this.props;


        let pieceResource = getPieceResource(piece.color, piece.type);

        return (
            <div className='piece'>
                {pieceResource}
            </div>
        );
    }
}
