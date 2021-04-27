import React from 'react';
import {useKeycloak} from "@react-keycloak/web";
import {Link} from "react-router-dom";

export const AuthButton = () => {
    const {keycloak} = useKeycloak();

    return (
        <>
            {keycloak && !keycloak.authenticated &&
            <Link><a className="btn-link" onClick={() => keycloak.login()}>Login</a></Link>
            }

            {keycloak && keycloak.authenticated &&
            <Link>
                <a className="btn-link" onClick={() => keycloak.logout()}>Logout ({
                    keycloak.tokenParsed.preferred_username
                })</a>
            </Link>
            }

        </>
    )
}
