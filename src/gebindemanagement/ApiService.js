import React from 'react';

const {createContext, useContext} = React;

const ApiContext = createContext(null);

export const ApiProvider = (props) => {
    const value = {
        readFrischBestellung: props.readFrischBestellung || readFrischBestellung,
        readFrischBestellungProProdukt: props.readFrischBestellungProProdukt || readFrischBestellungProProdukt,
    };

    return (
        <ApiProvider.Provider value={value}>
            {props.children}
        </ApiProvider.Provider>
    );
};

export const useApi = () => {
    return {
        readFrischBestellung,
        readFrischBestellungProProdukt
    };
};

const BACKEND_URL = "http://localhost:8080/";
const FRISCHBESTELLUNG =  "frischBestellung/";
const DATUM = "datum/"
const MENGE = "menge/"

const readFrischBestellung = () => fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM);

const readFrischBestellungProProdukt = () => fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM + MENGE);