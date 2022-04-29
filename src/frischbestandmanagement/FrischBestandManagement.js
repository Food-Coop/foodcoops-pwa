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
import {NewKategorieModal} from '../lager/NewKategorieModal';
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

    const persistFrischBestand = (rowId, patch) => {
        const frischBestand = data[rowId];
        const changedData = {...deepClone(frischBestand)};
        for (const [accessor, {value}] of Object.entries(patch)) {
            deepAssign(accessor, changedData, value);
        }
        console.log("CD:  " + JSON.stringify(changedData))
        api.updateFrischBestand(frischBestand.id, changedData);
    };

    const deleteFrischBestand = (rowId) => {
        const old = data;
        api.deleteFrischBestand(old[rowId].id)
            .then(r => {
                if (r.ok) {
                   // const [produkt] = kategorie.produkte.splice(produktId, 1);
                    setSkipPageReset(true);
                    setData(deepClone(old));
                } else {
                    r.text().then(text => console.log(`unable to delete: ${text}`));
                }
            }, console.log);
    }

    const newFrischBestand = (data1) => {
        (async function () {
            const response = await api.createFrischBestand(data1);
            if(response.ok) {
                const newFrischBestand = await response.json();
                    setSkipPageReset(true);
                    setData(old => deepClone([...old, newFrischBestand]));
            }
        })();
    };

    const persistKategorie = (rowId, patch) => {
        const [kategorieId, produktId] = rowId.split('.').map(e => parseInt(e));
        const kategorie = data[kategorieId];

        const {name} = patch;
        if (name) {
            api.updateKategorie(kategorie.id, name);
        }
    };

    const newKategorie = ({icon, name}) => {
        (async function () {
            const response = await api.createKategorie(name, icon);
            //alert(JSON.stringify(response));
            if(response.ok) {
                setSkipPageReset(true);
                const newKategorie = await response.json();
                setKategorien(old => [newKategorie, ...old]);
            }
        })();
    };

    const deleteKategorie = ({id}) => {
        (async function () {
            const response = await api.deleteKategorie(id);
            if(response.ok) {
                setKategorien(old => old.filter(e => e.id !== id));
            }
        })();
    };

    const newEinheit = ({name}) => {
        (async function () {
            const response = await api.createEinheit(name);
            //alert(response);
            if(response.ok) {
                const newEinheit = await response.json();
                setEinheiten(old => [newEinheit, ...old]);
            }
        })();
    };

    const deleteEinheit = ({id}) => {
        (async function () {
            const response = await api.deleteEinheit(id);
            if(response.ok) {
                setEinheiten(old => old.filter(e => e.id !== id));
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
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}
                dispatchModal={dispatchModal}/>
        );
    }

    return(
        <div>
            <Row style={{margin: "1rem"}}>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewKategorieModal")}>Kategorie erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewFrischBestandModal")}>Frischbestand erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("EinheitenModal")}>Einheiten erstellen</Button>
            </Row>

            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
            </div>

            <EditFrischBestandModal
                show={modal.type === "EditFrischBestandModal"}
                close={() => dispatchModal(null)}
                updateMyData={updateMyData}
                persist={persistFrischBestand}
                deleteFrischBestand={deleteFrischBestand}
                einheiten={einheiten}
                kategorien={kategorien}
                rowId={modal.state.rowId}
                rowData={modal.state.rowData}/>

            <EditKategorieModal
                show={modal.type === "EditKategorieModal"}
                close={() => dispatchModal(null)}
                updateMyData={updateMyData}
                persist={persistKategorie}
                deleteKategorie={deleteKategorie}
                {...modal.state} />

            <NewKategorieModal
                show={modal.type === "NewKategorieModal"}
                close={() => dispatchModal(null)}
                create={newKategorie}
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


