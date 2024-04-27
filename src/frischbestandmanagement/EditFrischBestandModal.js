import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {FrischBestandModal} from "./FrischBestandModal";
import NumberFormatComponent from "../logic/NumberFormatComponent";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CustomTooltip from "../components/CustomToolTip";

export function EditFrischBestandModal(props) {
    const rowData = props.rowData || [];
    const [newData, setNewData] = React.useState({});
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
    };

    const explanationSpezialfall = (
          <ClickAwayListener onClickAway={handleTooltipClose}>
                <div >
                    <CustomTooltip onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                        <React.Fragment>
                            <Typography color="inherit"><b>Hinweis Spezialfall</b></Typography>
                            Ein Produkt ist ein Spezialfall, wenn die zu bestellende Einheit "Stück" ist, jedoch beim Einkauf die Einheit "Kg" verwendet wird. Wenn dies der Fall ist, soll bei Einheit "Kg" ausgewählt und bei Spezialfall ein Häckchen gesetzt werden. Dies ist z.B. der Fall bei Blumenkohl. 
                        </React.Fragment>
                        }
                        placement="right" arrow>
                        <IconButton onClick={handleTooltipOpen}>
                            <HelpOutlineIcon />
                        </IconButton>
                    </CustomTooltip>
                </div>
            </ClickAwayListener>
      );

    const close = () => {
        props.close();
        setNewData({});
    };

    const save = () => {
        props.persist(props.rowId, newData);
        forceUpdate();
        close();
    };

    const remove = () => {
        props.deleteFrischBestand(props.rowId);
        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    const title = "Frischprodukt bearbeiten";

    const mapper = ([accessor, {name, value}]) => {
        if (accessor === "einheit.name") {
            const selectedEinheit = value;
            const onChange = function ({target: {value}}) {
                const changed = {};
                changed["einheit.id"] = {name, value};
                return setNewData(prev => ({...prev, ...changed}));
            };
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <div>
                        <select onChange={onChange} style={{width: "100%"}}>
                            {props.einheiten.map(function({name, id}, i){
                                if (selectedEinheit== name){
                                    return (<option key={i} selected="selected" value={id}>{name}</option>)
                                }
                                return ((<option key={i} value={id}>{name}</option>));
                                },selectedEinheit)}
                        </select>
                    </div>
                </td>
            </tr>
        }
        if (accessor === "kategorie.name") {
            const selectedKategorie = value;
            const onChange = function ({target: {value}}) {
                const changed = {};
                changed["kategorie.id"] = {name, value};
                return setNewData(prev => ({...prev, ...changed}));
            };
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <div>
                        <select onChange={onChange} style={{width: "100%"}}>
                            {props.kategorien.map(function({name, id}, i){
                                if (selectedKategorie == name){
                                    return (<option key={i} selected="selected" value={id}>{name}</option>)
                                }
                                return ((<option key={i} value={id}>{name}</option>));
                            },selectedKategorie)}
                        </select>
                    </div>
                </td>
            </tr>
        }
        if (accessor === "verfuegbarkeit") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="checkbox"
                        checked={value}
                        onChange={({target: {checked}}) => {
                            const changed = {};
                            changed[accessor] = {name, value: checked};
                            setNewData(prev => ({...prev, ...changed}));
                        }}
                    />
                </td>
            </tr>;
        }
        if (accessor === "spezialfallBestelleinheit") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <div style={{display: 'flex', alignItems: 'center'}}> 
                        <input
                            name={name}
                            type="checkbox"
                            checked={value}
                            onChange={({target: {checked}}) => {
                                const changed = {};
                                changed[accessor] = {name, value: checked};
                                setNewData(prev => ({...prev, ...changed}));
                            }}
                        />
                        <span>{explanationSpezialfall}</span>
                    </div>
                </td>
            </tr>;
        }
        if (accessor === "preis") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="number"
                        min="0"
                        value={value}
                        onChange={function ({target: {value}}) {
                            const changed = {};
                            changed[accessor] = {name, value};
                            return setNewData(prev => ({...prev, ...changed}));
                        }}/>
                </td>
            </tr>;
        }
        if (accessor === "gebindegroesse") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="number"
                        min="0"
                        value={value}
                        onChange={function ({target: {value}}) {
                            const changed = {};
                            changed[accessor] = {name, value};
                            return setNewData(prev => ({...prev, ...changed}));
                        }}/>
                </td>
            </tr>;
        }
        return <tr key={accessor}>
            <td>
                <label style={{margin: 0}}>{name}:</label>
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
        </tr>;
    };
    const body = Object.entries(merged)
        .filter(([a, {}])=> a !== "einheit.id")
        .filter(([a, {}])=> a !== "kategorie.id")
        .map(mapper);

    const footer = <>
        <Button variant="danger" onClick={remove}>Produkt löschen</Button>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>;

    return (
        <FrischBestandModal
            title={title}
            body={body}
            footer={footer}
            show={props.show}
            hide={close}
            parentProps={props}
        />
    );
}
