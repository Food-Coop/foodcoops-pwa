import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminConfig.css';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CustomTooltip from '../components/CustomToolTip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export function AdminConfig() {
    const api = useApi();

    const deliveryCostId = "deliveryCostId";
    const thresholdId = "thresholdId";
    const einkaufEmailTextId = "einkaufEmailTextId";
    const einkaufsmanagementEmailTextId = "einkaufsmanagementEmailTextId";
    const lagermeisterEmailTextId = "lagermeisterEmailTextId";

    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [open4, setOpen4] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
    };

    const handleTooltipClose2 = () => {
        setOpen2(false);
    };

    const handleTooltipOpen2 = () => {
        setOpen2(true);
    };

    const handleTooltipClose3 = () => {
        setOpen3(false);
    };

    const handleTooltipOpen3 = () => {
        setOpen3(true);
    };

    const handleTooltipClose4 = () => {
        setOpen4(false);
    };

    const handleTooltipOpen4 = () => {
        setOpen4(true);
    };

    const einkaufEmailExplanation = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClickAwayListener onClickAway={handleTooltipClose}>
                <div >
                    <CustomTooltip onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                        <React.Fragment>
                            <Typography>Das ist der Text, der in der E-Mail steht, die nach einem Einkauf an den Einkäufer geschickt wird.<br />
                            <b>Hinweis</b><br/>
                            Platzhalter stehen innerhalb von %-Zeichen und werden durch die entsprechenden Werte ersetzt.<br />
                            Der Username ist <em>%personID%</em>, das aktuelle Datum <em>%currentDate%</em>.<br />
                            Eine Auflistung des Frischeinkaufs kann mit <em>%frischEinkauf%</em> eingefügt werden. Ebenso gilt das für <em>%brotEinkauf%</em> und <em>%lagerEinkauf%</em>.<br />
                            Der Gesamtpreis kann mit <em>%gesamtKosten%</em> eingefügt werden.</Typography>
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

      const einkaufsmanagementEmailExplanation = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClickAwayListener onClickAway={handleTooltipClose2}>
                <div >
                    <CustomTooltip onClose={handleTooltipClose2}
                        open={open2}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                        <React.Fragment>
                            <Typography>Das ist der Text, der in der E-Mail steht, die nach einem Einkauf eines Mitglieds an die Leute des Einkaufsmanagement geschickt wird.<br />
                            <b>Hinweis</b><br/>
                            Platzhalter stehen innerhalb von %-Zeichen und werden durch die entsprechenden Werte ersetzt.<br />
                            Der Username ist <em>%personID%</em>, das aktuelle Datum <em>%currentDate%</em>.<br />
                            Die Kosten des Frischeinkaufs können mit <em>%frischKosten%</em> eingefügt werden. Ebenso gilt das für <em>%brotKosten%, %lagerKosten%, %zuVielKosten%, %lieferKosten%</em> und <em>%gesamtKosten%</em>.
                            </Typography>
                        </React.Fragment>
                        }
                        placement="right" arrow>
                        <IconButton onClick={handleTooltipOpen2}>
                            <HelpOutlineIcon />
                        </IconButton>
                    </CustomTooltip>
                </div>
            </ClickAwayListener>
        </div>
    );
    
    const lagermeisterEmailExplanation = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClickAwayListener onClickAway={handleTooltipClose3}>
                <div >
                    <CustomTooltip onClose={handleTooltipClose3}
                        open={open3}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                        <React.Fragment>
                            <Typography>Das ist der Text, der in der E-Mail steht, die an den Lagermeister geschickt wird, wenn dieser den aktuellen Lagerbestand der Trockenware anfordert.<br />
                            <b>Hinweis</b><br/>
                            Platzhalter stehen innerhalb von %-Zeichen und werden durch die entsprechenden Werte ersetzt.<br />
                            Der Username ist <em>%personID%</em>.
                            </Typography>
                        </React.Fragment>
                        }
                        placement="right" arrow>
                        <IconButton onClick={handleTooltipOpen3}>
                            <HelpOutlineIcon />
                        </IconButton>
                    </CustomTooltip>
                </div>
            </ClickAwayListener>
        </div>
    );

    const thresholdExplanation = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClickAwayListener onClickAway={handleTooltipClose4}>
                <div >
                    <CustomTooltip onClose={handleTooltipClose4}
                        open={open4}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                        <React.Fragment>
                            <Typography>
                                Der Threshold ist der Schwellwert ab dem ein Gebinde bestellt werden soll.<br/>
                                <b>Beispiel</b><br/>
                                Wenn der Schwellwert bei 80 % liegt, wird bei einer Gebindegröße von 10 kg ein Gebinde bestellt, wenn die insgesamte Bestellmenge 8 kg beträgt.
                            </Typography>
                        </React.Fragment>
                        }
                        placement="right" arrow>
                        <IconButton onClick={handleTooltipOpen4}>
                            <HelpOutlineIcon />
                        </IconButton>
                    </CustomTooltip>
                </div>
            </ClickAwayListener>
        </div>
    );

    useEffect(() => {
        const fetchConfigData = () => {
            api.readConfig()
                .then(response => response.json())
                .then(data => {
                    if (data !== null) {
                        document.getElementById(deliveryCostId).value = data.deliverycost;
                        document.getElementById(thresholdId).value = data.threshold;
                        
                        document.getElementById(einkaufEmailTextId).value = data.einkaufEmailText;
                        document.getElementById(einkaufsmanagementEmailTextId).value = data.einkaufsmanagementEmailText;
                        document.getElementById(lagermeisterEmailTextId).value = data.lagermeisterEmailText;
                    }
                })
                .catch(error => {
                    console.error('Error fetching config data:', error);
                })
        };
        fetchConfigData();
    }, []);

    const handleSubmit = async () => {

        let param1 = document.getElementById(deliveryCostId)?.value;
        let param2 = document.getElementById(thresholdId)?.value;
        let param3 = document.getElementById(einkaufEmailTextId)?.value;
        let param4 = document.getElementById(einkaufsmanagementEmailTextId)?.value;
        let param5 = document.getElementById(lagermeisterEmailTextId)?.value;
    
        try {
            const response = await api.updateConfig({ deliverycost: param1, threshold: param2, einkaufEmailText: param3, einkaufsmanagementEmailText: param4, lagermeisterEmailText: param5});
            if (response.ok) {
                toast.success('Die Daten wurden erfolgreich aktualisiert.');
            } else {
                toast.error('Fehler beim Aktualisieren der Daten. Bitte versuchen Sie es erneut.');
            }
        } catch (error) {
            console.error('Error updating config data:', error);
        }
    };

    const content = () => {
        return (
            <div>
                <div className="container">
                    <table className="tableAdminConf">
                        <tbody>
                        <tr>
                            <td className='label'><label>Lieferkosten in %:</label></td>
                            <td><input className='input' id={deliveryCostId} type="number"/></td>
                        </tr>
                        <tr>
                            <td className='label'><label>Threshold in %: {thresholdExplanation}</label></td>
                            <td><input className='input' id={thresholdId} type="number"/></td>
                        </tr>
                        <tr>
                            <td className='label'>
                                <label>E-Mail-Text für Einkauf: {einkaufEmailExplanation} </label>
                            </td>
                            <td><textarea className='input' id={einkaufEmailTextId} rows="10"/></td>
                        </tr>
                        <tr>
                            <td className='label'>
                                <label>E-Mail-Text für Einkaufsmanagement: {einkaufsmanagementEmailExplanation}</label>
                            </td>
                            <td><textarea className='input' id={einkaufsmanagementEmailTextId} rows="10"/></td>
                        </tr>
                        <tr>
                            <td className='label'>
                                <label>E-Mail-Text für Lagermeister: {lagermeisterEmailExplanation}</label>
                            </td>
                            <td><textarea className='input' id={lagermeisterEmailTextId} rows="10"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            <Button className="button" variant="success" onClick={handleSubmit}>
                Konfiguration updaten
            </Button>
            <ToastContainer />
        </div>
    );}

    return content();
}