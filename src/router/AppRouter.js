import React from "react";
import {useKeycloak} from '@react-keycloak/web';
import logo from "../logo.svg";
import {Link, Route, Switch} from "react-router-dom";
import {AuthButton} from "../auth/AuthButton";
import {About} from "../About";
import {PrivateRoute} from "../auth/PrivateRoute";
import {Stock} from "../Stock";
import {Home} from "../Home";

export const AppRouter = () => {
    const [, initialized] = useKeycloak();
    if (!initialized) {
        return <h3>Loading ... !!!</h3>;
    }
    return (<>
        <nav className="Header">
            <img className="Header-logo" src={logo} alt="logo"/>
            <Link to="/">
                Food Coops
            </Link>
            <Link to={"/stock"}>
                Stock management
            </Link>
            <AuthButton/>
        </nav>
        <Switch>
            <Route exact path="/login" component={AuthButton}/>
            <Route exact path="/about" component={About}/>
            <PrivateRoute roles={["Einkäufer"]} path="/stock" component={Stock}/>
            <Route path="/" component={Home}/>
        </Switch>
        <footer>
            <Link to="/about">
                Impressum - Legal Disclaimer
            </Link>
        </footer>
    </>)

}