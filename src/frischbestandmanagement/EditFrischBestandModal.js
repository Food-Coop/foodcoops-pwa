import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {FrischBestandModal} from "./FrischBestandModal";

export function EditFrischBestandModal(props) {
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
        props.deleteFrischBestand(props.rowId);
        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    const title = "FrischBestand bearbeiten";

    const mapper = ([accessor, {name, value}]) => {
        if (accessor === "einheit.name") {
            const selectedEinheit = value;
            const onChange = function ({target: {value}}) {
                const changed = {};
                changed["einheit.id"] = {name, value};
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
        }
        if (accessor === "verfuegbarkeit") {
            if(value === 1){
                return <tr key={accessor}>
                    <td>
                        <label style={{margin: 0}}>{name}:</label>
                    </td>
                    <td>
                        <input
                            name={name}
                            type="checkbox"
                            checked
                            onClick={function ({target: {value}}) {
                                value = false;
                                const changed = {};
                                changed[accessor] = {name, value};
                                return setNewData(prev => ({...prev, ...changed}));
                            }}/>
                    </td>
                </tr>;
            }
            else{
                return <tr key={accessor}>
                    <td>
                        <label style={{margin: 0}}>{name}:</label>
                    </td>
                    <td>
                        <input
                            name={name}
                            type="checkbox"
                            onChange={function ({target: {value}}) {
                                value = true;
                                const changed = {};
                                changed[accessor] = {name, value};
                                return setNewData(prev => ({...prev, ...changed}));
                            }}/>
                    </td>
                </tr>;
            }
            
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
        .filter(([a, {}])=> a !== "einheit.id")
        .filter(([a, {}])=> a !== "kategorie.id")
        .map(mapper);

    const footer = <>
        <Button variant="danger" onClick={remove}>FrischBestand löschen</Button>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>;

    return (
        <FrischBestandModal
            title={title}
            body={body}
            footer={footer}
            show={props.show}
            hide={close}
            parentProps={props}
        />
    );
}
