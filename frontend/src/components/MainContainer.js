import React from 'react';
import { connect } from 'react-redux';
import { MakeSocketAction } from 'react-redux-socket/client';

import Game from './Game.js';
import Menu from './Menu.js';
import { JOIN_GAME } from '../../../common/Actions.js';

class MainContainer extends React.Component {
    handleGameFromURL(location, dispatch) {
        const [_, gameID = ""] = location.pathname.split('/');
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
        this.handleGameFromURL(this.props.history.location, this.props.dispatch);
    }

    render() {
        const { gameID, history } = this.props;

        return (
            gameID === undefined ?
                <Menu/> :
                <Game/>
        )
    }
}

export default connect(state => ({
    gameID: state.Socket.gameID
}))(MainContainer);
