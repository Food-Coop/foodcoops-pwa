import React from "react";
import {Redirect, Route} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";

export function PrivateRoute({component: Component, roles, ...rest}) {
    const {keycloak} = useKeycloak();

    const isAutherized = (roles) => {
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
            render={props => {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user) {
                // Not logged in so redirect to login page
                return <Redirect to={{ pathname: '/login' }} />
                }

                // Check if route is restricted by role
                if (roles && roles.indexOf(user.role) === -1) {
                // Role not authorized so redirect to home page
                return <Redirect to={{ pathname: '/'}} />
                }

                // Authorized so return component
                return <Component {...props} />
            }}
        />  
    )
}
