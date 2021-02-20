import React, {useState,} from "react";
import {authContext as authContext1, fakeAuth} from "./Constants";

export default function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return (
        <authContext1 value={auth}>
            {children}
        </authContext1>
    );
}

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const signin = cb => {
        return fakeAuth.signin(() => {
            setUser("user");
            cb();
        });
    };

    const signout = cb => {
        return fakeAuth.signout(() => {
            setUser(null);
            cb();
        });
    };

    return {
        user,
        signin,
        signout
    };
}