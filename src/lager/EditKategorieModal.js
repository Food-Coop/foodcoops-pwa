import React from "react";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";

export function EditKategorieModal(props) {
    const {value, rowId, deleteKategorie} = props;
    const [newValue, setNewValue] = React.useState(null);

    const close = () => {
        props.close();
        setNewValue(null);
    };

    const save = () => {
        props.updateMyData(rowId, "name", newValue);

        props.persist(rowId, {name: newValue});

        close();
    };

    const remove = () => {
        deleteKategorie(rowId);
        close();
    };

    const merged = {
        name: {name:"Name", value: (newValue ? newValue : value) || "" }
    };

    const title = "Kategorie bearbeiten";

    const body = Object.entries(merged)
        .map(([accessor, {name, value}]) => <tr key={accessor}>
            <td>
                <label style={{margin: 0}}>{name}:</label>
            </td>
            <td>
                <input
                    name={name}
                    value={value}
                    onChange={function ({target: {value}}) {
                        return setNewValue(value);
                    }}/>
            </td>
        </tr>);

    const footer = <>
        <Button variant="danger" onClick={remove}>Kategorie löschen</Button>
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
