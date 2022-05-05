import React from "react";
import {useKeycloak} from '@react-keycloak/web';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {AuthButton} from "../auth/AuthButton";
import {About} from "../About";
import {Lager} from "../lager/Lager";
import {Bestellung} from "../bestellung/Bestellung";
import { Brot } from "../brot/Brot";
import { Deadline } from "../deadline/Deadline";
import {Gebindemanagement} from "../gebindemanagement/Gebindemanagement";
import {PrivateRoute} from "../auth/PrivateRoute";
import {Home} from "../Home";
import {FrischBestandManagement} from "../frischbestandmanagement/FrischBestandManagement";

export const AppRouter = () => {
    const {initialized} = useKeycloak();
    return (
        <Router>
            <nav className="Header">
                <img className="Header-logo" src="manifest-icon-512.png" alt="logo"/>
                <Link style={{paddingRight: "1em"}} to={"/bestellung"}>
                    Frischbestellung
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/brot"}>
                    Brotbestellung
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/deadline"}>
                    Deadline
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/gebindemanagement"}>
                    Gebindemanagement
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/lager"}>
                    Lagermanagement
                </Link>
                <Link style={{paddingRight: "1em"}} to={"/frischbestandmanagement"}>
                    Frischbestandmanagement
                </Link>
                <AuthButton/>
            </nav>
            <Switch>
                <Route exact path="/login" component={AuthButton}/>
                <Route exact path="/about" component={About}/>
                <PrivateRoute roles={["Einkäufer"]} path="/lager" component={Lager}/>
                <PrivateRoute roles={["Einkäufer"]} path="/gebindemanagement" component={Gebindemanagement}/>
                <PrivateRoute roles={["Einkäufer"]} path="/frischbestandmanagement" component={FrischBestandManagement}/>
                <PrivateRoute roles={["Einkäufer"]} path="/deadline" component={Deadline}/>
                <PrivateRoute roles={["Mitglied"]} path="/bestellung" component={Bestellung}/>
                <PrivateRoute roles={["Mitglied"]} path="/brot" component={Brot}/>
                <Route path="/" component={Home}/>
            </Switch>
            <footer>
                <Link to="/about">
                    Impressum - Legal Disclaimer
                </Link>

            </footer>
        </Router>
    )
}
