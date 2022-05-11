import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {FrischBestandModal} from "./FrischBestandModal";

export function EditFrischBestandModal(props) {
    const rowData = props.rowData || [];
    const [newData, setNewData] = React.useState({});

    const close = () => {
        props.close();
        setNewData({});
    };

    const save = () => {
        let idVisited = false;
        for (const [accessor, {value}] of Object.entries(newData)) {
            if (accessor === "einheit.id") {
                idVisited = true;
                const find = props.einheiten.find(item => item.id === value);
                props.updateMyData(props.rowId, "einheit.name", find.name);
                continue;
            }
            if (accessor === "kategorie.id") {
                idVisited = true;
                const find = props.kategorien.find(item => item.id === value);
                props.updateMyData(props.rowId, "kategorie.name", find.name);
                continue;
            }
            if (accessor === "verfuegbarkeit"){
                console.log(JSON.stringify(newData))
                const find = newData.verfuegbarkeit.value;
                if(find != true || find != false){
                    alert("Bitte die Verfügbarkeit mit true oder false angeben");
                }
                break;
            }
            props.updateMyData(props.rowId, accessor, value);
        }

        props.persist(props.rowId, newData);

        close();
    };

    const remove = () => {
        console.log("Remove: " + props.rowId);
        props.deleteFrischBestand(props.rowId);
        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };


//{props.einheiten.map(({name, id}, i) => (<option key={i} value={id}>{name}</option>))}
//     const testfunc = (name, id, i) => {
//         console.log("This: " + this);
//         return(<option key={i} value={id}>{name}</option>)
//     }

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
            return <tr key={accessor}>
            <td>
                <label style={{margin: 0}}>{name}:</label>
            </td>
            <td>
                <input
                    name={name}
                    placeholder="true/false"
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
