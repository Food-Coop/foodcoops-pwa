import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BestellungTable} from "./BestellungTable";
import {deepAssign} from '../util'
import {useApi} from '../ApiService';
import {useKeycloak} from "@react-keycloak/web";
import { DeadlineLogic } from '../deadline/DeadlineLogic';

export function Bestellung(){
    const columns = React.useMemo(
        () => [
            {   Header: 'ProduktID',
                accessor: 'id'
            },
            {
                Header: 'Produkt',
                accessor: 'name',
            },
            {
                Header: 'Land',
                accessor: 'herkunftsland',
            },
            {
                Header: 'Kategorie',
                accessor: 'kategorie.name',
            },
            {
                Header: 'Preis in €',
                accessor: 'preis',
            },
            {
                Header: 'Gebindegröße',
                accessor: 'gebindegroesse',
            },
            {
                Header: 'Gesamtbestellung',
                accessor: 'bestellsumme',
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
            },
            {
                Header: 'Einheit',
                accessor: 'einheit.name',
            },
        ]
    );


    //const initialState = { hiddenColumns: ['id']};

    const [frischBestellung, setFrischBestellung] = React.useState([]);
    const [frischBestellungBetweenDatesProPerson, setFrischBestellungBetweenDatesProPerson] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAlsoLoading, setIsAlsoLoading] = React.useState(true);
    const [isAlsoLoading2, setIsAlsoLoading2] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);
    const [frischBestellungSumme, setFrischBestellungSumme] = React.useState([]);

    const api = useApi();
    const {keycloak} = useKeycloak();

    React.useEffect(
        () => {
            api.readFrischBestellungProProdukt()
                .then((r) => r.json())
                .then((r) => {
                    setFrischBestellungSumme(old => {
                        const n = r?._embedded?.frischBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsAlsoLoading(false);
                }
            );
            api.readFrischBestand()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        let n = r?._embedded?.frischBestandRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
            let person_id = keycloak.tokenParsed.preferred_username;
            api.readFrischBestellungBetweenDatesProPerson(person_id)
                .then((r) => r.json())
                .then((r) => {
                    setFrischBestellungBetweenDatesProPerson(old => {
                        let n = r?._embedded?.frischBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsAlsoLoading2(false);
                }
            );
            api.readFrischBestellungProPerson(person_id)
                .then(r => r.json())
                .then(r => {
                    setFrischBestellung(old => {
                        const n = r?._embedded?.frischBestellungRepresentationList
                        return n === undefined ? old : n;
                    }
                );
            });
        }, [reducerValue]
    )

    const checkAlreadyOrdered = (frischBestandId) =>{
        for(let j = 0; j < frischBestellung.length; j++){
            if(frischBestandId == frischBestellung[j].frischbestand.id){
                return frischBestellung[j].id;
            }
        }
        return null;

    }

    const addDays = (n) => {
        return new Date(this.getTime() + (24*60*60*1000)*n);
    }

    const clearInputFields = () => {
        for (let i = 0; i < data.length; i++) {
            let bestellId = "Inputfield" + i;
            document.getElementById(bestellId).value = "";
        }
    }

    const submitBestellung = () => {
        const result = {};
        let preis = 0;
        for (let i = 0; i < data.length; i++) {
            let produktId = "ProduktId" + i;
            let frischBestandId = document.getElementById(produktId).innerText;
            let personId = keycloak.tokenParsed.preferred_username;
            let datum = new Date();
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            
            //Check if Bestellmenge is valid
            if (bestellmenge == "") {
            } 
            else {
                const {_links, ...supported} = data[i];
                deepAssign("person_id", result, personId);
                deepAssign("frischbestand", result, supported);
                deepAssign("bestellmenge", result, bestellmenge);
                deepAssign("datum", result, datum);
                deepAssign("type", result, "frisch");

                //Überprüfe ob bereits eine Bestellung in dieser Woche getätigt wurde
                let check = checkAlreadyOrdered(frischBestandId);
                if(check != null){
                    //Bestellung updaten
                    if (bestellmenge <= 10) {
                        (async function () {
                            const response = await api.updateFrischBestellung(result, check);
                            if(response.ok) {
                                clearInputFields();
                                forceUpdate();
                            }
                            else{
                                alert("Das Updaten einer Frischbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                            }
                        })();
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            (async function () {
                                const response = await api.updateFrischBestellung(result, check);
                                if(response.ok) {
                                    clearInputFields();
                                    forceUpdate();
                                }
                                else{
                                    alert("Das Updaten einer Frischbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                                }
                            })();
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }

                else{
                    //Neue Bestellung abgeben
                    if (bestellmenge <= 10) {
                        (async function () {
                            const response = await api.createFrischBestellung(result);
                            if(response.ok) {
                                clearInputFields();
                                forceUpdate();
                            }
                            else{
                                alert("Das Abgeben einer Frischbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                            }
                        })();
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            (async function () {
                                const response = await api.createFrischBestellung(result);
                                if(response.ok) {
                                    clearInputFields();
                                    forceUpdate();
                                }
                                else{
                                    alert("Das Abgeben einer Frischbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                                }
                            })();
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }
                
            }
        }
        clearInputFields();
        forceUpdate();
        document.getElementById("preis").innerHTML = "Preis: " + preis + "€";
        toast.success("Ihre Bestellung wurde übermittelt. Vielen Dank!");
    };

    const content = () => {
        if (isLoading || isAlsoLoading || isAlsoLoading2) {
            return (
                <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }
        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < frischBestellungSumme.length; j++){
                if(data[i].id === frischBestellungSumme[j].frischbestand.id){
                    let bestellmenge = frischBestellungSumme[j].bestellmenge;
                    bestellmenge = bestellmenge.toFixed(2);
                    deepAssign("bestellsumme", data[i], bestellmenge);
                }
            }
            for(let j = 0; j < frischBestellungBetweenDatesProPerson.length; j++){
                if(data[i].id === frischBestellungBetweenDatesProPerson[j].frischbestand.id){
                    deepAssign("bestellmengeAlt", data[i], frischBestellungBetweenDatesProPerson[j].bestellmenge);
                }    
            }
            for(let j = 0; j < frischBestellung.length; j++){
                if(checkAlreadyOrdered(data[i].id) && data[i].id === frischBestellung[j].frischbestand.id){
                    deepAssign("bestellmengeNeu", data[i], frischBestellung[j].bestellmenge);
                }   
            }
            
        }

        return (
            <BestellungTable
                columns={columns}
                data={data}/>
        );
    }

    return(
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
                <DeadlineLogic />
                {content()}
                <h4 id = "preis"></h4>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => submitBestellung()}>Submit Bestellung</Button>
                <ToastContainer />
            </div>
        </div>
    );
}
