import React from "react";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";
import {deepAssign} from "./util";

export function NewKategorieModal(props) {
    const {create} = props;
    const [newData, setNewData] = React.useState({});

    const icon = "data:image/png;base64,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";
    const initial = {
        name: {name: "Name", value: "neue kategorie"},
        icon: {name: "Icon", value: icon},
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

        create(result);
        close();
    };

    const title = "Kategorie erstellen";

    const body = Object.entries(initial)
        .map(([accessor, {name, value}]) => <tr key={accessor}>
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
        </tr>);

    const footer = <>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>

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
