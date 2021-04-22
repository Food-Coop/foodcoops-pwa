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
        for (const [accessor, {value}] of Object.entries(newData)) {
            props.updateMyData(props.rowId, accessor, value);
        }

        props.persist(props.rowId, newData);

        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .filter(({value}) => value)
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    const title = "Produkt bearbeiten";

    const body = Object.entries(merged)
        .map(([accessor, {name, value}]) => <tr key={accessor}>
            <td>
                <label>{name}:</label>
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

    const footer = <Modal.Footer>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </Modal.Footer>;

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
