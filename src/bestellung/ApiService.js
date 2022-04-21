import React from 'react';

const {createContext, useContext} = React;

const ApiContext = createContext(null);

export const ApiProvider = (props) => {
    const value = {
        readFrischBestand: props.readFrischBestand || readFrischBestand,
        createFrischBestellung: props.createFrischBestellung || createFrischBestellung,
        updateFrischBestellung: props.updateFrischBestellung || updateFrischBestellung
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
        createFrischBestellung,
        updateFrischBestellung
    };
};

const BACKEND_URL = "http://localhost:8080/";
const FRISCHBESTAND = "frischBestand/";
const FRISCHBESTELLUNG =  "frischBestellung/";

const readFrischBestand = (id = undefined) => id ?
    fetch(BACKEND_URL + FRISCHBESTAND + id) :
    fetch(BACKEND_URL + FRISCHBESTAND);

const createFrischBestellung = (data) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });

    const updateFrischBestellung = (data, frischBestandId) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: frischBestandId}),
    });

