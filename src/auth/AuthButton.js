import React from 'react';
import {useKeycloak} from "@react-keycloak/web";

export const AuthButton = () => {
    const {keycloak} = useKeycloak();

    return (
        <>
            {keycloak && !keycloak.authenticated &&
            <div><a className="btn-link" onClick={() => keycloak.login()} style={{ color: 'white', cursor: 'pointer', textDecoration: 'none', }}>Login</a></div>
            }

            {keycloak && keycloak.authenticated &&
            <div >
                <a className="btn-link" onClick={() => keycloak.logout()} style={{ color: 'white', cursor: 'pointer', textDecoration: 'none', }}>Logout ({
                    keycloak.tokenParsed.preferred_username
                })</a>
            </div>
            }

        </>
    )
}