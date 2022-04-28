import React from "react";
import Modal from "react-bootstrap/Modal";

export function  FrischBestandModal(props) {
    const {show, hide, title, body, footer, parentProps} = props;
    return (
        <Modal
            show={show}
            onHide={hide}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table>
                        <tbody>
                        {body}
                        </tbody>
                    </table>
                </form>
            </Modal.Body>
            {parentProps.children}
            <Modal.Footer>
                {footer}
            </Modal.Footer>
        </Modal>
    );
}
