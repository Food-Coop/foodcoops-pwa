import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";

export function EditProduktModal(props) {
    const rowData = props.rowData || [];
    const [newData, setNewData] = React.useState({});    
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

    const close = () => {
        props.close();
        setNewData({});
    };

    const save = () => {
        props.persist(props.rowId, newData);
        forceUpdate();
        close();
    };

    const remove = () => {
        props.deleteProdukt(props.rowId);
        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    const title = "Produkt bearbeiten";

    const mapper = ([accessor, {name, value}]) => {
        if (accessor === "lagerbestand.einheit.name") {
            const selectedEinheit = value;
            const onChange = function ({target: {value}}) {
                const changed = {};
                changed["lagerbestand.einheit.id"] = {name, value};
                return setNewData(prev => ({...prev, ...changed}));
            };
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <div>
                        <select onChange={onChange} style={{width: "100%"}}>
                            {props.einheiten.map(function({name, id}, i){
                                if (selectedEinheit== name){
                                    return (<option key={i} selected="selected" value={id}>{name}</option>)
                                }
                                return ((<option key={i} value={id}>{name}</option>));
                            },selectedEinheit)}
                        </select>
                    </div>
                </td>
            </tr>
        }
        if (accessor === "kategorie.name") {
            const selectedKategorie = value;
            const onChange = function ({target: {value}}) {
                const changed = {};
                changed["kategorie.id"] = {name, value};
                return setNewData(prev => ({...prev, ...changed}));
            };
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <div>
                        <select onChange={onChange} style={{width: "100%"}}>
                            {props.kategorien.map(function({name, id}, i){
                                if (selectedKategorie == name){
                                    return (<option key={i} selected="selected" value={id}>{name}</option>)
                                }
                                return ((<option key={i} value={id}>{name}</option>));
                            },selectedKategorie)}
                        </select>
                    </div>
                </td>
            </tr>
        } else if (accessor === "preis") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        min="0"
                        type="number"
                        value={value}
                        onChange={function ({target: {value}}) {
                            const changed = {};
                            changed[accessor] = {name, value};
                            return setNewData(prev => ({...prev, ...changed}));
                        }}/>
                </td>
            </tr>;
        } else if (accessor === "lagerbestand.sollLagerbestand") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="number"
                        min="0"
                        value={value}
                        onChange={function ({target: {value}}) {
                            const changed = {};
                            changed[accessor] = {name, value};
                            return setNewData(prev => ({...prev, ...changed}));
                        }}/>
                </td>
            </tr>;
        } else if (accessor === "lagerbestand.istLagerbestand") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="number"
                        min="0"
                        value={value}
                        onChange={function ({target: {value}}) {
                            const changed = {};
                            changed[accessor] = {name, value};
                            return setNewData(prev => ({...prev, ...changed}));
                        }}/>
                </td>
            </tr>;
        }
        return <tr key={accessor}>
            <td>
                <label style={{margin: 0}}>{name}:</label>
            </td>
            <td>
                <input
                    name={name}
                    value={value}
                    onChange={function ({target: {value}}) {
                        const changed = {};
                        changed[accessor] = {name, value};
                        return setNewData(prev => ({...prev, ...changed}));
                    }}/>
            </td>
        </tr>;
    };
    const body = Object.entries(merged)
        .filter(([a, {}])=> a !== "lagerbestand.einheit.id")
        .filter(([a, {}])=> a !== "kategorie.id")
        .map(mapper);

    const footer = <>
        <Button variant="danger" onClick={remove}>Produkt löschen</Button>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>;

    return (
        <LagerModal
            title={title}
            body={body}
            footer={footer}
            show={props.show}
            hide={close}
            parentProps={props}
        />
    );
}
