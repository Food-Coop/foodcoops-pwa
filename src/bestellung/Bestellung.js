import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from '@mui/material/Alert';
import {BestellungTable} from "./BestellungTable";
import {deepAssign} from '../util'
import {useApi} from '../ApiService';
import {useKeycloak} from "@react-keycloak/web";
import { DeadlineLogic } from '../deadline/DeadlineLogic';
import NumberFormatComponent from '../logic/NumberFormatComponent';

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
                Header: 'Verband',
                accessor: 'verband',
            },
            {
                Header: 'Kategorie',
                accessor: 'kategorie.name',
            },
            {
                Header: 'Preis in €',
                accessor: 'preis',
                Cell: ({ value }) => <NumberFormatComponent value={value}/>,
            },
            {
                Header: 'Gebindegröße',
                accessor: 'gebindegroesse',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
            {
                Header: 'Bestellmenge (alle Mitglieder)',
                accessor: 'bestellsumme',
                Cell: ({ value }) => <NumberFormatComponent value={isNaN(value) ? 0 : value} includeFractionDigits={false}/>,
            },
            {
                Header: 'aktuelle Bestellmenge',
                accessor: 'bestellmengeNeu',
                Cell: ({ value }) => <NumberFormatComponent value={isNaN(value) ? 0 : value} includeFractionDigits={false}/>,
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
                Cell: ({ value }) => <NumberFormatComponent value={value}/>,
            },
            {
                Header: 'Einheit',
                accessor: 'einheit.name',
            },
        ]
    );

    const [frischBestellung, setFrischBestellung] = React.useState([]);
    const [lastWeekFrischBestellung, setLastWeekFrischBestellung] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAlsoLoading, setIsAlsoLoading] = React.useState(true);
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
            api.readFrischBestellungProPerson(person_id)
                .then(r => r.json())
                .then(r => {
                    setFrischBestellung(old => {
                        const n = r?._embedded?.frischBestellungRepresentationList
                        return n === undefined ? old : n;
                    }
                );
            });
            api.readFrischBestellungBetweenDatesProPerson(person_id)
                .then(r => r.json())
                .then(r => {
                    setLastWeekFrischBestellung(old => {
                        const n = r?._embedded?.frischBestellungRepresentationList
                        return n === undefined ? old : n;
                    }
                );
            });
        }, [reducerValue]
    )

    const checkAlreadyOrdered = (frischBestandId) =>{
        for(let j = 0; j < frischBestellung.length; j++){
            if(frischBestandId === frischBestellung[j].frischbestand.id){
                return frischBestellung[j].id;
            }
        }
        return null;

    }

    const clearInputFields = () => {
        for (let i = 0; i < data.length; i++) {
            let bestellId = "Inputfield" + i;
            document.getElementById(bestellId).value = "";
        }
    }

    const submitBestellung = async () => {
        const result = {};
        let preis = 0;
        let successMessage = "Ihre Bestellung wurde übermittelt. Vielen Dank!";
        let errorOccurred = false;
        const apiCalls = [];

        for (let i = 0; i < data.length; i++) {
            let frischBestandId = data[i].id;
            let personId = keycloak.tokenParsed.preferred_username;
            let datum = new Date();
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            
            //Check if Bestellmenge is valid
            if (bestellmenge !== "") {
                const {_links, ...supported} = data[i];
                deepAssign("person_id", result, personId);
                deepAssign("frischbestand", result, { ...supported, type: "frisch" });
                deepAssign("bestellmenge", result, bestellmenge);
                deepAssign("datum", result, datum);
                deepAssign("type", result, "frisch");

                // Überprüfe ob bereits eine Bestellung in dieser Woche getätigt wurde
                let check = checkAlreadyOrdered(frischBestandId);
                if (check != null) {
                    if (bestellmenge === "0") {
                        // Bestellung löschen
                        apiCalls.push(api.deleteFrischBestellung(check));
                    } else {
                        // Bestellung updaten
                        console.log(result);
                        apiCalls.push(api.updateFrischBestellung(result, check));
                    }
                } else {
                    // Neue Bestellung abgeben
                    apiCalls.push(api.createFrischBestellung(result));
                }
            }
        }
    
        try {
            const responses = await Promise.all(apiCalls);
            for (const response of responses) {
              if (!(response.ok || response.status === 201 || response.status === 204)) {
                errorOccurred = true;
                break;
            }
        }

        if (!errorOccurred) {
          toast.success(successMessage);
        } else {
            toast.error("Es gab einen Fehler beim Übermitteln Ihrer Bestellung. Bitte versuchen Sie es erneut.");
          }
        } catch (error) {
          errorOccurred = true;
          toast.error("Es gab einen Fehler beim Übermitteln Ihrer Bestellung. Bitte versuchen Sie es erneut.");
        }
        
        forceUpdate();
        clearInputFields();
        document.getElementById("preis").innerHTML = "Preis: " + preis + " €";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const content = () => {
        if (isLoading || isAlsoLoading) {
            return null;
        }
        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < frischBestellungSumme.length; j++){
                if(data[i].id === frischBestellungSumme[j].frischbestand.id){
                    let bestellmenge = frischBestellungSumme[j].bestellmenge;
                    bestellmenge = bestellmenge.toFixed(2);
                    deepAssign("bestellsumme", data[i], bestellmenge);
                }
            }
            for(let j = 0; j < lastWeekFrischBestellung.length; j++){
                if(data[i].id === lastWeekFrischBestellung[j].frischbestand.id){
                    deepAssign("bestellmengeAlt", data[i], lastWeekFrischBestellung[j].bestellmenge);
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
                data={data}
                />
        );
    }

    return(
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
                <DeadlineLogic />
                <Alert severity="info" style={{margin: "0.5em 1em 0.5em 1em"}}> 
                    Die aktuelle Bestellmenge eines Produktes kann geändert werden, indem die neue Bestellmenge in das Eingabefeld eingetragen wird und anschließend auf "Bestellung bestätigen" geklickt wird.
                </Alert>
                {content()}
                <h4 id = "preis"></h4>
                <Button style={{margin: "1vh 0.25rem 1vh 0.25rem"}} variant="success" onClick={() => submitBestellung()}>Bestellung bestätigen</Button>
                <ToastContainer />
            </div>
        </div>
    );
}