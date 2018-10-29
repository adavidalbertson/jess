import React from "react";

export default class Modal extends React.Component {
    copyToClipboard() {
        let urlBox = document.getElementById("urlBox");
        urlBox.select();
        document.execCommand("copy");

        if (this.props.onCopy && typeof this.props.onCopy  === "function") {
            this.props.onCopy();
        }
    }

    render() {
        return (
            <div id="copyUrlContainer">
                <input
                    id="urlBox"
                    className="copyInput"
                    readOnly
                    value={ window.location.href }
                />
                <button
                    className="copyButton"
                    onClick={ this.copyToClipboard.bind(this) }
                    title="Copy link to clipboard"
                >
                    📋
                </button>
            </div>
        );
    }
}
