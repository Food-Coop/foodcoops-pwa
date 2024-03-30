import React from 'react';

export const ApiProvider = (props) => {
    const value = {
        createProdukt: props.createProdukt || createProdukt,
        readProdukt: props.readProdukt || readProdukt,
        deleteProdukt: props.deleteProdukt || deleteProdukt,
        updateProdukt: props.updateProdukt || updateProdukt,

        createKategorie: props.createKategorie || createKategorie,
        readKategorie: props.readKategorie || readKategorie,
        deleteKategorie: props.deleteKategorie || deleteKategorie,
        updateKategorie: props.updateKategorie || updateKategorie,

        createEinheit: props.createEinheit || createEinheit,
        readEinheit: props.readEinheit || readEinheit,
        deleteEinheit: props.deleteEinheit || deleteEinheit,

        readFrischBestellung: props.readFrischBestellung || readFrischBestellung,
        readFrischBestellungProPerson: props.readFrischBestellungProPerson || readFrischBestellungProPerson,
        readFrischBestellungProProdukt: props.readFrischBestellungProProdukt || readFrischBestellungProProdukt,
        readFrischBestellungBetweenDatesProPerson: props.readFrischBestellungBetweenDatesProPerson || readFrischBestellungBetweenDatesProPerson,
        createFrischBestellung: props.createFrischBestellung || createFrischBestellung,
        updateFrischBestellung: props.updateFrischBestellung || updateFrischBestellung,
        
        readFrischBestand: props.readFrischBestand || readFrischBestand,
        createFrischBestand: props.createFrischBestand || createFrischBestand,
        deleteFrischBestand: props.deleteFrischBestand || deleteFrischBestand,
        updateFrischBestand: props.updateFrischBestand || updateFrischBestand,

        readBrotBestand: props.readBrotBestand || readBrotBestand,
        createBrotBestand: props.createBrotBestand || createBrotBestand,
        deleteBrotBestand: props.deleteBrotBestand || deleteBrotBestand,
        updateBrotBestand: props.updateBrotBestand || updateBrotBestand,

        readBrotBestellung: props.readBrotBestellung || readBrotBestellung,
        readBrotBestellungProPerson: props.readBrotBestellungProPerson || readBrotBestellungProPerson,
        readBrotBestellungProProdukt: props.readBrotBestellungProProdukt || readBrotBestellungProProdukt,
        readBrotBestellungBetweenDatesProPerson: props.readBrotBestellungBetweenDatesProPerson || readBrotBestellungBetweenDatesProPerson,
        createBrotBestellung: props.createBrotBestellung || createBrotBestellung,
        updateBrotBestellung: props.updateBrotBestellung || updateBrotBestellung,

        readDeadline: props.readDeadline || readDeadline,
        readLastDeadline: props.readLastDeadline || readLastDeadline,
        readCurrentDeadline: props.readCurrentDeadline || readCurrentDeadline,
        createDeadline: props.createDeadline || createDeadline,

        readEinkauf: props.readEinkauf || readEinkauf,
        createEinkauf: props.createEinkauf || createEinkauf,
        deleteEinkauf: props.deleteEinkauf || deleteEinkauf,
        createBestandBuyObject: props.createBestandBuyObject || createBestandBuyObject,
    };

    return (
        <ApiProvider.Provider value={value}>
            {props.children}
        </ApiProvider.Provider>
    );
};

export const useApi = () => {
    return {
        createProdukt,
        readProdukt,
        deleteProdukt,
        updateProdukt,

        createKategorie,
        readKategorie,
        deleteKategorie,
        updateKategorie,

        createEinheit,
        readEinheit,
        deleteEinheit,

        readFrischBestellung,
        readFrischBestellungProProdukt,
        readFrischBestellungProPerson,
        readFrischBestellungBetweenDatesProPerson,
        createFrischBestellung,
        updateFrischBestellung,

        readFrischBestand,
        createFrischBestand,
        updateFrischBestand,
        deleteFrischBestand,

        readBrotBestand,
        createBrotBestand,
        deleteBrotBestand,
        updateBrotBestand,

        readBrotBestellung,
        readBrotBestellungProProdukt,
        readBrotBestellungProPerson,
        readBrotBestellungBetweenDatesProPerson,
        createBrotBestellung,
        updateBrotBestellung,

        readDeadline,
        readLastDeadline,
        readCurrentDeadline,
        createDeadline,

        readEinkauf,
        createEinkauf,
        deleteEinkauf,
        createBestandBuyObject
    };
};

//const OLD_BACKEND_URL = "https://foodcoops-backend.herokuapp.com/";
const BACKEND_URL = "http://152.53.32.66:8080/";
const KATEGORIEN = "kategorien/";
const PRODUKTE = "produkte/";
const EINHEITEN = "einheiten/";
const FRISCHBESTELLUNG =  "frischBestellung/";
const DATUM = "datum/";
const MENGE = "menge/";
const FRISCHBESTAND = "frischBestand/";
const PERSON = "person/";
const BROTBESTAND = "brotBestand/";
const BROTBESTELLUNG = "brotBestellung/";
const DEADLINE = "deadline/";
const LAST = "last/";
const CURRENT = "getEndDateOfDeadline/";
const EINKAUF = "einkauf/";
const BESTANDBUYOBJECT = "einkaufe/create/bestandBuyObject";


