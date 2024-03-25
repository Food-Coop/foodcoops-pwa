import React from "react";
import "./App.css";
import './Header.css';
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {keycloak} from "./auth/Keycloak"
import {AppRouter} from "./router/AppRouter";
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';

const theme = createMuiTheme();

const useStyles = makeStyles((theme) => {
  root: {
    // some CSS that accesses the theme
  }
});

export default function App() {
    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <ReactKeycloakProvider authClient={keycloak}>
                <div className="App">
                    <AppRouter/>
                </div>
            </ReactKeycloakProvider>
        </ThemeProvider>
    );
}

