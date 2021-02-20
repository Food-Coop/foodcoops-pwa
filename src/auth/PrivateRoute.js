import React, {useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {AuthContext} from "./Constants";

export function PrivateRoute({children, ...rest}) {
    let auth = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={({location}) =>
                auth?.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}