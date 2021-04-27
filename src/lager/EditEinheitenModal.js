import React from "react";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";
import ListGroup from 'react-bootstrap/ListGroup'

export function EditEinheitenModal(props) {
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
        width: "1em",
        textAlign: "right",
        marginLeft: "1em"
    };

    const submit = inputElement => {
        const name = inputElement.value;
        if (name) {
            props.create({name});
            inputElement.value = "";
        }
    };

    // bug: it was possible to reload the page when pressing the enter key
    // solution: submit the einheit value when pressing enter
    const ignoreEnter = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit(e.target);
        }
    };

    const body = <ListGroup as="ul">
        <ListGroup.Item key="input" as="li">
            <input style={{border: "0", background: "lightgray", borderRadius: "5px"}} type="text" onKeyDown={ignoreEnter}/>
            <img alt="delete" src="icons/icons8-checkmark-50.png" style={style} onClick={e=> {
                e.preventDefault();
                const inputElement = e.target.previousElementSibling;
                submit(inputElement);
            }}/>
        </ListGroup.Item>

        {
            merged
                .map(({id, name}, i) => {
                    return <ListGroup.Item key={i} as="li">
                            {name}
                            <img alt="delete" src="icons/icons8-delete-50.png" style={style} onClick={e => {
                                e.preventDefault();
                                props.remove({id, name});
                            }}/>
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
