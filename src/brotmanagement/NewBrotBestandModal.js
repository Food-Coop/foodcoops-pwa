import React from "react";
import Button from "react-bootstrap/Button";
import {BrotBestandModal} from "./BrotBestandModal";
import {deepAssign} from "../util";
import '../Dialog.css';

function defaultData(columns) {
    const capitalize = word => word.replace(/^\w/, c => c.toUpperCase());
    const getName = (accessor, humanName) => typeof humanName === "string" ? humanName : capitalize(accessor);

    const convert = ({Header: humanName, accessor}) => [accessor, {name: getName(accessor, humanName), value: ""}];
    const initial = Object.fromEntries(columns.map(convert));

    initial["name"].value = "Name";
    initial["verfuegbarkeit"].value = 1;
    initial["preis"].value = 0;

    return initial;
}

export function NewBrotBestandModal(props) {
    const [newData, setNewData] = React.useState({});

    const initial = {
        ...defaultData(props.columns),
        ...newData
    };

    const close = () => {
        props.close();
        setNewData({});
    };

    const save = () => {
        const result = {};
        for (const [accessor, {value}] of Object.entries(initial)) {
            deepAssign(accessor, result, value);
        }
        for (const [accessor, {value}] of Object.entries(newData)) {
            deepAssign(accessor, result, value);
        }
        props.create(result);
        close();
    };

    const title = "BrotBestand erstellen";

    const mapper = ([accessor, {name, value}]) => {
        const onChange = function ({target: {value}}) {
            const changed = {};
            changed[accessor] = {name, value};

            return setNewData(prev => ({...prev, ...changed}));
        };
        let edit = <input
                name={name}
                value={value}
                onChange={onChange}
                style={{width: "100%"}}/>;
        if (accessor === "verfuegbarkeit") {
            edit = <input
                type="checkbox"
                checked={value === 1}
                onChange={e => onChange({ target: { value: e.target.checked ? 1 : 0 } })}
            />;   
        } else if (accessor === "preis") {
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
        } else if (accessor === "gewicht") {
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
                {edit}
            </td>
        </tr>;
    };
    const body = Object.entries(initial)
        .map(mapper);

    const footer = <>
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
