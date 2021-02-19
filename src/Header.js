import React from "react";
import logo from './logo.svg';
import './Header.css';

function Header() {
    return (
        <header className="Header">
            <img className="Header-logo" src={logo} alt="logo"/>
            <h1>
                Food Coops
            </h1>
        </header>
    );
}

export default Header;
