import React from 'react';
import { connect } from 'react-redux';

import Board from './Board.js';
import Captured from './Captured.js';

import { pendingMove, moveApproved } from '../reducers/GameState.js';

import { submitMove } from '../reducers/Socket.js';

import { setupNewBoard, getNextState, isLegalMove } from '../../../common/Utils.js'

class Game extends React.Component {
    componentWillMount() {
        this.setState(this.props.gameState);
    }

    componentWillReceiveProps(props) {
        this.setState(props.gameState);
    }

    handleMovePiece(piece, endRow, endCol) {
        if (!isLegalMove(piece, endRow, endCol, this.state.positions, this.state.pieces, this.state.enPassant)) {
            return;
        }

        this.props.dispatch(pendingMove());
        this.props.dispatch(submitMove({ piece, endRow, endCol }));
        const nextState = getNextState(piece, endRow, endCol, this.state);
        this.setState(nextState);
    }

    render() {
        return (
            <div>
                <Captured
                    color={0}
                    captured={this.state.captured}
                    pieces={this.state.pieces}
                />
                <Board
                    pieces={this.state.pieces}
                    positions={this.state.positions}
                    // turn={this.state.turn}
                    movePiece={this.handleMovePiece.bind(this)}
                />
                <Captured
                    color={1}
                    captured={this.state.captured}
                    pieces={this.state.pieces}
                />
            </div>
        )
    }
}

export default connect(state => ({
    gameState: state.GameState
}))(Game);