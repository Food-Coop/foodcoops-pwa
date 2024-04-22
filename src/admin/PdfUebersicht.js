import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKeycloak } from "@react-keycloak/web";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';


export function PdfUebersicht() {
    const api = useApi();
    const { keycloak } = useKeycloak();

    const handleDownloadFrisch = () => {
        api.getUebersichtFrischByte()
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            const binaryString = window.atob(json.pdf);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes.buffer], {type: "application/pdf"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', (json.filename + '.pdf'));
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => console.error(error));
    }

    const handleEmailFrisch = async () => {
        let email = keycloak.tokenParsed.email;
        let response = await api.sendFrischOrder(email);
        console.log(response);
        if (response.ok) {
            toast.success("Die E-Mail wurde erfolgreich versendet.");
        } else {
            toast.error("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
    }

    const handleDownloadBrot = () => {
        api.getUebersichtBrotByte()
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            const binaryString = window.atob(json.pdf);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes.buffer], {type: "application/pdf"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', (json.filename + '.pdf'));
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => console.error(error));
    }

    const handleEmailBrot = async () => {
        let email = keycloak.tokenParsed.email;
        let response = await api.sendBrotOrder(email);
        console.log(response);
        if (response.ok) {
            toast.success("Die E-Mail wurde erfolgreich versendet.");
        } else {
            toast.error("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
    }

    const content = () => {
        return (
            <div>
                <div style={{overflowX: "auto", width: "100%"}}>
                <Accordion defaultExpanded>
                        <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" gutterBottom>Alle aktuellen Frischbestellungen</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} className="button" onClick={handleDownloadFrisch}>
                            Download
                        </Button>
                        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" className="button" onClick={handleEmailFrisch}>
                            Als Email an mich versenden
                        </Button>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" gutterBottom>Alle aktuellen Brotbestellungen</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} className="button" onClick={handleDownloadBrot}>
                            Download
                        </Button>
                        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" className="button" onClick={handleEmailBrot}>
                            Als Email an mich versenden
                        </Button>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <ToastContainer />
            </div>
        );
    };

    return content();
}