import React from "react";
import "./App.css";
import logo from './logo.svg';
import './Header.css';
import {About} from "./About";
import {Home} from "./Home";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {ProvideAuth} from "./auth/ProvideAuth";
import {AuthButton} from "./auth/AuthButton";

export default function App() {
    return (
        <ProvideAuth>
            <Router>
                <div className="App">
                    <nav className="Header">
                        <img className="Header-logo" src={logo} alt="logo"/>
                        <Link to="/">
                            Food Coops
                        </Link>
                        <AuthButton/>
                    </nav>
                    <Switch>
                        <Route path="/about">
                            <About/>
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                    <footer>
                        <Link to="/about">
                            Impressum - Legal Disclaimer
                        </Link>
                    </footer>
                </div>
            </Router>
        </ProvideAuth>
    );
}