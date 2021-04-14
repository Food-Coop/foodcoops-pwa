import React, {useContext} from "react";
import {AuthContext} from "./Constants";
import {useHistory} from "react-router-dom";

export function AuthButton() {
    let history = useHistory();
    let auth = useContext(AuthContext);

    return auth?.user ? (
        <p>
            Welcome!{" "}
            <button
                onClick={() => {
                    auth.signout(() => history.push("/"));
                }}
            >
                Sign out
            </button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    );
}