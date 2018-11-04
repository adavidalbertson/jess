import React from "react";
import { connect } from "react-redux";

import Modal from "./Modal.js";
import CopyLink from "./CopyLink.js";
import { restartGame } from "../reducers/Socket.js";

class Menu extends React.Component {
    componentWillMount() {
        this.setState({
            showInviteModal: false,
            showChooseColorModal: false
        });
    }

    toggleInviteModal() {
        let newState = Object.assign({}, this.state);

        newState.showInviteModal = !newState.showInviteModal;

        this.setState(newState);
    }

    toggleChooseColorModal() {
        let newState = Object.assign({}, this.state);

        newState.showChooseColorModal = !newState.showChooseColorModal;

        this.setState(newState);
    }

    handleNewGame(color) {
        this.toggleChooseColorModal();
        this.props.dispatch(restartGame(color));
    }

    render() {
        const { gameID, opponentConnected, gameOver, won } = this.props;
        const { showInviteModal, showChooseColorModal } = this.state;

        const inviteModal = (
            <Modal closeModal={ () => this.toggleInviteModal.bind(this) }>
                <CopyLink onCopy={ () => this.toggleInviteModal() }/>
            </Modal>
        );

        const chooseColorModal = (
            <Modal closeModal={ () => this.toggleChooseColorModal.bind(this) }>
                <p>Choose which color to play as:</p>
                <button className="menuButton"
                    onClick={ this.handleNewGame.bind(this, 1) }>
                    White
                </button>
                <button className="menuButton"
                    onClick={ this.handleNewGame.bind(this, 0) }>
                    Black
                </button>
            </Modal>
        );

        return (
            <div id="menu">
                <button
                    className="menuButton"
                    disabled={ opponentConnected && (!gameOver || !won) }
                    onClick={ this.toggleChooseColorModal.bind(this) }
                >
                    New Game
                </button>
                <button
                className="menuButton"
                disabled={ opponentConnected }
                onClick={ this.toggleInviteModal.bind(this) }
            >
                Invite a Friend
            </button>
                { showInviteModal && inviteModal }
                { showChooseColorModal && chooseColorModal }
            </div>
        );
    }
}

export default connect(state => ({
    gameID: state.Socket.gameID,
    opponentConnected: state.Socket.opponentConnected,
    gameOver: state.GameState.gameOver,
    won: state.GameState.won
}))(Menu);
