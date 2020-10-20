require("./bootstrap");

import { render } from "react-dom";
import React, { useContext, useReducer } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import LayoutContent from "./components/layout/layoutContent";
import "antd/dist/antd.css";
import "./style/custom.css";
import StateProvider from "./Provider";
import Login from "./components/pages/public/login";

const App = () => {
    let isLogged = localStorage.getItem("token");
    if (window.location.href.indexOf("http:") !== -1) {
        if (
            window.location.href.indexOf(".test") === -1 &&
            window.location.href.indexOf(":8000") === -1
        ) {
            window.location.href = window.location.href.replace(
                "http",
                "https"
            );
        }
    }
    return (
        <StateProvider>
            <Router>
                <Switch>
                    <Route
                        path="/"
                        name="Home"
                        component={isLogged ? LayoutContent : Login}
                    />
                    <Route
                        exact
                        path="/login"
                        name="Login Page"
                        render={props => <Login {...props} />}
                    />
                </Switch>
            </Router>
        </StateProvider>
    );
};

export default App;

render(<App />, document.getElementById("app"));
