import React from 'react';

const {createContext, useContext} = React;

const ApiContext = createContext(null);

export const ApiProvider = (props) => {
    const value = {
        readFrischBestand: props.readFrischBestand || readFrischBestand
    };

    return (
        <ApiProvider.Provider value={value}>
            {props.children}
        </ApiProvider.Provider>
    );
};

export const useApi = () => {
    return {
        readFrischBestand,
    };
};

const BACKEND_URL = "http://localhost:8080/";
const FRISCHBESTAND = "frischBestand/";

const readFrischBestand= (id = undefined) => id ?
    fetch(BACKEND_URL + FRISCHBESTAND + id) :
    fetch(BACKEND_URL + FRISCHBESTAND);