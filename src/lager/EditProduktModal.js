import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";

export function EditProduktModal(props) {
    const rowData = props.rowData || [];
    const [newData, setNewData] = React.useState({});
    const close = () => {
        props.close();
        setNewData({});
    };




    const save = () => {
        //console.log("Kategorieprops: " + JSON.stringify(props));
        let idVisited = false;
        for (const [accessor, {value}] of Object.entries(newData)) {
            if (accessor === "lagerbestand.einheit.id") {
                idVisited = true;
                const find = props.einheiten.find(item => item.id === value);
                props.updateMyData(props.rowId, "lagerbestand.einheit.name", find.name);
                continue;
            }
            props.updateMyData(props.rowId, accessor, value);
        }

        if (!idVisited) {
            const find = props.einheiten[0];
            props.updateMyData(props.rowId, "lagerbestand.einheit.name", find.name);
            newData["lagerbestand.einheit.id"] = {name:"Id", value: find.id};
        }

        //console.log("newData: " + JSON.stringify(new
        props.persist(props.rowId, newData);

        close();
    };

    const remove = () => {
        props.deleteProdukt(props.rowId);
        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .slice(1)
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    const title = "Produkt bearbeiten";

    const mapper = ([accessor, {name, value}]) => {
        if (accessor === "lagerbestand.einheit.name") {
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
                            {props.einheiten.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
                        </select>
                    </div>
                </td>
            </tr>
        }
        if (accessor === "kategorie.name") {
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
                            {props.kategorien.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
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
