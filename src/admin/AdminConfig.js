import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminConfig.css';

export function AdminConfig() {
    const api = useApi();
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [einkaufEmailText, setEinkaufEmailText] = useState('');
    const [emailFromBestellAdmin, setEmailFromBestellAdmin] = useState('');
    const [emailFromEinkaufAdmin, setEmailFromEinkaufAdmin] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        const fetchConfigData = async () => {
          try {
            const response = await api.readConfig();
            const data = await response.json();
            if (data === null) {
              return;
            } else {
                setDeliveryCost(data.deliverycost);
                setEinkaufEmailText(data.einkaufEmailText);
                setEmailFromBestellAdmin(data.emailFromBestellAdmin);
                setEmailFromEinkaufAdmin(data.emailFromEinkaufAdmin);
                setId(data.id);
            }
          } catch (error) {
            console.error('Error fetching config data:', error);
          }
        };
        fetchConfigData();
    }, [api]);

    const handleSubmit = async () => {
        /*event.preventDefault();
    
        const configData = {
            deliverycost: deliveryCost,
            einkaufEmailText: einkaufEmailText,
            emailFromBestellAdmin: emailFromBestellAdmin,
            emailFromEinkaufAdmin: emailFromEinkaufAdmin,
            id: id
        };
    
        try {
            const response = await api.updateConfig(configData);
            if (response.ok) {
                toast.success('Die Daten wurden erfolgreich aktualisiert.');
            } else {
                toast.error('Fehler beim Aktualisieren der Daten. Bitte versuchen Sie es erneut.');
            }
        } catch (error) {
            console.error('Error updating config data:', error);
        }*/
    };

    const calculateRows = text => {
        const lineBreaks = (text.match(/\n/g) || []).length;
        return lineBreaks + 1;
    };

    return (
        <div>
            <div className="container">
            <table className="table">
                <tbody>
                <tr>
                    <td className='label'><label>Lieferkosten in %:</label></td>
                    <td><input className='input' id='deliveryCost' type="number" value={deliveryCost} onChange={e => setDeliveryCost(e.target.value)} /></td>
                </tr>
                <tr>
                    <td className='label'><label>E-Mail des Bestellungs-Admin:</label></td>
                    <td><input className='input' id='emailFromBestellAdmin' type="text" value={emailFromBestellAdmin} onChange={e => setEmailFromBestellAdmin(e.target.value)} /></td>
                </tr>
                <tr>
                    <td className='label'><label>E-Mail des Einkaufs-Admin:</label></td>
                    <td><input className='input' id='emailFromEinkaufAdmin' type="text" value={emailFromEinkaufAdmin} onChange={e => setEmailFromEinkaufAdmin(e.target.value)} /></td>
                </tr>
                <tr>
                    <td className='label'><label>E-Mail-Text:</label></td>
                    <td><textarea className='input' id='einkaufEmailText' value={einkaufEmailText} onChange={e => setEinkaufEmailText(e.target.value)} rows={calculateRows(einkaufEmailText)} /></td>
                </tr>
                </tbody>
            </table>
            </div>
            <Button className="button" variant="success" onClick={handleSubmit}>
                Konfiguration updaten
            </Button>
            <ToastContainer />
    
        </div>
        
      );
}