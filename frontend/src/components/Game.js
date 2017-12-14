import React from 'react';
import { connect } from 'react-redux';

import Board from './Board.js';
import Captured from './Captured.js';

import { pendingMove, moveApproved } from '../reducers/GameState.js';

import { setupNewBoard, getNextState } from '../../../common/Utils.js'

class Game extends React.Component {
    componentWillMount() {
        const newBoard = setupNewBoard();
        this.state = {
            pieces: newBoard.pieces,
            positions: newBoard.positions,
            captured: []
        };
    }

    componentWillReceiveProps(props) {
        this.setState(this.props.gameState);
    }

    handleMovePiece(piece, endRow, endCol) {
        const { nextState } = getNextState(piece, endRow, endCol, this.state);
        console.log(nextState);
        this.setState(nextState);
        this.props.dispatch(pendingMove());
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
    gameState: state.gameState
}))(Game);
