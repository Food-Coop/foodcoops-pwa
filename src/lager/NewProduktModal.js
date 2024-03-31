import React from "react";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";
import {deepAssign} from "../util";
import {IconInput} from "./IconInput";

function defaultData(columns) {
    const capitalize = word => word.replace(/^\w/, c => c.toUpperCase());
    const getName = (accessor, humanName) => typeof humanName === "string" ? humanName : capitalize(accessor);

    const convert = ({Header: humanName, accessor}) => [accessor, {name: getName(accessor, humanName), value: ""}];
    const initial = Object.fromEntries(columns.map(convert));

    initial["name"].value = "Produktname";
    initial["lagerbestand.istLagerbestand"].value = 0.0;
    initial["lagerbestand.sollLagerbestand"].value = 0.0;

    return initial;
}

export function NewProduktModal(props) {
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

        if (!result.lagerbestand?.einheit?.id) {
            const find = props.einheiten[0];
            deepAssign("lagerbestand.einheit.id", result, find.id);
        }
        if (!result.kategorie?.id) {
            const find = props.kategorien[0];
            let kategorie = {};
            deepAssign("id", kategorie, find.id);
            deepAssign("name", kategorie, find.name);
            deepAssign("kategorie", result, kategorie);
        }
        props.create(result);
        close();
    };

    const title = "Produkt erstellen";

    const mapper = ([accessor, {name, value}]) => {
        const onChange = function ({target: {value}}) {
            const changed = {};

            // edge case: dropdown value is the id of the einheit but accessor is the name of the einheit
            if (accessor === "lagerbestand.einheit.name") {
                changed["lagerbestand.einheit.id"] = {name, value};
            } else {
                changed[accessor] = {name, value};
            }

            return setNewData(prev => ({...prev, ...changed}));
        };
        let edit = <input
                name={name}
                value={value}
                onChange={onChange}
                style={{width: "100%"}}/>;

        if (accessor === "kategorie.name") {
            edit = (
                <div>
                    <select onChange={onChange} style={{width: "100%"}}>
                        {props.kategorien.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
                    </select>
                </div>
            );
        } else if (accessor === "lagerbestand.einheit.name") {
            edit = (
                <div>
                    <select onChange={onChange} style={{width: "100%"}}>
                        {props.einheiten.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
                    </select>
                </div>
            );
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
                {edit}
            </td>
        </tr>;
    };
    const body = Object.entries(initial)
        .filter(([a, {}])=> a !== "lagerbestand.einheit.id")
        .filter(([a, {}])=> a !== "kategorie.id")
        .map(mapper);

    const footer = <>
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
