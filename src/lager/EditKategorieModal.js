import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { LagerModal } from "./LagerModal";
import ListGroup from 'react-bootstrap/ListGroup';
import CustomTooltip from "../components/CustomToolTip";
import './Dialog.css';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export function EditKategorieModal(props) {
    const [mixable, setmixable] = useState(false); 
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
    };

    const close = () => {
        props.close();
    };

    const merged = [...props.kategorien];
    const title = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Kategorien bearbeiten </span>
          <ClickAwayListener onClickAway={handleTooltipClose}>
                <div >
                    <CustomTooltip onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                        <React.Fragment>
                            <Typography color="inherit"><b>Hinweis Kategorien</b></Typography>
                            Wenn eine Kategorie als "mischbar" markiert ist, können Produkte innerhalb dieser Kategorie zu einem Gebinde kombiniert werden, falls kein komplettes Gebinde zustande kommt.
                            <Typography color="inherit"><b>Beispiel</b></Typography>
                            Es werden 4 Feldsalate und 8 Eichblattsalate bestellt, wobei die Gebindegröße für beide Produkte 12 beträgt. Wenn die Kategorie als mischbar markiert ist, werden 12 Eichblattsalate bestellt.
                        </React.Fragment>
                        }
                        placement="right" arrow>
                        <IconButton onClick={handleTooltipOpen}>
                            <HelpOutlineIcon />
                        </IconButton>
                    </CustomTooltip>
                </div>
            </ClickAwayListener>
        </div>
      );

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

    const ignoreEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit(e.target);
        }
    };

    const body = 
        <div className="body">
            <ListGroup as="ul">
                <ListGroup.Item key="input" as="li">
                    <div className="input-container">
                        <input className="input-text" type="text" onKeyDown={ignoreEnter} />
                        <label className="checkbox-label">Mischbar:</label>
                        <input 
                            className="checkbox-input"
                            type="checkbox"
                            checked={mixable}
                            onChange={handleCheckboxChange}
                        />
                        <CheckIcon className="list-item-delete" onClick={e=> {
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
                                    <div className="list-item">
                                        <div id="nameKategorie">{name}</div>
                                        <div className="list-item-divider"></div>
                                        <label className="checkbox-label"> Mischbar:</label>
                                        <input 
                                            className="checkbox-input"
                                            type="checkbox"
                                            checked={mixable}
                                            onChange={handleCheckboxChange}
                                            disabled
                                        />
                                        <CloseIcon className="list-item-delete" onClick={e => {
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