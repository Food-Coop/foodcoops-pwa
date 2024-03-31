import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { LagerModal } from "./LagerModal";
import ListGroup from 'react-bootstrap/ListGroup';
import CustomTooltip from "../components/CustomToolTip";

export function EditKategorieModal(props) {
    const [mixable, setmixable] = useState(false); 

    const close = () => {
        props.close();
    };

    const merged = [...props.kategorien];
    const title = "Kategorien bearbeiten";
    const style = {
        fontSize: "large",
        float: "right",
        margin: "0",
        cursor: "pointer",
        width: "1em",
        textAlign: "right",
        marginLeft: "1em"
    };

    const submit = (inputElement) => {
        const name = inputElement.value;
        if (name) {
            props.create({ name, mixable });
            inputElement.value = "";
        }
    };

    const handleCheckboxChange = () => {
        setmixable(!mixable);
    };

    // bug: it was possible to reload the page when pressing the enter key
    // solution: submit the einheit value when pressing enter
    const ignoreEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit(e.target);
        }
    };

    const body = 
    <div>
        <div style={{ position: 'absolute', top: '20px', right: '300px' }}>
            <CustomTooltip
                title={
                <React.Fragment>
                    <Typography color="inherit"><b>Hinweis Kategorien</b></Typography>
                    Wenn eine Kategorie als "mischbar" markiert ist, können Produkte innerhalb dieser Kategorie zu einem Gebinde kombiniert werden, falls kein komplettes Gebinde zustande kommt.
                    <Typography color="inherit"><b>Beispiel</b></Typography>
                    Es werden 4 Feldsalate und 8 Eichblattsalate bestellt, wobei die Gebindegröße für beide Produkte 12 beträgt. Wenn die Kategorie als mischbar markiert ist, werden 12 Eichblattsalate bestellt.
                </React.Fragment>
                }
                placement="right" arrow>
                <IconButton>
                    <HelpOutlineIcon />
                </IconButton>
            </CustomTooltip>
        </div>
        <ListGroup as="ul">
            <ListGroup.Item key="input" as="li">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input style={{ border: "0", background: "lightgray", borderRadius: "5px" }} type="text" onKeyDown={ignoreEnter} />
                    <label style={{ margin: "0 0 0 3em" }}>Mischbar:</label>
                    <input 
                        style={{ margin: "0 0 0 1em"}}
                        type="checkbox"
                        checked={mixable}
                        onChange={handleCheckboxChange}
                    />
                    <img alt="delete" src="icons/icons8-checkmark-50.png" style={style} onClick={(e) => {
                        e.preventDefault();
                        const inputElement = e.target.parentElement.parentElement.querySelector("input");
                        submit(inputElement);
                    }} />
                </div>
            </ListGroup.Item>

            {
                merged
                    .map(({id, name, mixable}, i) => {
                        return (
                            <ListGroup.Item key={i} as="li">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>{name}</div>
                                    <div style={{ borderLeft: '1px solid black', height: '100%', marginRight: '10px' }}></div>
                                    <label style={{ margin: "0 0 0 1em" }}> Mischbar:</label>
                                    <input 
                                        style={{ margin: "0 0 0 1em"}}
                                        type="checkbox"
                                        checked={mixable}
                                        onChange={handleCheckboxChange}
                                        disabled
                                    />
                                    <img alt="delete" src="icons/icons8-delete-50.png" style={style} onClick={e => {
                                        e.preventDefault();
                                        props.remove({id, name});
                                    }}/>
                                </div>
                            </ListGroup.Item>
                        );
                    })
            }
        </ListGroup>
    </div>;

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
