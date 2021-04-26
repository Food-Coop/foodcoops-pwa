import React from "react";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";
import ListGroup from 'react-bootstrap/ListGroup'

export function EinheitenModal(props) {
    const close = () => {
        props.close();
    };

    const merged = [...props.einheiten];
    const title = "Einheiten bearbeiten";

    const body = <ListGroup as="ul">
        <ListGroup.Item key="input" as="li">
            <input type="text"/>
            <button onClick={e => {
                e.preventDefault();
                const inputElement = e.target.previousElementSibling;
                const name = inputElement.value;
                if (name) {
                    props.create({name});
                    inputElement.value = "";
                }
            }}>Einheit hinzufügen</button>
        </ListGroup.Item>

        {
            merged
                .map(({id, name}, i) =>
                    <ListGroup.Item key={i} as="li">
                        {name}
                        <button style={{float: "right", marginLeft: "1em"}} onClick={e => {
                            e.preventDefault();
                            props.remove({id, name});
                        }}>Einheit löschen</button>
                    </ListGroup.Item>
                )
        }
    </ListGroup>;

    const footer = <>
        <Button onClick={close}>Zurück</Button>
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
