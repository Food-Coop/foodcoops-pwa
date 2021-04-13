import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export function LagerModal(props) {
    const rowData = props.rowData || [];
    const [showModal, setShowModal] = React.useState(false);
    const [newData, setNewData] = React.useState({});

    React.useEffect(() => {
        setShowModal(props.show);
    }, [props.show])

    const close = () => {
        setShowModal(false);
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

    return (
        <Modal
            show={showModal}
            onHide={close}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Produkt bearbeiten
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table>
                        <tbody>
                        {Object.entries(merged)
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
                            </tr>)}
                        </tbody>
                    </table>
                </form>
            </Modal.Body>
            {props.children}
            <Modal.Footer>
                <Button onClick={close}>Änderungen verwerfen</Button>
                <Button onClick={save}>Änderungen übernehmen</Button>
            </Modal.Footer>
        </Modal>
    );
}
