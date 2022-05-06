import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {deepAssign, deepClone} from '../util'
import {useApi} from '../ApiService';
import {GebindemanagementTable} from "./GebindemanagementTable";
import { Deadline } from '../deadline/Deadline';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

export function Gebindemanagement(){
    const columns = React.useMemo(
        () => [
            // {   Header: 'Frischbestellung-ID',
            //     accessor: 'id'
            // },
            {
                Header: 'Produkt',
                accessor: 'frischbestand.name',
            },
            {
                Header: 'Kategorie',
                accessor: 'frischbestand.kategorie.name',
            },
            {
                Header: 'Preis',
                accessor: 'frischbestand.preis',
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
            },
            {
                Header: 'Einheit',
                accessor: 'frischbestand.einheit.name',
            },
            {
                Header: 'Gebindegröße',
                accessor: 'frischbestand.gebindegroesse',
            },
        ]
    );

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [skipPageReset, setSkipPageReset] = React.useState(false);

    const api = useApi();

    React.useEffect(
        () => {
            api.readFrischBestellungProProdukt()
            //api.readFrischBestellung()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        const n = r?._embedded?.frischBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
        }, []
    )

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

    const content = () => {
        if (isLoading) {
            return (
                <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }
    
        return (
            <GebindemanagementTable
                columns={columns}
                data={data}
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}/>
        );
    }

    return(
        <div style={{overflowX: "auto", width: "100%"}}>
        <Row style={{margin: "1rem"}}>
            <Button style={{margin:"0.25rem"}} variant="success" onClick={() => window.open("http://localhost:8080/externeliste/gebinde")}>Externe Einkaufsliste</Button>
        </Row>
            {content()}
        </div>
    );
}