import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import {BestellungTable} from "./BestellungTable";
import {deepAssign, deepClone} from '../util'
import {useApi} from './ApiService';
import {useKeycloak} from "@react-keycloak/web";



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
                Header: 'Preis',
                accessor: 'preis',
            },
            {
                Header: 'Einheit',
                accessor: 'einheit.name',
            },
            {
                Header: 'Gebindegröße',
                accessor: 'gebindegroesse',
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
            },
        ]
    );


    //const initialState = { hiddenColumns: ['id']};

    const [xfrischbestand, setXfrischbestand] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [modal, setModal] = React.useState({type: null, state: {}});
    const [skipPageReset, setSkipPageReset] = React.useState(false);



    const api = useApi();
    const {keycloak} = useKeycloak();

    React.useEffect(
        () => {
            api.readFrischBestand()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        //console.log(JSON.stringify(r));
                        const n = r?._embedded?.frischBestandRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
        }, []
    )
    
    const dispatchModal = (type, cell, row) => {
        let columnId = undefined;
        let rowId = undefined;
        let values = undefined;
        try {
            columnId = cell.column.id
            rowId = row.id;
            values = row.cells;
        } catch (e) {}
        let state = {};
        setModal({
            type, state
        })
    }

    const updateMyData = (rowId, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setData(old => {
                const [kategorieId, produktId] = rowId.split('.').map(e => parseInt(e));
                if (produktId === undefined) {
                    deepAssign(columnId, old[kategorieId], value);
                    return deepClone(old);
                }

                // walk the old data object using the accessor of the table columns
                deepAssign(columnId, old[kategorieId].produkte[produktId], value);

                return deepClone(old);
            }
        )
    }

    const submitBestellung = () => {

        const result = {};


        let a_personId = "person_id";
        let a_frischbestand = "frischbestand";
        let a_bestellmenge = "bestellmenge";
        let a_datum = "datum";

        let preis = 0;
        for (let i = 0; i < data.length; i++) {
            let produktId = "ProduktId" + i;
            let frischBestandId = document.getElementById(produktId).innerText;

            let datum = new Date();
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            let personId = keycloak.tokenParsed.preferred_username;
            //Check if Bestellmenge is valid
            if (bestellmenge == "") {
            } 
            else {
                var heute = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
                var deadline = new Date(heute.setDate(heute.getDate()-heute.getDay()));
                alert(deadline);
                if(datum > deadline){
                    //Update Bestellung
                    //console.log("FrischbestandID: " + frischBestandId);
                    //console.log("aijsdoiasjodiasj: " + JSON.stringify(data[i]));
                    const {_links, ...supported} = data[i];
                    //console.log("Supported: " + JSON.stringify(supported));
                    //console.log("API Frischbestand: " + JSON.stringify(xfrischbestand));

                    deepAssign(a_personId, result, personId);
                    deepAssign(a_frischbestand, result, supported);
                    deepAssign(a_bestellmenge, result, bestellmenge);
                    deepAssign(a_datum, result, datum);
                    //console.log("Assigned: " + JSON.stringify(result));
                    if (bestellmenge <= 10) {
                        api.updateFrischBestellung(result, frischBestandId);
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            api.updateFrischBestellung(result, frischBestandId);
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }
                else{
                    //Neue Bestellung
                    //console.log("FrischbestandID: " + frischBestandId);
                    //console.log("aijsdoiasjodiasj: " + JSON.stringify(data[i]));
                    const {_links, ...supported} = data[i];
                    //console.log("Supported: " + JSON.stringify(supported));
                    //console.log("API Frischbestand: " + JSON.stringify(xfrischbestand));

                    deepAssign(a_personId, result, personId);
                    deepAssign(a_frischbestand, result, supported);
                    deepAssign(a_bestellmenge, result, bestellmenge);
                    deepAssign(a_datum, result, datum);
                    //console.log("Assigned: " + JSON.stringify(result));
                    if (bestellmenge <= 10) {
                        api.createFrischBestellung(result);
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            api.createFrischBestellung(result);
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }
            }
        }
        document.getElementById("preis").innerHTML = "Preis: " + preis + "€";
        //alert("Ihre Bestellung wurde übermittelt. Vielen Dank!");
    };

    const content = () => {
        if (isLoading) {
            return (
                <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }

        return (
            <BestellungTable
                columns={columns}
                data={data}
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}
                dispatchModal={dispatchModal}/>
        );
    }

    return(
        <div>

            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
                <h4 id = "preis"></h4>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => submitBestellung()}>Submit Bestellung</Button>
            </div>

        </div>
    );
}