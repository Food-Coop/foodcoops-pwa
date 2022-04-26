import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {BestellungModal} from "./BestellungModal";

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
            props.updateMyData(props.rowId, accessor, value);
        }

        if (!idVisited) {
            const find = props.einheiten[0];
            props.updateMyData(props.rowId, "einheit.name", find.name);
            newData["einheit.id"] = {name:"Id", value: find.id};
        }

        props.persist(props.rowId, newData);

        close();
    };

    const remove = () => {
        props.deleteFrischBestand(props.rowId);
        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .slice(1)
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    const title = "FrischBestand bearbeiten";

    const mapper = ([accessor, {name, value}]) => {
        if (accessor === "einheit.name") {
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
                            {props.einheiten.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
                        </select>
                    </div>
                </td>
            </tr>
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
        .map(mapper);

    const footer = <>
        <Button variant="danger" onClick={remove}>FrischBestand löschen</Button>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>;

    return (
        <BestellungModal
            title={title}
            body={body}
            footer={footer}
            show={props.show}
            hide={close}
            parentProps={props}
        />
    );
}
