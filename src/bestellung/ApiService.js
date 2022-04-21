import React from 'react';

const {createContext, useContext} = React;

const ApiContext = createContext(null);

export const ApiProvider = (props) => {
    const value = {
        readFrischBestand: props.readFrischBestand || readFrischBestand,
        readFrischBestellung: props.readFrischBestellung || readFrischBestellung,
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
        readFrischBestellung,
        createFrischBestellung,
        updateFrischBestellung
    };
};

const BACKEND_URL = "http://localhost:8080/";
const FRISCHBESTAND = "frischBestand/";
const FRISCHBESTELLUNG =  "frischBestellung/";
const DATUM = "datum/";
const PERSON = "person/";

const readFrischBestand = (id = undefined) => id ?
    fetch(BACKEND_URL + FRISCHBESTAND + id) :
    fetch(BACKEND_URL + FRISCHBESTAND);

const readFrischBestellung = (person_id) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM + person_id)


// const readFrischBestellung = (id) =>
//     fetch(BACKEND_URL + FRISCHBESTAND + id)

const createFrischBestellung = (data) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });

    const updateFrischBestellung = (data, frischBestellungId) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG + frischBestellungId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: frischBestellungId}),
    });

