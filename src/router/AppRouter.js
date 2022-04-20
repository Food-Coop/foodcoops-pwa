import React from "react";
import {useKeycloak} from '@react-keycloak/web';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {AuthButton} from "../auth/AuthButton";
import {About} from "../About";
import {Lager} from "../lager/Lager";
import {Bestellung} from "../bestellung/Bestellung";
import {Gebindemanagement} from "../gebindemanagement/Gebindemanagement";
import {PrivateRoute} from "../auth/PrivateRoute";
import {Home} from "../Home";

export const AppRouter = () => {
    const {initialized} = useKeycloak();
    return (
        <Router>
            <nav className="Header">
                <img className="Header-logo" src="manifest-icon-512.png" alt="logo"/>
                <Link style={{paddingRight: "1em"}} to="/">
                    Food Coops
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/bestellung"}>
                    Bestellen
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/lager"}>
                    Lagermanagement
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/gebindemanagement"}>
                    Gebindemanagement
                </Link>
                <AuthButton/>
            </nav>
            <Switch>
                <Route exact path="/login" component={AuthButton}/>
                <Route exact path="/about" component={About}/>
                <PrivateRoute roles={["Einkäufer"]} path="/lager" component={Lager}/>
                <PrivateRoute roles={["Einkäufer"]} path="/gebindemanagement" component={Gebindemanagement}/>
                <PrivateRoute roles={["Mitglied"]} path="/bestellung" component={Bestellung}/>
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
