import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {deepAssign, deepClone} from '../util';
import {useApi} from '../ApiService';
import {FrischBestandTable} from "./FrischBestandTable";
import {EditFrischBestandModal} from "./EditFrischBestandModal";
import { NewFrischBestandModal } from './NewFrischBestandModal';
import {EditKategorieModal} from "../lager/EditKategorieModal";
import {EditEinheitenModal} from "../lager/EditEinheitenModal";
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function FrischBestandManagement() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Produkt',
                accessor: 'name',
            },
            {
                Header: 'Verfügbarkeit',
                accessor: 'verfuegbarkeit',
            },
            {
                Header: 'Land',
                accessor: 'herkunftsland',
            },
            {
                Header: 'Verband',
                accessor: 'verband',
            },
            {
                Header: 'Gebindegröße',
                accessor: 'gebindegroesse',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
            {
                Header: 'Einheit',
                accessor: 'einheit.name',
            },
            {
                Header: 'Kategorie',
                accessor: 'kategorie.name',
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
    const [einheiten, setEinheiten] = React.useState([]);
    const [kategorien, setKategorien] = React.useState([]);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

    const api = useApi();

    React.useEffect(
        () => {
            api.readFrischBestand()
                .then((r) => r.json())
                .then((r) => {
                        setData(old => {
                            let n = r?._embedded?.frischBestandRepresentationList;
                            return n === undefined ? old : n;

                        });
                        setIsLoading(false);
                    }
                );
            api.readEinheit()
                .then(r => r.json())
                .then(r => {
                    setEinheiten(old => {
                        const n = r?._embedded?.einheitRepresentationList;
                        return n === undefined ? old : n;
                    });
                });
            api.readKategorie()
                .then(r => r.json())
                .then(r => {
                    setKategorien(old => {
                        const n = r?._embedded?.kategorieRepresentationList;
                        return n === undefined ? old : n;
                    });
                });
        }, [reducerValue]
    )

    const persistFrischBestand = (rowId, patch) => {
        const frischBestand = data[rowId];
        const changedData = {...deepClone(frischBestand)};
        for (const [accessor, {value}] of Object.entries(patch)) {
            deepAssign(accessor, changedData, value);
        }
        changedData.type = "frisch";
        (async function () {
            const response = await api.updateFrischBestand(frischBestand.id, changedData)
            if(response.ok) {
                toast.success("Das Updaten des Frischbestandes \"" + frischBestand.name + "\" war erfolgreich.");
                forceUpdate();
            }
            else{
                toast.error("Das Updaten des Frischbestandes \"" + frischBestand.name + "\" war aufgrund einer fehlerhaften Eingabe nicht erfolgreich.");
            }
        })();
    }

    const deleteFrischBestand = (rowId) => {
        const frischBestand = data[rowId];
        const old = data;
        (async function () {
            try {
                const response = await api.deleteFrischBestand(old[rowId].id);
                if (response.ok) {
                    setSkipPageReset(true);
                    setData(deepClone(old));
                    toast.success("Das Löschen des Frischbestandes \"" + frischBestand.name + "\" war erfolgreich.");
                } else {
                    const text = await response.text();
                    toast.error("Das Löschen des Frischbestandes \"" + frischBestand.name + "\" war nicht erfolgreich. Möglicherweise gibt es Bestellungen.");
                }
                forceUpdate();
            } catch (error) {
                console.error("Error deleting:", error);
                toast.error("Ein Fehler ist aufgetreten beim Löschen des Frischbestandes \"" + frischBestand.name + "\"");
            }
        })();
    }    

    const newFrischBestand = (data1) => {
        (async function () {
            data1.type = "frisch";
            const response = await api.createFrischBestand(data1);
            if(response.ok) {
                const newFrischBestand = await response.json();
                    toast.success("Das Erstellen des Frischbestandes \"" + data1.name + "\" war erfolgreich.");
                    setSkipPageReset(true);
                    setData(old => deepClone([...old, newFrischBestand]));
                    forceUpdate();
            }
            else{
                toast.error("Das Erstellen des Frischbestandes \"" + data1.name + "\" war nicht erfolgreich. Bitte versuchen Sie es erneut!");
            }
        })();
    };

    const newKategorie = ({icon, name, mixable}) => {
        (async function () {
            const response = await api.createKategorie(name, icon, mixable);
            if(response.ok) {
                toast.success("Das Erstellen der Kategorie \"" + name + "\" war erfolgreich.");
                setSkipPageReset(true);
                const newKategorie = await response.json();
                setKategorien(old => [newKategorie, ...old]);
                forceUpdate();
            }
            else{
                toast.error("Das Erstellen der Kategorie \"" + name + "\" war nicht erfolgreich. Bitte versuchen Sie es erneut!");
            }
        })();
    };

    const deleteKategorie = ({id}) => {
        (async function () {
            const response = await api.deleteKategorie(id);
            if(response.ok) {
                toast.success("Das Löschen der Kategorie war erfolgreich.");
                setKategorien(old => old.filter(e => e.id !== id));
                forceUpdate();
            }
            else{
                toast.error("Das Löschen der Kategorie war nicht erfolgreich. Möglicherweise wird sie noch von einem FrischBestand oder einem Produkt verwendet.");
            }
        })();
    };

    const newEinheit = ({name}) => {
        (async function () {
            const response = await api.createEinheit(name);
            if(response.ok) {
                toast.success("Das Erstellen der Einheit \"" + name + "\" war erfolgreich.");
                const newEinheit = await response.json();
                setEinheiten(old => [newEinheit, ...old]);
                forceUpdate();
            }
            else{
                toast.error("Das Erstellen der Einheit \"" + name + "\" war nicht erfolgreich. Bitte versuchen Sie es erneut.");
            }
        })();
    };

    const deleteEinheit = ({id}) => {
        (async function () {
            const response = await api.deleteEinheit(id);
            if(response.ok) {
                toast.success("Das Löschen der Einheit war erfolgreich.");
                setEinheiten(old => old.filter(e => e.id !== id));
                forceUpdate();
            }
            else{
                toast.error("Das Löschen der Einheit war nicht erfolgreich. Möglicherweise wird sie noch von einem FrischBestand oder einem Produkt verwendet.");
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
            case "EditFrischBestandModal":
                state = {
                    rowData: values,
                    rowId
                }
                break;
            case "EditKategorieModal":
                let [rowData] = values.filter(({column}) => column.id === "name");
                state = {
                    value: rowData.value,
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
            <FrischBestandTable
                columns={columns}
                data={data}
                skipPageReset={skipPageReset}
                dispatchModal={dispatchModal}/>
        );
    }

    return(
        <div>
            <Row style={{margin: "1rem"}}>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("KategorienModal")}>Kategorie erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewFrischBestandModal")}>Frischbestand erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("EinheitenModal")}>Einheiten erstellen</Button>
            </Row>

            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
            </div>

            <EditFrischBestandModal
                show={modal.type === "EditFrischBestandModal"}
                close={() => dispatchModal(null)}
                persist={persistFrischBestand}
                deleteFrischBestand={deleteFrischBestand}
                einheiten={einheiten}
                kategorien={kategorien}
                rowId={modal.state.rowId}
                rowData={modal.state.rowData}/>

            <EditKategorieModal
                show={modal.type === "KategorienModal"}
                close={() => dispatchModal(null)}
                create={newKategorie}
                remove={deleteKategorie}
                kategorien={kategorien}
                {...modal.state} />

            <NewFrischBestandModal
                show={modal.type === "NewFrischBestandModal"}
                close={() => dispatchModal(null)}
                create={newFrischBestand}
                columns={columns}
                einheiten={einheiten}
                kategorien={kategorien}
                {...modal.state} />

            <EditEinheitenModal
                show={modal.type === "EinheitenModal"}
                close={() => dispatchModal(null)}
                create={newEinheit}
                remove={deleteEinheit}
                einheiten={einheiten}
                {...modal.state} />
            <ToastContainer />
        </div>
    )
}


