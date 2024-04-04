import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from '@mui/material/Alert';
import { useApi } from '../ApiService';
import {useKeycloak} from "@react-keycloak/web";
import { BrotTable } from './BrotTable';
import { deepAssign } from '../util';
import { DeadlineLogic } from '../deadline/DeadlineLogic';
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function Brot(){
    const columns = React.useMemo(
        () => [
            {   Header: 'BrotID',
                accessor: 'id'
            },
            {
                Header: 'Brotname',
                accessor: 'name',
            },
            {
                Header: 'Gewicht in g',
                accessor: 'gewicht',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false} />,
            },
            {
                Header: 'Preis in €',
                accessor: 'preis',
                Cell: ({ value }) => <NumberFormatComponent value={value} />,
                
            },
            {
                Header: 'aktuelle eigene Bestellung',
                accessor: 'bestellmengeNeu',
                Cell: ({ value }) => <NumberFormatComponent value={isNaN(value) ? 0 : value} includeFractionDigits={false}/>,
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
                Cell: ({ value }) => <NumberFormatComponent value={value} />,
            }
        ]
    );

    const [brotBestellung, setBrotBestellung] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAlsoLoading, setIsAlsoLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);
    const [brotBestellungSumme, setBrotBestellungSumme] = React.useState([]);

    const api = useApi();
    const {keycloak} = useKeycloak();

    React.useEffect(
        () => {
            api.readBrotBestellungProProdukt()
                .then((r) => r.json())
                .then((r) => {
                    setBrotBestellungSumme(old => {
                        const n = r?._embedded?.brotBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsAlsoLoading(false);
                }
            );
            api.readBrotBestand()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        let n = r?._embedded?.brotBestandRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
            let person_id = keycloak.tokenParsed.preferred_username;
            api.readBrotBestellungProPerson(person_id)
                .then(r => r.json())
                .then(r => {
                    setBrotBestellung(old => {
                        const n = r?._embedded?.brotBestellungRepresentationList
                        return n === undefined ? old : n;
                    }
                );
            });
        }, [reducerValue]
    )

    const checkAlreadyOrdered = (brotBestandId) =>{
        for(let j = 0; j < brotBestellung.length; j++){
            if(brotBestandId === brotBestellung[j].brotbestand.id){
                return brotBestellung[j].id;
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
            let brotBestandId = data[i].id;
            let personId = keycloak.tokenParsed.preferred_username;
            let datum = new Date();
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
    
            // Check if Bestellmenge is valid
            if (bestellmenge !== "") {
                const {_links, ...supported} = data[i];
                deepAssign("person_id", result, personId);
                deepAssign("brotbestand", result, { ...supported, type: "brot" });
                deepAssign("bestellmenge", result, bestellmenge);
                deepAssign("datum", result, datum);
                deepAssign("type", result, "brot");
    
                // Überprüfe ob bereits eine Bestellung in dieser Woche getätigt wurde
                let check = checkAlreadyOrdered(brotBestandId);
                if (check != null) {
                    // Bestellung updaten
                    apiCalls.push(api.updateBrotBestellung(result, check));
                } else {
                    // Neue Bestellung abgeben
                    apiCalls.push(api.createBrotBestellung(result));
                }
            }
        }
    
        try {
            const responses = await Promise.all(apiCalls);
            for (const response of responses) {
              if (!response.ok) {
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
            for(let j = 0; j < brotBestellungSumme.length; j++){
                if(data[i] && data[i].id === brotBestellungSumme[j].brotbestand.id){
                    deepAssign("bestellsumme", data[i], brotBestellungSumme[j].bestellmenge);
                }
                else if(data[i]){
                    deepAssign("bestellsumme", data[i], 0);
                } 
            }
            for(let j = 0; j < brotBestellung.length; j++){
                if(data[i] && checkAlreadyOrdered(data[i].id)){
                    deepAssign("bestellmengeNeu", data[i], brotBestellung[j].bestellmenge);
                }
            }
        }

        return (
            <BrotTable
                columns={columns}
                data={data}/>
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
                <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" onClick={() => submitBestellung()}>Bestellung bestätigen</Button>
                <ToastContainer />
            </div>
        </div>
    );
}