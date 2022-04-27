import React from "react";
import Button from "react-bootstrap/Button";
import {BestellungModal} from "../bestellung/BestellungModal";
import {deepAssign} from "../util";
import {IconInput} from "../lager/IconInput";

function defaultData(columns) {
    const capitalize = word => word.replace(/^\w/, c => c.toUpperCase());
    const getName = (accessor, humanName) => typeof humanName === "string" ? humanName : capitalize(accessor);

    const tableColumns = [...columns, {Header: "Kategorie", accessor: "kategorie"}];
    //console.log("table columns: " + JSON.stringify(tableColumns));
    const convert = ({Header: humanName, accessor}) => [accessor, {name: getName(accessor, humanName), value: ""}];
    const initial = Object.fromEntries(tableColumns.map(convert));
    //console.log("table columns after: " + JSON.stringify(initial));

    initial["name"].value = "FrischBestandame";
    initial["herkunftsland"].value = "DE";
    initial["gebindegroesse"].value = 0;
    initial["preis"].value = 0.0;

    return initial;
}

export function NewFrischBestandModal(props) {
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
        //console.log("save " + Object.entries(initial));
        //console.log("save " + JSON.stringify(initial));
        const result = {};
        for (const [accessor, {value}] of Object.entries(initial)) {
            //console.log("Intital Accesor, value: " + accessor + " / " + value);
            deepAssign(accessor, result, value);
        }
        for (const [accessor, {value}] of Object.entries(newData)) {
            //console.log("newdata Accesor, value: " + accessor + " / " + value);
            deepAssign(accessor, result, value);
        }

        if (!result.lagerbestand?.einheit?.id) {
            const find = props.einheiten[0];
            deepAssign("einheit.id", result, find.id);
        }

        // FIXME: support setting icon and kategorie (see added TODO items)
        const {icon,...supported} = result;
        //console.log("Supported: " + JSON.stringify(supported));
        props.create(supported);
        close();
    };

    const title = "FrischBestand erstellen";

    const mapper = ([accessor, {name, value}]) => {
        const onChange = function ({target: {value}}) {
            const changed = {};

            // edge case: dropdown value is the id of the einheit but accessor is the name of the einheit
            if (accessor === "einheit.name") {
                changed["einheit.id"] = {name, value};
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

        if (accessor === "icon") {
            // FIXME: icons are not supported by the API yet
            return;
            // noinspection UnreachableCodeJS
            const setIcon = icon => setNewData(prev => ({...prev, icon}));
            edit = <div>
                <IconInput setIcon={setIcon}/>
            </div>;
        // } else if (accessor === "kategorie") {
        //     edit = (
        //         <div>
        //             <select onChange={onChange} style={{width: "100%"}}>
        //                 {props.kategorien.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
        //             </select>
        //         </div>
        //     );
        } else if (accessor === "einheit.name") {
            edit = (
                <div>
                    <select onChange={onChange} style={{width: "100%"}}>
                        {props.einheiten.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
                    </select>
                </div>
            );
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
        .filter(([a, {}])=> a !== "einheit.id")
        .map(mapper);

    const footer = <>
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
