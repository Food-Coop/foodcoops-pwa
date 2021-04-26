import React from "react";
import {useKeycloak} from '@react-keycloak/web';
import logo from "../logo.svg";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {AuthButton} from "../auth/AuthButton";
import {About} from "../About";
import {Lager} from "../lager/Lager";
import {PrivateRoute} from "../auth/PrivateRoute";
import {Home} from "../Home";

export const AppRouter = () => {
    const {initialized} = useKeycloak();
    return (
        <Router>
            <nav className="Header">
                <img className="Header-logo" src={logo} alt="logo"/>
                <Link to="/">
                    Food Coops
                </Link>
                <Link to={"/lager"}>
                    Lager management
                </Link>
                <AuthButton/>
            </nav>
            <Switch>
                <Route exact path="/login" component={AuthButton}/>
                <Route exact path="/about" component={About}/>
                <PrivateRoute roles={["Einkäufer"]} path="/lager" component={Lager}/>
                <Route path="/" component={Home}/>
            </Switch>
            <footer>
                <Link to="/about">
                    Impressum - Legal Disclaimer
                </Link>
                &nbsp; - &nbsp;
                <a href="https://icons8.com/">
                    Icons provided by icons8
                </a>
            </footer>
        </Router>
    )
}
