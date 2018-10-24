import React from "react";
import { connect } from "react-redux";
import { MakeSocketAction } from "react-redux-socket/client";

import { newGame, sendMessage } from "../reducers/Socket.js";

class Menu extends React.Component {
    handleNewGame() {
        this.props.dispatch(newGame());
    }

    render() {
        return (
            <div id="menu">
                <button
                    ref="btn"
                    className="menuButton"
                    onClick={this.handleNewGame.bind(this)}
                >
                    New Game
                </button>
            </div>
        );
    }
}

export default connect(state => ({
    gameID: state.Socket.gameID
}))(Menu);
