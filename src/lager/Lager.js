import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {LagerTable} from "./LagerTable";
import {EditProduktModal} from "./EditProduktModal";
import {EditKategorieModal} from "./EditKategorieModal";
import {useApi} from '../ApiService';
import {NewProduktModal} from './NewProduktModal';
import {deepAssign, deepClone} from '../util';
import {EditEinheitenModal} from "./EditEinheitenModal";
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function Lager() {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Ist Lagerbestand',
                accessor: 'lagerbestand.istLagerbestand',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
            {
                Header: 'Soll Lagerbestand',
                accessor: 'lagerbestand.sollLagerbestand',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
            {
                Header: 'Einheit',
                accessor: 'lagerbestand.einheit.name',
            },
            {
                Header: 'Kategorie',
                accessor: 'kategorie.name',
            },
            {
                Header: 'Preis in €',
                accessor: 'preis',
                Cell: ({ value }) => <NumberFormatComponent value={value}/>,
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
                toast.success("Das Updaten des Produktes \"" + produkt.name + "\" war erfolgreich.");
                forceUpdate();
            }
            else{
                toast.error("Das Updaten des Produktes \"" + produkt.name + "\" war aufgrund einer fehlerhaften Eingabe nicht erfolgreich.");
            }
        })();
    };

    const newKategorie = ({icon, name}) => {
        (async function () {
            const response = await api.createKategorie(name, icon);
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

    const deleteProdukt = (rowId) => {
        const produkt = data[rowId];
        const old = data;
        (async function () {
            try {
                const response = await api.deleteProdukt(old[rowId].id);
                if (response.ok) {
                    setSkipPageReset(true);
                    setData(deepClone(old));
                    toast.success("Das Löschen des Produktes \"" + produkt.name + "\" war erfolgreich.");
                } else {
                    toast.error("Das Löschen des Produktes \"" + produkt.name + "\" war nicht erfolgreich. Bitte versuchen Sie es erneut.");
                }
                forceUpdate();
            } catch (error) {
                toast.error("Ein Fehler ist aufgetreten beim Löschen des Produktes \"" + produkt.name + "\"");
            }
        } )();   
    }

    const newProdukt = (data1) => {
        (async function () {
            const response = await api.createProdukt(data1);
            if(response.ok) {
                toast.success("Das Erstellen des Produktes \"" + data1.name + "\" war erfolgreich.");
                const newProdukt = await response.json();
                setSkipPageReset(true);
                setData(old => deepClone([...old, newProdukt]));
                forceUpdate();
            }
            else{
                toast.error("Das Erstellen des Produktes \"" + data1.name + "\" war nicht erfolgreich. Bitte versuchen Sie es erneut!");
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
            <ToastContainer />
        </div>
    )
}
