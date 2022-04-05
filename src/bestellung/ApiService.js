import React from 'react';

const {createContext, useContext} = React;

const ApiContext = createContext(null);

export const ApiProvider = (props) => {
    const value = {
        readFrischBestand: props.readFrischBestand || readFrischBestand,
        createFrischBestellung: props.createFrischBestellung || createFrischBestellung,
        createFrischBestellung2: props.createFrischBestellung2 || createFrischBestellung2
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
        createFrischBestellung2,
    };
};

const BACKEND_URL = "http://localhost:8080/";
const FRISCHBESTAND = "frischBestand/";
const FRISCHBESTELLUNG =  "frischBestellung/";

const readFrischBestand = (id = undefined) => id ?
    fetch(BACKEND_URL + FRISCHBESTAND + id) :
    fetch(BACKEND_URL + FRISCHBESTAND);

const createFrischBestellung = (personId, frischBestandId, menge, datum) =>
    {
        fetch(BACKEND_URL + FRISCHBESTELLUNG, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: null, personId, frischBestandId, menge, datum, }),
        })
        //Read Http-Response
        .then(response => {
            alert(response.status)
        })
    }

    const createFrischBestellung2 = (id, personId, frischBestandId, menge, datum) =>
    {
        fetch(BACKEND_URL + FRISCHBESTELLUNG, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, personId, frischBestandId, menge, datum, }),
        })
        //Read Http-Response
        .then(response => {
            alert(response.status)
        })
    }
