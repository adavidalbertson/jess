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

const backendURL =
    process.env.NODE_ENV === "development" ? "ws://localhost:4040/app1" : "/app1";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(
            myRouterMiddleware(history),
            ReactActionSocketMiddleware(backendURL)
        )
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
