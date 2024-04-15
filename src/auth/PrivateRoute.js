import React from "react";
import {Redirect, Route} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";

export function PrivateRoute({component: Component, roles, ...rest}) {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Lädt...</div>;
    }

    const isAuthorized = (roles) => {
        if (keycloak && roles) {
            return roles.some(r => {
                const realm = keycloak.hasRealmRole(r);
                const resource = keycloak.hasResourceRole(r);
                return realm || resource;
            });
        }
        return false;
    }

    return (
        <Route
            {...rest}
            render={props => 
                isAuthorized(roles) ? (
                    <Component {...props} />
                  ) : (
                     <Redirect to={{pathname: '/',}}/>)
            }
        />  
    )
}