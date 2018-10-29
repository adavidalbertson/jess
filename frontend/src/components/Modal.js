import React from "react";
import { connect } from "react-redux";

export default class Modal extends React.Component {
    render() {
        return (
            <div className="modalBackground">
                <div className="modal">
                    <a
                        className="closeModalButton"
                        onClick={this.props.closeModal()}
                    >
                        ×
                    </a>
                    <div className="modalContent">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
