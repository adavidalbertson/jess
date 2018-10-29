import React from "react";
import { connect } from "react-redux";

import Messages from "./Messages.js";
import { newGame } from "../reducers/Socket.js";

class Splash extends React.Component {
    handleNewGame() {
        this.props.dispatch(newGame());
    }

    render() {
        return (
            <div id="splash" className="menuContainer">
                <div style={{ flex: 1 }} />
                <div id="menu">
                    <button
                        className="menuButton"
                        disabled={false && this.props.opponentConnected}
                        onClick={this.handleNewGame.bind(this)}
                    >
                        New Game
                    </button>
                </div>
                <Messages />
            </div>
        );
    }
}

export default connect()(Splash);