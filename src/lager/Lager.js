import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import {LagerTable} from "./LagerTable";
import {EditProduktModal} from "./EditProduktModal";
import {EditKategorieModal} from "./EditKategorieModal";
import {useApi} from '../ApiService';
import {NewProduktModal} from './NewProduktModal';
import {deepAssign, deepClone} from '../util';
import {EditEinheitenModal} from "./EditEinheitenModal";

export function Lager() {

    /* Creates Columns,
    first part selects image and displays it
     */
    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Ist Lagerbestand',
                accessor: 'lagerbestand.istLagerbestand',
            },
            {
                Header: 'Soll Lagerbestand',
                accessor: 'lagerbestand.sollLagerbestand',
            },
            {
                Header: 'Einheit',
                accessor: 'lagerbestand.einheit.name',
            },
            {
                Header: 'Kategorie',
                accessor: 'kategorie.name',
            },
        ],
        []
    );

    //states with their update function
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [einheiten, setEinheiten] = React.useState([]);
    const [kategorien, setKategorien] = React.useState([]);
    const [skipPageReset, setSkipPageReset] = React.useState(false);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);



    const api = useApi();

    // TODO: use something like https://github.com/rally25rs/react-use-timeout#useinterval or https://react-table.tanstack.com/docs/faq#how-can-i-use-the-table-state-to-fetch-new-data to update the data
    React.useEffect(
        () => {
            api.readProdukt()
                .then((r) => r.json())
                .then((r) => {
                        setData(old => {
                            const n = r?._embedded?.produktRepresentationList;
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

    //alert(typeof(kategorien));
    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowId, columnId, value) => {
        console.log("rowId, columnId, value " + rowId + "," + columnId + "," + value);
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

    const persistProdukt = (rowId, patch) => {

        const produkt = data[rowId]
        const changedData = {...deepClone(produkt)};

        for (const [accessor, {value}] of Object.entries(patch)) {
            deepAssign(accessor, changedData, value);
        }

        api.updateProdukt(produkt.id, changedData);
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

    /**
     * Deletes the item on a given row
     */
    const deleteProdukt = (rowId) => {
        const old = data;
        // const [kategorieId, produktId] = rowId.split('.').map(e => parseInt(e));
        // const kategorie = old[kategorieId];
        api.deleteProdukt(old[rowId].id)
            .then(r => {
                if (r.ok) {
                    //const [produkt] = kategorie.produkte.splice(produktId, 1);
                    setSkipPageReset(true);
                    setData(deepClone(old));
                } else {
                    r.text().then(text => console.log(`unable to delete: ${text}`));
                }
            }, console.log);
    }


    const newProdukt = (data1) => {
        console.log("Data1: " + JSON.stringify(data1));
        (async function () {
            const response = await api.createProdukt(data1);
            if(response.ok) {
                const newProdukt = await response.json();
                    setSkipPageReset(true);
                    setData(old => deepClone([...old, newProdukt]));
                    forceUpdate();
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

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
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
            case "EditProduktModal":
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
            <LagerTable
                columns={columns}
                data={data}
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}
                dispatchModal={dispatchModal}/>
        );
    }

    return (
        <div>
            <Row style={{margin: "1rem"}}>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("KategorienModal")}>Kategorie erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewProduktModal")}>Produkt erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("EinheitenModal")}>Einheiten erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => window.open("http://localhost:8080/externeliste")}>Externe Einkaufsliste</Button>
            </Row>
            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
            </div>

            <EditProduktModal
                show={modal.type === "EditProduktModal"}
                close={() => dispatchModal(null)}
                updateMyData={updateMyData}
                persist={persistProdukt}
                deleteProdukt={deleteProdukt}
                einheiten={einheiten}
                kategorien={kategorien}
                rowId={modal.state.rowId}
                rowData={modal.state.rowData}/>

            <NewProduktModal
                show={modal.type === "NewProduktModal"}
                close={() => dispatchModal(null)}
                create={newProdukt}
                columns={columns}
                kategorien={kategorien}
                einheiten={einheiten}
                {...modal.state} />

            <EditEinheitenModal
                show={modal.type === "EinheitenModal"}
                close={() => dispatchModal(null)}
                create={newEinheit}
                remove={deleteEinheit}
                einheiten={einheiten}
                {...modal.state} />

            <EditKategorieModal
                show={modal.type === "KategorienModal"}
                close={() => dispatchModal(null)}
                create={newKategorie}
                remove={deleteKategorie}
                kategorien={kategorien}
                {...modal.state} />
        </div>
    )
}
