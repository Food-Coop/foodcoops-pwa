import React from "react";
import Form from 'react-bootstrap/Form';
import FormFile from 'react-bootstrap/FormFile'

function isValidImage(result) {
    return result.startsWith("data:image");
}

function isValidFile(result) {
    return typeof result === "string";
}

export function IconInput({setIcon}) {
    // used to debounce focus events
    const [input, setInput] = React.useState(null);

    const onFocus = e => {
        const file = e.target.files[0];
        if (file === undefined) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onerror = function() {
            alert("Fehler beim Lesen der Datei. Grund:" + fileReader.error);
        };
        fileReader.onload = function() {
            const result = fileReader.result;
            if (input === result) {
                return;
            }

            if (!isValidFile(result)) {
                return;
            }

            // set input here to debounce error messages
            setInput(result);

            if(!isValidImage(result)) {
                alert("Dateiformat nicht erkannt. Bitte stellen Sie sicher, dass Sie ein Bild ausgewählt haben.");
                return;
            }

            setIcon(result);
        };
        fileReader.readAsDataURL(file);
    };

    return (
        <Form>
            <Form.File
                id="icon-input"
                label="Icon"
                custom>
                <FormFile.Input data-browse="Auswählen" onFocus={onFocus}/>
                <FormFile.Label>Icon</FormFile.Label>
            </Form.File>
        </Form>
    );
}
