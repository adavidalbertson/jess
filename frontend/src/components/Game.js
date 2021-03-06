import React from "react";
import { connect } from "react-redux";

import Board from "./Board.js";
import Captured from "./Captured.js";

import { pendingMove, moveApproved } from "../reducers/GameState.js";

import { submitMove } from "../reducers/Socket.js";

import {
    isLegalMove
} from "../../../common/ChessRules.js";

class Game extends React.Component {
    componentWillMount() {
        this.setState(this.props.gameState);
    }

    componentWillReceiveProps(props) {
        this.setState(props.gameState);
    }

    handleMovePiece(piece, endRow, endCol) {
        if (!isLegalMove(this.state, piece, endRow, endCol)) {
            return;
        }

        this.props.dispatch(pendingMove());
        this.props.dispatch(submitMove({ piece, endRow, endCol }));
    }

    render() {
        return (
            <div id="game">
                <Captured
                    color={0}
                    captured={this.state.captured}
                    pieces={this.state.pieces}
                />
                <Board
                    pieces={this.state.pieces}
                    positions={this.state.positions}
                    playerColor={this.props.gameState.playerColor}
                    movePiece={this.handleMovePiece.bind(this)}
                />
                <Captured
                    color={1}
                    captured={this.state.captured}
                    pieces={this.state.pieces}
                />
            </div>
        );
    }
}

export default connect(state => ({
    gameState: state.GameState
}))(Game);
