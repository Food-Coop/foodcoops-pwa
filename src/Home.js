import "./App.css";
import { AuthButton } from "./auth/AuthButton";
import { useKeycloak } from "@react-keycloak/web";
import { Typography } from "@mui/material";

export function Home() {
    const { keycloak } = useKeycloak();

    return (
        <main className="App-header">
            {!keycloak.authenticated && (
                <>
                    <Typography variant="h6" sx={{ color: "white", textAlign: "center", padding: 1, margin: 2}}>
                        Bitte melden Sie sich an, um die Anwendung zu nutzen.
                    </Typography>
                    <AuthButton width='400px' height='200px' backgroundColor="white" color="#333" />
                    </>
            )}
            {keycloak.authenticated && (
                <>
                    <img src="manifest-icon-512.png" className="App-logo" alt="logo"/>
                </>
            )}
        </main>
    );
}
