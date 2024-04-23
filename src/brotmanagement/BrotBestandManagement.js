import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {deepAssign, deepClone} from '../util';
import {useApi} from '../ApiService';
import {BrotBestandTable} from "./BrotBestandTable";
import {EditBrotBestandModal} from "./EditBrotBestandModal";
import {NewBrotBestandModal} from './NewBrotBestandModal';
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function BrotBestandManagement() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Produkt',
                accessor: 'name',
            },
            {
                Header: 'Gewicht in g',
                accessor: 'gewicht',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
            {
                Header: 'Verfügbarkeit',
                accessor: 'verfuegbarkeit',
            },
            {
                Header: 'Preis in €',
                accessor: 'preis',
                Cell: ({ value }) => <NumberFormatComponent value={value} />,
            }
        ],[]
    );

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [skipPageReset, setSkipPageReset] = React.useState(false);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

    const api = useApi();

    React.useEffect(
        () => {
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
        }, [reducerValue]
    )

    const persistBrotBestand = (rowId, patch) => {
        const brotBestand = data[rowId];
        const changedData = {...deepClone(brotBestand)};
        for (const [accessor, {value}] of Object.entries(patch)) {
            deepAssign(accessor, changedData, value);
        }
        changedData.type = "brot";
        (async function () {
            const response = await api.updateBrotBestand(brotBestand.id, changedData)
            if(response.ok) {
                toast.success("Das Updaten des Brotbestandes \"" + brotBestand.name + "\" war erfolgreich.");
                forceUpdate();
            }
            else{
                toast.error("Das Updaten des Brotbestandes \"" + brotBestand.name + "\" war aufgrund einer fehlerhaften Eingabe nicht erfolgreich.");
            }
        })();
    }

    const deleteBrotBestand = (rowId) => {
        const brotBestand = data[rowId];
        (async function () {
            try {
                const response = await api.deleteBrotBestand(brotBestand.id);
                if (response.ok) {
                    setSkipPageReset(true);
                    const newData = [...data];
                    newData.splice(rowId, 1);
                    setData(newData);
                    toast.success("Das Löschen des Brotbestandes \"" + brotBestand.name + "\" war erfolgreich.");
                } else {
                    toast.error("Das Löschen des Brotbestandes \"" + brotBestand.name + "\" war nicht erfolgreich. Möglicherweise gibt es Bestellungen.");
                }
                forceUpdate();
            } catch (error) {
                console.error("Error deleting:", error);
                toast.error("Ein Fehler ist aufgetreten beim Löschen des Brotbestandes \"" + brotBestand.name + "\"");
            }
        })();
    }

    const newBrotBestand = (data1) => {
        (async function () {
            data1.type = "brot";
            const response = await api.createBrotBestand(data1);
            if(response.ok) {
                const newBrotBestand = await response.json();
                    toast.success("Das Erstellen des Brotbestandes \"" + data1.name + "\" war erfolgreich.");
                    setSkipPageReset(true);
                    setData(old => deepClone([...old, newBrotBestand]));
                    forceUpdate();
            }
            else{
                toast.error("Das Erstellen des Brotbestandes \"" + data1.name + "\" war nicht erfolgreich. Bitte versuchen Sie es erneut!");
            }
        })();
    };

    React.useEffect(() => {
        setSkipPageReset(false)
    }, [data]);

    const [modal, setModal] = React.useState({type: null, state: {}});

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
        switch (type) {
            case "EditBrotBestandModal":
                state = {
                    rowData: values,
                    rowId
                }
                break;
        }

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
            <BrotBestandTable
                columns={columns}
                data={data}
                skipPageReset={skipPageReset}
                dispatchModal={dispatchModal}/>
        );
    }

    return(
        <div>
            <Row style={{margin: "1rem"}}>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewBrotBestandModal")}>Brotbestand erstellen</Button>
            </Row>

            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
            </div>

            <EditBrotBestandModal
                show={modal.type === "EditBrotBestandModal"}
                close={() => dispatchModal(null)}
                persist={persistBrotBestand}
                deleteBrotBestand={deleteBrotBestand}
                rowId={modal.state.rowId}
                rowData={modal.state.rowData}/>

            <NewBrotBestandModal
                show={modal.type === "NewBrotBestandModal"}
                close={() => dispatchModal(null)}
                create={newBrotBestand}
                columns={columns}
                {...modal.state} />
            <ToastContainer />
        </div>
    )
}


