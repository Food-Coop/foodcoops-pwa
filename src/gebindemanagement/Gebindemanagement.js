import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {deepAssign, deepClone} from '../lager/util'
import {useApi} from './ApiService';
import {GebindemanagementTable} from "./GebindemanagementTable";

export function Gebindemanagement(){
    const columns = React.useMemo(
        () => [
            {   Header: 'Frischbestellung-ID',
                accessor: 'id'
            },
            {
                Header: 'Produkt',
                accessor: 'produkt',
            },
            {
                Header: 'Gesamtpreis',
                accessor: 'gesamtpreis',
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
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
                        console.log("R parsed: " + JSON.stringify(r));
                        const n = r?._embedded?.frischBestellungRepresentationList;
                        console.log(n);
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
            <h4><b><i>Tabelle mit allen eingegangenen Bestellungen von vor einer Woche bis jetzt</i></b></h4>
            {content()}
        </div>
    );
}