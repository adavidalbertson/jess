import React from "react";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { SUCCESS, FAIL } from "../reducers/Message.js";

class Messages extends React.Component {
    componentWillMount() {
        this.setState({
            messages: [],
            timeouts: []
        });
    }

    componentWillReceiveProps(props) {
        const { message } = props;
        let newState = Object.assign({}, this.state);
        let messageTimeout = window.setTimeout(
            this.messageFallOff.bind(this),
            10000
        );

        newState.messages.unshift(message);
        newState.timeouts.unshift(messageTimeout);

        while (newState.messages.length > 5) {
            newState.messages.pop();
            newState.timeouts.pop();
        }

        this.setState(newState);
    }

    messageFallOff() {
        let newState = Object.assign({}, this.state);

        newState.messages.pop();
        newState.timeouts.pop();

        this.setState(newState);
    }

    componentWillUnmount() {
        this.state.timeouts.forEach(t => {
            window.clearTimeout(t);
        });
    }

    render() {
        const messages = this.state.messages.map(m => {
            let classes = "message";

            if (m.type === SUCCESS) {
                classes += " successMessage";
            } else if (m.type === FAIL) {
                classes += " failMessage";
            }

            return (
                <CSSTransition key={m.ID} timeout={500} classNames="fade">
                    <span className={classes}>{m.message}</span>
                </CSSTransition>
            );
        });

        return <TransitionGroup id="messages">{messages}</TransitionGroup>;
    }
}

export default connect(state => ({
    message: state.Message
}))(Messages);
