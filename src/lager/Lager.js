import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import {LagerTable} from "./LagerTable";
import {EditProduktModal} from "./EditProduktModal";
import {EditKategorieModal} from "./EditKategorieModal";
import {useApi} from './ApiService';
import {NewKategorieModal} from './NewKategorieModal';
import {NewProduktModal} from './NewProduktModal';
import {deepAssign, deepClone} from './util';
import {EditEinheitenModal} from "./EditEinheitenModal";

export function Lager() {
    const columns = React.useMemo(
        () => [
            {
                id: 'expander',
                Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
                    <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? 'Icon' : 'Icon'}
              </span>
                ),
                accessor: 'icon',
                Cell: ({cell, row}) => {
                    return row.original.hasOwnProperty("produkte") ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${row.depth * 2}rem`,
                                }
                            })}
                        >

                <div {
                         ...{
                             style: {
                                 height: "1.5em",
                                 backgroundImage: "url(" + cell.value + ")",
                                 backgroundSize: "contain",
                                 backgroundRepeat: "no-repeat",
                                 backgroundPosition: "center"
                             }
                         }
                     } />
                </span>
                    ) : null;
                }
            },
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
        ],
        []
    );

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [einheiten, setEinheiten] = React.useState([]);
    const [originalData, setOriginalData] = React.useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    const api = useApi();

    // TODO: use something like https://github.com/rally25rs/react-use-timeout#useinterval or https://react-table.tanstack.com/docs/faq#how-can-i-use-the-table-state-to-fetch-new-data to update the data
    React.useEffect(
        () => {
            api.readKategorie()
                .then((r) => r.json())
                .then((r) => {
                        setOriginalData(deepClone(r));
                        setData(old => {
                            const n = r?._embedded?.kategorieRepresentationList;
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
        }, []
    )

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
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

    const persistProdukt = (rowId, patch) => {
        const [kategorieId, produktId] = rowId.split('.').map(e => parseInt(e));
        const {produkte, id: kategorie} = data[kategorieId];
        const produkt = produkte[produktId];
        const changedData = {...deepClone(produkt), kategorie};
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

    /**
     * Deletes the item on a given row
     */
    const deleteKategorieOrProdukt = (rowId) => {
        const old = data;
        const [kategorieId, produktId] = rowId.split('.').map(e => parseInt(e));
        const kategorie = old[kategorieId];

        // no produkt id: row identifies a kategorie => delete the kategorie
        if (produktId === undefined) {
            api.deleteKategorie(kategorie.id)
                .then(r => {
                    if (r.ok) {
                        old.splice(kategorieId, 1);
                        setSkipPageReset(true);
                        setData(deepClone(old));
                    } else {
                        r.text().then(text => console.log(`unable to delete: ${text}`));
                    }
                }, console.log);

            return;
        }

        // otherwise delete the produkt
        api.deleteProdukt(kategorie.produkte[produktId].id)
            .then(r => {
                if (r.ok) {
                    const [produkt] = kategorie.produkte.splice(produktId, 1);
                    setSkipPageReset(true);
                    setData(deepClone(old));
                } else {
                    r.text().then(text => console.log(`unable to delete: ${text}`));
                }
            }, console.log);
    }

    const newKategorie = ({icon, name}) => {
        (async function () {
            const response = await api.createKategorie(name, icon);
            if(response.ok) {
                setSkipPageReset(true);
                const newKategorie = await response.json();
                setData(old => deepClone([...old, newKategorie]));
            }
        })();
    };
    const newProdukt = (data1) => {
        (async function () {
            const response = await api.createProdukt(data1);
            if(response.ok) {
                const newProdukt = await response.json();
                setData(old => {
                    setSkipPageReset(true);
                    const kategorie = old.find(k => data1.kategorie === k.id);

                    // for some reason produkte are added twice, do not added it if it already exists
                    if (kategorie.produkte.find(p => newProdukt.id === p.id) === undefined) {
                        kategorie.produkte.push(newProdukt);
                    }
                    return deepClone(old);
                });
            }
        })();
    };

    const newEinheit = ({name}) => {
        (async function () {
            const response = await api.createEinheit(name);
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
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewKategorieModal")}>Kategorie erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("NewProduktModal")}>Produkt erstellen</Button>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => dispatchModal("EinheitenModal")}>Einheiten erstellen</Button>
            </Row>
            <div style={{overflowX: "auto", width: "100%"}}>
                {content()}
            </div>

            <EditProduktModal
                show={modal.type === "EditProduktModal"}
                close={() => dispatchModal(null)}
                updateMyData={updateMyData}
                persist={persistProdukt}
                deleteProdukt={deleteKategorieOrProdukt}
                einheiten={einheiten}
                rowId={modal.state.rowId}
                rowData={modal.state.rowData}/>

            <EditKategorieModal
                show={modal.type === "EditKategorieModal"}
                close={() => dispatchModal(null)}
                updateMyData={updateMyData}
                persist={persistKategorie}
                deleteKategorie={deleteKategorieOrProdukt}
                {...modal.state} />

            <NewKategorieModal
                show={modal.type === "NewKategorieModal"}
                close={() => dispatchModal(null)}
                create={newKategorie}
                {...modal.state} />

            <NewProduktModal
                show={modal.type === "NewProduktModal"}
                close={() => dispatchModal(null)}
                create={newProdukt}
                columns={columns}
                kategorien={data.map(k => ({id: k.id, name: k.name}))}
                einheiten={einheiten}
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
