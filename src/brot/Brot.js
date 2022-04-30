import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { useApi } from '../ApiService';

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
                Header: 'Gewicht',
                accessor: 'gewicht',
            },
            {
                Header: 'Preis',
                accessor: 'preis',
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
            }
        ]
    );

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);


    const api = useApi();

    React.useEffect(
        () => {
            api.readBrotBestand()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        let n = r?._embedded?.frischBestandRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
        }, []
    )

    return(
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
                <h4>Brotbestellung</h4>
                <Button style={{margin:"0.25rem"}} variant="success" >Submit Brotbestellung</Button>
            </div>
        </div>
    );
}