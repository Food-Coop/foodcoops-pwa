import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import { useApi } from '../ApiService';
import {deepAssign, deepClone} from '../util';
import { DeadlineTable } from './DeadlineTable';
import { NewDeadlineModal } from './NewDeadlineModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            }
        ]
    );

    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [skipPageReset, setSkipPageReset] = React.useState(false);
    const [modal, setModal] = React.useState({type: null, state: {}});
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

    const api = useApi();
    
    React.useEffect(() => {
        api.readLastDeadline()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch last deadline.');
            })
            .then((data) => {
                const deadline = {
                    id: data.id,
                    weekday: data.weekday,
                    time: data.time
                };
                setData([deadline]);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching last deadline:', error);
                setIsLoading(false);
            });
    }, [reducerValue]);
    

    const newDeadline = (data1) => {
        let datum = new Date();
        data1.time = `${data1.time}:00`;
        deepAssign("datum", data1, datum);
        (async function () {
            const response = await api.createDeadline(data1);
            if(response.ok) {
                toast.success("Die Deadline wurde erfolgreich erstellt!");
                const newDeadline = await response.json();
                    setSkipPageReset(true);
                    setData(old => deepClone([...old, newDeadline]));
                forceUpdate();
            } else {
                toast.error("Fehler beim Erstellen der Deadline. Bitte versuchen Sie es erneut.");
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
            <ToastContainer />
        </div>
    );
}