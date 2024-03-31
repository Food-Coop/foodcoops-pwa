import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useApi} from '../ApiService';
import {GebindemanagementTable} from "./GebindemanagementTable";
import NumberFormatComponent from '../logic/NumberFormatComponent';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

export function Gebindemanagement(){
    const columns = React.useMemo(
        () => [
            {
                Header: 'Produkt',
                accessor: 'frischbestand.name',
            },
            {
                Header: 'Kategorie',
                accessor: 'frischbestand.kategorie.name',
            },
            {
                Header: 'Preis in €',
                accessor: 'frischbestand.preis',
                Cell: ({ value }) => <NumberFormatComponent value={value} />,
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
                Cell: ({ value }) => <NumberFormatComponent value={value} />,
            },
            {
                Header: 'Einheit',
                accessor: 'frischbestand.einheit.name',
            },
            {
                Header: 'Gebindegröße',
                accessor: 'frischbestand.gebindegroesse',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false} />,
            },
        ]
    );

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [skipPageReset, setSkipPageReset] = React.useState(false);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

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
        }, [reducerValue]
    )

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
                skipPageReset={skipPageReset}/>
        );
    }

    return(
        <div style={{overflowX: "auto", width: "100%"}}>
        <Row style={{margin: "1rem"}}>
            <Button style={{margin:"0.25rem"}} variant="success" onClick={() => window.open("http://152.53.32.66:8080/externeliste/gebinde")}>Externe Einkaufsliste</Button>
        </Row>
            {content()}
        </div>
    );
}
