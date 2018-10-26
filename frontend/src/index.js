import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import { ReactActionSocketMiddleware } from "react-redux-socket/client";
import createHistory from "history/createBrowserHistory";

import MainContainer from "./components/MainContainer.js";
import GameState from "./reducers/GameState.js";
import Socket from "./reducers/Socket.js";
import Message from "./reducers/Message.js";
import myRouterMiddleware from "./middleware/myRouterMiddleware.js";
import "./styles/styles.less";

const history = createHistory();

const reducer = combineReducers({
    GameState,
    Socket,
    Message
});

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            myRouterMiddleware(history),
            ReactActionSocketMiddleware("ws://localhost:4040/app1")
        ),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

class App extends React.Component {
    render() {
        return (
            <Provider store={this.props.store}>
                <MainContainer history={history} />
            </Provider>
        );
    }
}

render(<App store={store} />, document.getElementById("app"));
