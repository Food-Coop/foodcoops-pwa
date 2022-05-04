import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import { useApi } from '../ApiService';
import {deepAssign, deepClone} from '../util';
import { DeadlineTable } from './DeadlineTable';
import { NewDeadlineModal } from './NewDeadlineModal';

export function Deadline(){

    const columns = React.useMemo(
        () => [
            {
                Header: 'Wochentag',
                accessor: 'weekday',
            },
            {
                Header: 'Uhrzeit',
                accessor: 'time',
            },
            {
                Header: 'Datum',
                accessor: 'datum',
            }
        ]
    );

    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [skipPageReset, setSkipPageReset] = React.useState(false);
    const [modal, setModal] = React.useState({type: null, state: {}});

    const api = useApi();
    
    React.useEffect(
        () => {
            // api.readDeadline()
            //     .then((r) => r.json())
            //     .then((r) => {
            //         setData(old => {
            //             const n = r?._embedded?.deadlineRepresentationList;
            //             return n === undefined ? old : n;
                        
            //         });
                    
            //         setIsLoading(false);
            //     }
            // );
            api.readLastDeadline()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        const n = r?._embedded?.deadlineRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
        }, []
    );

    const newDeadline = (data1) => {
        let datum = new Date();
        deepAssign("datum", data1, datum);
        (async function () {
            const response = await api.createDeadline(data1);
            if(response.ok) {
                const newDeadline = await response.json();
                    setSkipPageReset(true);
                    setData(old => deepClone([...old, newDeadline]));
            }
        })();
    };

    const dispatchModal = (type, cell, row) => {
        let columnId = undefined;
        let rowId = undefined;
        let values = undefined;
        try {
            columnId = cell.column.id
            rowId = row.id;
            values = row.cells;
        } catch (e) {

        }
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

    const content = () => {
        if (isLoading) {
            return (
                <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }
        return (
            <DeadlineTable
                columns={columns}
                data={data}
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}
                dispatchModal={dispatchModal}/>
        );
    }

    return(
        <div>
            <Row style={{margin: "1rem"}}>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewDeadlineModal")}>Neue Deadline einführen</Button>
            </Row>

            {content()}

            <NewDeadlineModal
                show={modal.type === "NewDeadlineModal"}
                close={() => dispatchModal(null)}
                create={newDeadline}
                columns={columns}
                {...modal.state} />
        </div>
    );
}