// Produkt

const createProdukt = (data) =>
    fetch(BACKEND_URL + PRODUKTE, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });

const readProdukt = (id = undefined) => id ?
    fetch(BACKEND_URL + PRODUKTE + id) :
    fetch(BACKEND_URL + PRODUKTE);

const deleteProdukt = (id) =>
    fetch(BACKEND_URL + PRODUKTE + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

const updateProdukt = (id, changedData) =>
    fetch(BACKEND_URL + PRODUKTE + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedData),
    });

// Kategorie

const readKategorie = (id = undefined) => id ?
    fetch(BACKEND_URL + KATEGORIEN + id) :
    fetch(BACKEND_URL + KATEGORIEN);

const createKategorie = (name, icon) =>
    fetch(BACKEND_URL + KATEGORIEN, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: "", name, icon}),
    });

const updateKategorie = (id, name) =>
    fetch(BACKEND_URL + KATEGORIEN + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name}),
    });

const deleteKategorie = (id) =>
    fetch(BACKEND_URL + KATEGORIEN + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

// Einheit

const readEinheit = (id = undefined) => id ?
    fetch(BACKEND_URL + EINHEITEN + id) :
    fetch(BACKEND_URL + EINHEITEN);

const createEinheit = (name) =>
    fetch(BACKEND_URL + EINHEITEN, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: null, name}),
    });

const deleteEinheit = (id) =>
    fetch(BACKEND_URL + EINHEITEN + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

// FrischBestellung

const readFrischBestellung = () => 
    fetch(BACKEND_URL + FRISCHBESTELLUNG);

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

const readFrischBestellungProPerson = (person_id) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM + person_id)

const readFrischBestellungProProdukt = () => 
    fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM + MENGE);

const readFrischBestellungBetweenDatesProPerson = (person_id) => 
    fetch(BACKEND_URL + FRISCHBESTELLUNG + PERSON + person_id)

// Frischbestand

const readFrischBestand = (id = undefined) => id ?
    fetch(BACKEND_URL + FRISCHBESTAND + id) :
    fetch(BACKEND_URL + FRISCHBESTAND);

const createFrischBestand = (data) =>
fetch(BACKEND_URL + FRISCHBESTAND, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({...data, id: "undefined"}),
});

const updateFrischBestand = (id, changedData) =>
    fetch(BACKEND_URL + FRISCHBESTAND + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedData),
    });

const deleteFrischBestand = (id) => 
    fetch(BACKEND_URL + FRISCHBESTAND + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

// Brotbestellung

const readBrotBestellung = () => 
    fetch(BACKEND_URL + BROTBESTELLUNG + DATUM);

const createBrotBestellung = (data) =>
    fetch(BACKEND_URL + BROTBESTELLUNG, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });

const updateBrotBestellung = (data, frischBestellungId) =>
    fetch(BACKEND_URL + BROTBESTELLUNG + frischBestellungId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: frischBestellungId}),
    });

const readBrotBestellungProPerson = (person_id) =>
    fetch(BACKEND_URL + BROTBESTELLUNG + DATUM + person_id)

const readBrotBestellungProProdukt = () => 
    fetch(BACKEND_URL + BROTBESTELLUNG + DATUM + MENGE);

const readBrotBestellungBetweenDatesProPerson = (person_id) => 
    fetch(BACKEND_URL + BROTBESTELLUNG + PERSON + person_id)

// Brotbestand

const readBrotBestand = (id = undefined) => id ?
    fetch(BACKEND_URL + BROTBESTAND + id) :
    fetch(BACKEND_URL + BROTBESTAND);

const createBrotBestand = (data) =>
    fetch(BACKEND_URL + BROTBESTAND, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });
    
const updateBrotBestand = (id, changedData) =>
    fetch(BACKEND_URL + BROTBESTAND + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedData),
    });

const deleteBrotBestand = (id) => 
    fetch(BACKEND_URL + BROTBESTAND + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

// Deadline

const readDeadline = (id = undefined) => id ?
    fetch(BACKEND_URL + DEADLINE + id) :
    fetch(BACKEND_URL + DEADLINE);

const readLastDeadline = () =>
    fetch(BACKEND_URL + DEADLINE + LAST);

const readCurrentDeadline = (id) =>
    fetch(BACKEND_URL + DEADLINE + CURRENT + id);

const createDeadline = (data) =>
    fetch(BACKEND_URL + DEADLINE, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });

// Einkauf

const readEinkauf = (id = undefined) => id ?
    fetch(BACKEND_URL + EINKAUF + id) :
    fetch(BACKEND_URL + EINKAUF);

const createEinkauf = (data) =>
    fetch(BACKEND_URL + EINKAUF, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });

const deleteEinkauf = (id) =>
    fetch(BACKEND_URL + EINKAUF + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

const createBestandBuyObject = (data) =>
    fetch(BACKEND_URL + BESTANDBUYOBJECT, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });
