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

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [einheiten, setEinheiten] = React.useState([]);
    const [kategorien, setKategorien] = React.useState([]);
    const [skipPageReset, setSkipPageReset] = React.useState(false);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

    const api = useApi();

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

    const persistProdukt = (rowId, patch) => {
        const produkt = data[rowId]
        const changedData = {...deepClone(produkt)};
        for (const [accessor, {value}] of Object.entries(patch)) {
            deepAssign(accessor, changedData, value);
        }
        (async function () {
            const response = await api.updateProdukt(produkt.id, changedData);
            if(response.ok){
                forceUpdate();
            }
            else{alert("Das Updaten des Produktes war aufgrund einer fehlerhaften Eingabe nicht erfolgreich.");}
        })();
    };

    const newKategorie = ({icon, name}) => {
        (async function () {
            const response = await api.createKategorie(name, icon);
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

    const deleteProdukt = (rowId) => {
        const old = data;
        (async function () {
            const response = await api.deleteProdukt(old[rowId].id)
                .then(r => {
                    if (r.ok) {
                        //const [produkt] = kategorie.produkte.splice(produktId, 1);
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
            forceUpdate();
        })();
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
            else{alert("Das Erstellen eines Produktes war nicht erfolgreich. Bitte versuchen Sie es erneut!")}
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
            else{alert("Das Erstellen einer Einheit war nicht erfolgreich. Bitte versuchen Sie es erneut!");}
        })();
    };

    const deleteEinheit = ({id}) => {
        (async function () {
            const response = await api.deleteEinheit(id);
            if(response.ok) {
                setEinheiten(old => old.filter(e => e.id !== id));
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
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => window.open("http://152.53.32.66:8080/externeliste")}>Externe Einkaufsliste</Button>
            </Row>
            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
            </div>

            <EditProduktModal
                show={modal.type === "EditProduktModal"}
                close={() => dispatchModal(null)}
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
