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
    const [einkaufEmailText, setEinkaufEmailText] = useState('');

    const deliveryCostId = "deliveryCostId";
    const einkaufEmailTextId = "einkaufEmailTextId";
    const emailFromBestellAdminId = "emailFromBestellAdminId";
    const emailFromEinkaufAdminId = "emailFromEinkaufAdminId";

    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
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

    useEffect(() => {
        const fetchConfigData = () => {
            api.readConfig()
                .then(response => response.json())
                .then(data => {
                    if (data !== null) {
                        setEinkaufEmailText(data.einkaufEmailText);
                        document.getElementById(deliveryCostId).value = data.deliverycost;
                        if (data.emailFromBestellAdmin === null) {
                            document.getElementById(emailFromBestellAdminId).value = '';
                        } else {
                            document.getElementById(emailFromBestellAdminId).value = data.emailFromBestellAdmin;
                        }
                        if (data.emailFromEinkaufAdmin === null) {
                            document.getElementById(emailFromEinkaufAdminId).value = '';
                        } else {
                            document.getElementById(emailFromEinkaufAdminId).value = data.emailFromEinkaufAdmin;
                        }
                        document.getElementById(einkaufEmailTextId).value = data.einkaufEmailText;
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
        let param2 = document.getElementById(emailFromEinkaufAdminId)?.value;
        let param3 = document.getElementById(emailFromEinkaufAdminId)?.value;
        let param4 = document.getElementById(einkaufEmailTextId)?.value;
        console.log(param1, param2, param3, param4);
    
        try {
            const response = await api.updateConfig({ deliverycost: param1, emailFromBestellAdmin: param2, emailFromEinkaufAdmin: param3, einkaufEmailText: param4});
            if (response.ok) {
                toast.success('Die Daten wurden erfolgreich aktualisiert.');
            } else {
                toast.error('Fehler beim Aktualisieren der Daten. Bitte versuchen Sie es erneut.');
            }
        } catch (error) {
            console.error('Error updating config data:', error);
        }
    };

    const calculateRows = text => {
        const lineBreaks = (text.match(/\n/g) || []).length;
        return lineBreaks + 1;
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
                            <td className='label'><label>E-Mail des Bestellungs-Admin:</label></td>
                            <td><input className='input' id={emailFromBestellAdminId} type="text"/></td>
                        </tr>
                        <tr>
                            <td className='label'><label>E-Mail des Einkaufs-Admin:</label></td>
                            <td><input className='input' id={emailFromEinkaufAdminId} type="text"/></td>
                        </tr>
                        <tr>
                            <td className='label'>
                                <label>E-Mail-Text: {einkaufEmailExplanation} </label>
                            </td>
                            <td><textarea className='input' id={einkaufEmailTextId} rows={calculateRows(einkaufEmailText)}/></td>
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