import React from "react";
import { connect } from "react-redux";
import { MakeSocketAction } from "react-redux-socket/client";

import Game from "./Game.js";
import Menu from "./Menu.js";
import Messages from "./Messages.js";
import { JOIN_GAME } from "../../../common/Actions.js";

class MainContainer extends React.Component {
    handleGameFromURL(location, dispatch) {
        const [_, gameID = ""] = location.pathname.split("/");
        if (!gameID) {
            return;
        }

        dispatch(
            MakeSocketAction({
                type: JOIN_GAME,
                payload: {
                    gameID: gameID
                }
            })
        );
    }

    componentWillMount() {
        this.handleGameFromURL(
            this.props.history.location,
            this.props.dispatch
        );
    }

    render() {
        const { gameID } = this.props;

        return gameID === undefined ? (
            <div id="MainContainer" className="menuContainer">
                <div style={{ flex: 1 }} />
                <Menu />
                <Messages />
            </div>
        ) : (
            <div id="MainContainer" className="gameContainer">
                <Game />
                <div className="menuContainer">
                    <Messages />
                    <Menu />
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    gameID: state.Socket.gameID
}))(MainContainer);
