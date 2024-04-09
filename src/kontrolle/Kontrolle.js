import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Typography from '@mui/material/Typography';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import "jspdf-autotable"
import React, { useEffect, useState } from "react";
import { Button, Table } from 'react-bootstrap';
import { useApi } from '../ApiService';
import "./kontrolle.css";
import { green, red } from '@mui/material/colors';
import Card from 'react-bootstrap/Card';
import {FormControl} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';

export function Kontrolle() {
    const [discrepancyList, getDiscrepancyList] = useState([]);
    const api = useApi();

    useEffect(() => {
      const fetchDiscrepancyList = async () => {
        try {
          const response = await api.readDiscrepancyOverviwe();
          const data = await response.json();
          if (data && data.discrepancy) {
            getDiscrepancyList(data.discrepancy);
            console.log(discrepancyList);
          } else {
            getDiscrepancyList([]);
            console.log(discrepancyList);
          }
        } catch (error) {
          console.error('Error getting frischBestellung')
          console.log(discrepancyList)
        }
      };

      fetchDiscrepancyList();
    }, []);

    const listContent = () => {

        const generatePDF = () => {
            const doc = new jsPDF();

            doc.setFontSize(16); // Größe der Schriftart setzen
            doc.setFont("helvetica", "bold"); // Schriftart und Stil setzen (fett)
            doc.text("Liste der zu viel und zu wenig gelieferten Lebensmittel", 10, 10);
            
            const columnNames = ["Produktbezeichnung", "Menge", "Einheit"];
            
            doc.save("Lebensmittel_Liste.pdf");
        };

        return (
            <div className="main-einkauf">
              
              {discrepancyList.filter(item => item.zuVielzuWenig !== 0).map((item, index) => (
                <Card key={index}>
                  <Card.Body>
                    <div className="row">
                      <div className="col-md-2">
                        <Card.Text>{item.bestand.name}</Card.Text>
                      </div>
                      <div className="col-md-2">
                        <Button variant='secondary'>Zu Wenig</Button>
                      </div>
                      <div className="col-md-2">
                        <Button variant='secondary'>Zu Viel</Button>
                      </div>
                      <div className="col-md-2">
                        <InputGroup>
                          <Form.Control placeholder={Math.abs(item.zuVielzuWenig)} aria-label='Username' aria-describedby='basic-addon1'/>
                        </InputGroup>
                      </div>
                      <div className="col-md-2">
                        <Card.Text>{item.bestand.einheit.name}</Card.Text>
                      </div>
                      <div className="col-md-2">
                        <Button variant='primary' onClick={() => (index)}>
                          OK
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}

                <div style={{marginTop: "20px"}}>
                  <Button onClick={generatePDF} variant="success" style={{width: "150px"}}>Als PDF herunterladen</Button>
                </div>

            </div>
        );
    }

    return (
        <div className="Content">
            {listContent()}
        </div>
    );
}