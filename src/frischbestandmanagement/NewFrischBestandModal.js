import React from "react";
import Button from "react-bootstrap/Button";
import {FrischBestandModal} from "./FrischBestandModal";
import {deepAssign} from "../util";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CustomTooltip from "../components/CustomToolTip";

function defaultData(columns) {
    const capitalize = word => word.replace(/^\w/, c => c.toUpperCase());
    const getName = (accessor, humanName) => typeof humanName === "string" ? humanName : capitalize(accessor);

    const convert = ({Header: humanName, accessor}) => [accessor, {name: getName(accessor, humanName), value: ""}];
    const initial = Object.fromEntries(columns.map(convert));

    initial["name"].value = "Name";
    initial["verfuegbarkeit"].value = 1;
    initial["herkunftsland"].value = "DE";
    initial["verband"].value = "DB";
    initial["gebindegroesse"].value = 0;
    initial["preis"].value = 0;

    return initial;
}

export function NewFrischBestandModal(props) {
    const [newData, setNewData] = React.useState({});
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

    const initial = {
        ...defaultData(props.columns),
        ...newData
    };

    const close = () => {
        props.close();
        setNewData({});
    };

    const save = () => {
        const result = {};
        for (const [accessor, {value}] of Object.entries(initial)) {
            deepAssign(accessor, result, value);
        }
        for (const [accessor, {value}] of Object.entries(newData)) {
            deepAssign(accessor, result, value);
        }

        if (!result.einheit?.id) {
            const find = props.einheiten[0];
            deepAssign("einheit.id", result, find.id);
        }
        if (!result.kategorie?.id) {
            const find = props.kategorien[0];
            let kategorie = {};
            deepAssign("id", kategorie, find.id);
            deepAssign("name", kategorie, find.name);
            deepAssign("kategorie", result, kategorie);
        }
        props.create(result);
        close();
    };

    const title = "Frischprodukt erstellen";

    const mapper = ([accessor, {name, value}]) => {
        const onChange = function ({target: {value}}) {
            const changed = {};

            // edge case: dropdown value is the id of the einheit but accessor is the name of the einheit
            if (accessor === "einheit.name") {
                changed["einheit.id"] = {name, value};
            }
            else if(accessor === "kategorie.name") {
                changed["kategorie.id"] = {name, value};
            }
            else{
                changed[accessor] = {name, value};
            }

            return setNewData(prev => ({...prev, ...changed}));
        };
        let edit = <input
                name={name}
                placeholder={value}
                onChange={onChange}
                style={{width: "100%"}}/>;
        if (accessor === "verfuegbarkeit") {
            edit = <input
                type="checkbox"
                checked={value}
                onChange={e => onChange({ target: { value: e.target.checked } })}
            />;
        } else if (accessor === "spezialfallBestelleinheit") {
            edit =  <div style={{display: 'flex', alignItems: 'center'}}> 
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={e => onChange({ target: { value: e.target.checked } })}
                        /> 
                        <span>{explanationSpezialfall}</span>
                    </div>;
        } else if (accessor === "kategorie.name") {
            edit = (
                <div>
                    <select onChange={onChange} style={{width: "100%"}}>
                        {props.kategorien.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
                    </select>
                </div>
            );
        } else if (accessor === "einheit.name") {
            edit = (
                <div>
                    <select onChange={onChange} style={{width: "100%"}}>
                        {props.einheiten.map(({name, id}, i) => <option key={i} value={id}>{name}</option>)}
                    </select>
                </div>
            );
        }
        else if (accessor === "preis") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="number"
                        min="0"
                        placeholder={value}
                        onChange={function ({target: {value}}) {
                            const changed = {};
                            changed[accessor] = {name, value};
                            return setNewData(prev => ({...prev, ...changed}));
                        }}/>
                </td>
            </tr>;
        }
        else if (accessor === "gebindegroesse") {
            return <tr key={accessor}>
                <td>
                    <label style={{margin: 0}}>{name}:</label>
                </td>
                <td>
                    <input
                        name={name}
                        type="number"
                        min="0"
                        placeholder={value}
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
                {edit}
            </td>
        </tr>;
    };
    const body = Object.entries(initial)
        .filter(([a, {}])=> a !== "einheit.id")
        .filter(([a, {}])=> a !== "kategorie.id")
        .map(mapper);

    const footer = <>
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
