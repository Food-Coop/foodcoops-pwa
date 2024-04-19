import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import Alert from '@mui/material/Alert';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminConfig.css';

export function AdminConfig() {
    const api = useApi();
    const [einkaufEmailText, setEinkaufEmailText] = useState('');
    const [id, setId] = useState('');

    const deliveryCostId = "deliveryCostId";
    const einkaufEmailTextId = "einkaufEmailTextId";
    const emailFromBestellAdminId = "emailFromBestellAdminId";
    const emailFromEinkaufAdminId = "emailFromEinkaufAdminId";

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

                        document.getElementById(einkaufEmailTextId).value = data.einkaufEmailText;
                        
                        document.getElementById(emailFromEinkaufAdminId).value = data.emailFromEinkaufAdmin;
                        setId(data.id);
                    }
                })
                .catch(error => {
                    console.error('Error fetching config data:', error);
                })
        };
        fetchConfigData();
    }, [api]);

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
                                <label>E-Mail-Text:</label>
                                <Alert severity="info" style={{margin: "0.5em 1em 0.5em 1em"}}>
                                    Platzhalter stehen innerhalb von %-Zeichen und werden durch die entsprechenden Werte ersetzt.{<br />}
                                    Der Username ist %personID%, das aktuelle Datum %currentDate%.{<br />}
                                    Eine Auflistung des Frischeinkaufs kann mit %frischEinkauf% eingefügt werden. Ebenso gilt das für %brotEinkauf% und %lagerEinkauf%.{<br />}
                                    Der Gesamtpreis kann mit %gesamtKosten% eingefügt werden.
                                </Alert>
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