import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {BrotBestandModal} from "./BrotBestandModal";
import NumberFormatComponent from "../logic/NumberFormatComponent";

export function EditBrotBestandModal(props) {
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
        props.deleteBrotBestand(props.rowId);
        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    const title = "Brotprodukt bearbeiten";

    const mapper = ([accessor, {name, value}]) => {
        if (accessor === "verfuegbarkeit") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="checkbox"
                        checked={value}
                        onChange={({target: {checked}}) => {
                            const changed = {};
                            changed[accessor] = {name, value: checked};
                            setNewData(prev => ({...prev, ...changed}));
                        }}
                    />
                </td>
            </tr>;
        }
        if (accessor === "preis") {
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
        if (accessor === "gewicht") {
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
        .map(mapper);

    const footer = <>
        <Button variant="danger" onClick={remove}>Produkt löschen</Button>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>;

    return (
        <BrotBestandModal
            title={title}
            body={body}
            footer={footer}
            show={props.show}
            hide={close}
            parentProps={props}
        />
    );
}
