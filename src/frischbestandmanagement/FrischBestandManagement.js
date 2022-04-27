import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useApi} from '../ApiService';
import {FrischBestandTable} from "./FrischBestandTable";

export function FrischBestandManagement() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'ProduktID',
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
            }
        ],[]
    );

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [skipPageReset, setSkipPageReset] = React.useState(false);

    const api = useApi();

    React.useEffect(
        () => {
            api.readFrischBestand()
                .then((r) => r.json())
                .then((r) => {
                        setData(old => {
                            let n = r?._embedded?.frischBestandRepresentationList;
                            console.log("n1 frischbestellung: " + JSON.stringify(n[1]));
                            //setIsLoading(false);
                            return n === undefined ? old : n;

                        });
                        //setIsLoading(false);
                    }
                );
        }, []
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
            <FrischBestandTable
                columns={columns}
                data={data}
                //getTrProps={getTrProps}
                //updateMyData={updateMyData}
                skipPageReset={skipPageReset}
                //dispatchModal={dispatchModal}
            />
        );
    }

    return(
        <div>
                {content()}

        </div>
    );
}


