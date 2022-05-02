import React from "react";
import Button from "react-bootstrap/Button";
import {deepAssign} from "../util";
import { DeadlineModal } from "./DeadlineModal";

function defaultData(columns) {
    const capitalize = word => word.replace(/^\w/, c => c.toUpperCase());
    const getName = (accessor, humanName) => typeof humanName === "string" ? humanName : capitalize(accessor);

    //console.log("table columns: " + JSON.stringify(tableColumns));
    const convert = ({Header: humanName, accessor}) => [accessor, {name: getName(accessor, humanName), value: ""}];
    const initial = Object.fromEntries(columns.map(convert));
    //console.log("table columns after: " + JSON.stringify(initial));

    initial["weekday"].value = "Montag";
    initial["time"].value = "23:59:59";

    return initial;
}

export function NewDeadlineModal(props) {
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
        if (!result.weekday) {
            //Diese if-Bedingung wird benötigt, damit das Ergebnis des Select mit in die Datenbank übernommen wird!!!
        }
        props.create(result);
        close();
    };

    const title = "Deadline erstellen";

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

        if (accessor === "weekday") {
            edit = (
                <div>
                    <select onChange={onChange} style={{width: "100%"}}>
                        <option value="Montag">Montag</option>
                        <option value="Dienstag">Dienstag</option>
                        <option value="Mittwoch">Mittwoch</option>
                        <option value="Donnerstag">Donnerstag</option>
                        <option value="Freitag">Freitag</option>
                        <option value="Samstag">Samstag</option>
                        <option value="Sonntag">Sonntag</option>
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
        .map(mapper);

    const footer = <>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>;

    return (
        <DeadlineModal
            title={title}
            body={body}
            footer={footer}
            show={props.show}
            hide={close}
            parentProps={props}
        />
    );
}
