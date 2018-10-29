import React from "react";
import { connect } from "react-redux";

import Modal from "./Modal.js";
import CopyLink from "./CopyLink.js";
import { newGame } from "../reducers/Socket.js";

class Menu extends React.Component {
    componentWillMount() {
        this.setState({
            showInviteModal: false
        });
    }

    toggleInviteModal() {
        let newState = Object.assign({}, this.state);

        newState.showInviteModal = !newState.showInviteModal;

        this.setState(newState);
    }

    handleNewGame() {
        this.props.dispatch(newGame());
    }

    render() {
        const { gameID, opponentConnected } = this.props;
        const { showInviteModal } = this.state;

        const inviteModal = (
            <Modal closeModal={ () => this.toggleInviteModal.bind(this) }>
                <CopyLink onCopy={ () => this.toggleInviteModal() }/>
            </Modal>
        );

        const inviteButton = (
            <button
                className="menuButton"
                onClick={ this.toggleInviteModal.bind(this) }
            >
                Invite a Friend
            </button>
        );

        return (
            <div id="menu">
                <button
                    className="menuButton"
                    disabled={ this.props.opponentConnected }
                    onClick={ this.handleNewGame.bind(this) }
                >
                    New Game
                </button>
                { gameID !== undefined && inviteButton }
                { showInviteModal && inviteModal }
            </div>
        );
    }
}

export default connect(state => ({
    gameID: state.Socket.gameID,
    opponentConnected: state.Socket.opponentConnected
}))(Menu);
