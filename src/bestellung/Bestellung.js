import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import {BestellungTable} from "./BestellungTable";
import {deepAssign, deepClone} from '../lager/util'
import {useApi} from './ApiService';
import {useTable} from "react-table";



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

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [modal, setModal] = React.useState({type: null, state: {}});
    const [skipPageReset, setSkipPageReset] = React.useState(false);



    const api = useApi();

    React.useEffect(
        () => {
            api.readFrischBestand()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
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
        for(let i = 0; i < data.length; i++){
            let produktId = "ProduktId" + i;
            let frischBestandId = document.getElementById(produktId).innerText;
            let datum = new Date();
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            let personId = "11589rqw-139e-466c-80e0-a1bcad7c9996";
            let id = "testId"
            //Check if Bestellmenge is valid
            if(bestellmenge == ""){
            }
            else if(bestellmenge > 10){
                let artikel = "ProduktName" + i;
                let artikelname = document.getElementById(artikel).innerText;
                if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                    api.createFrischBestellung(personId, frischBestandId, bestellmenge, datum);
                }
                else{
                    alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                }
            }
            else{
                api.createFrischBestellung(personId, frischBestandId, bestellmenge, datum);
            }
        }
        alert("Ihre Bestellung wurde übermittelt. Vielen Dank!");
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
            {/* <Row style={{margin: "1rem"}}>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewFrischBestellungModal")}>Neue Bestellung</Button>
            </Row> */}
            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => submitBestellung()}>Submit Bestellung</Button>
            </div>

        </div>
    );
}