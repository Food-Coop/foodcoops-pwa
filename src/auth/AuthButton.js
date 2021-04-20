import React from 'react';
import {useKeycloak} from "@react-keycloak/web";

export const AuthButton = () => {
    const {keycloak} = useKeycloak();

    return (
        <ul>
            <li><a href="/">Home Page </a></li>

            {keycloak && !keycloak.authenticated &&
            <li><a className="btn-link" onClick={() => keycloak.login()}>Login</a></li>
            }

            {keycloak && keycloak.authenticated &&
            <li>
                <a className="btn-link" onClick={() => keycloak.logout()}>Logout ({
                    keycloak.tokenParsed.preferred_username
                })</a>
            </li>
            }

        </ul>
    )
}
