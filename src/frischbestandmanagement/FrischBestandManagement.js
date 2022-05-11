import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import {deepAssign, deepClone} from '../util';
import {useApi} from '../ApiService';
import {FrischBestandTable} from "./FrischBestandTable";
import {EditFrischBestandModal} from "./EditFrischBestandModal";
import { NewFrischBestandModal } from './NewFrischBestandModal';
import {EditKategorieModal} from "../lager/EditKategorieModal";
import {EditEinheitenModal} from "../lager/EditEinheitenModal";


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
                Header: 'Gebindegröße',
                accessor: 'gebindegroesse',
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
                Header: 'Preis',
                accessor: 'preis',
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
        (async function () {
            const response = await api.updateFrischBestand(frischBestand.id, changedData)
            if(response.ok) {
                forceUpdate();
            }
            else{
                alert("Das Updaten des Frischbestandes war aufgrund einer fehlerhaften Eingabe nicht erfolgreich.");
            }
        })();
    }

    const deleteFrischBestand = (rowId) => {
        const old = data;
        (async function () {
            const response = await api.deleteFrischBestand(old[rowId].id)
                .then(r => {
                    if (r.ok) {
                    // const [produkt] = kategorie.produkte.splice(produktId, 1);
                        setSkipPageReset(true);
                        setData(deepClone(old));
                    } else {
                        r.text().then(text => console.log(`unable to delete: ${text}`));
                    }
                }, console.log);
            if(response.ok) {
                forceUpdate();
            }
            else{
                alert("Das Löschen des Frischbestandes war nicht erfolgreich. Möglicherweise gibt es Bestellungen.");
            }
        })();
    }

    const newFrischBestand = (data1) => {
        (async function () {
            const response = await api.createFrischBestand(data1);
            if(response.ok) {
                const newFrischBestand = await response.json();
                    setSkipPageReset(true);
                    setData(old => deepClone([...old, newFrischBestand]));
                    forceUpdate();
            }
            else{alert("Das Erstellen eines FrischBestandes war nicht erfolgreich. Bitte versuchen Sie es erneut!")}
        })();
    };

    const newKategorie = ({icon, name}) => {
        (async function () {
            const response = await api.createKategorie(name, icon);
            //alert(JSON.stringify(response));
            if(response.ok) {
                setSkipPageReset(true);
                const newKategorie = await response.json();
                setKategorien(old => [newKategorie, ...old]);
                forceUpdate();
            }
            else{alert("Das Erstellen einer Kategorie war nicht erfolgreich. Bitte versuchen Sie es erneut!");}
        })();
    };

    const deleteKategorie = ({id}) => {
        (async function () {
            const response = await api.deleteKategorie(id);
            if(response.ok) {
                setKategorien(old => old.filter(e => e.id !== id));
                forceUpdate();
            }
            else{alert("Das Löschen der Kategorie war nicht erfolgreich. Möglicherweise wird sie noch von einem FrischBestand oder einem Produkt verwendet.");}
        })();
    };

    const newEinheit = ({name}) => {
        (async function () {
            const response = await api.createEinheit(name);
            //alert(response);
            if(response.ok) {
                const newEinheit = await response.json();
                setEinheiten(old => [newEinheit, ...old]);
                forceUpdate();
            }
            else{alert("Das Erstellen einer Einheit war nicht erfolgreich. Bitte versuchen Sie es erneut!");}
        })();
    };

    const deleteEinheit = ({id}) => {
        (async function () {
            const response = await api.deleteEinheit(id);
            if(response.ok) {
                setEinheiten(old => old.filter(e => e.id !== id));
                forceUpdate();
            }
            else{alert("Das Löschen der Einheit war nicht erfolgreich. Möglicherweise wird sie noch von einem FrischBestand oder einem Produkt verwendet.");}
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
        </div>
    )
}


