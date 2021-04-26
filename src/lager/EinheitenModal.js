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
    const style = {
        fontSize: "large",
        float: "right",
        margin: "0",
        cursor: "pointer",
        width: "1.5em",
        textAlign: "right"
    };

    const body = <ListGroup as="ul">
        <ListGroup.Item key="input" as="li">
            <input style={{border: "0", background: "lightgray", borderRadius: "5px"}} type="text"/>
            <p style={style} onClick={e => {
                e.preventDefault();
                const inputElement = e.target.previousElementSibling;
                const name = inputElement.value;
                if (name) {
                    props.create({name});
                    inputElement.value = "";
                }
            }}>✓</p>
        </ListGroup.Item>

        {
            merged
                .map(({id, name}, i) => {
                    return <ListGroup.Item key={i} as="li">
                            {name}
                            <p style={style} onClick={e => {
                                e.preventDefault();
                                props.remove({id, name});
                            }}>×</p>
                        </ListGroup.Item>;
                    }
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
