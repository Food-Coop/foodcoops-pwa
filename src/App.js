import React from "react";
import "./App.css";
import './Header.css';
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {keycloak} from "./auth/Keycloak"
import {AppRouter} from "./router/AppRouter";

export default function App() {
    return (
        <ReactKeycloakProvider authClient={keycloak}>
            <div className="App">
                <AppRouter/>
            </div>
        </ReactKeycloakProvider>
    );
}

