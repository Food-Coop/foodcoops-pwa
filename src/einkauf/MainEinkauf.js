import React, { useState, useEffect } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BrotEinkauf } from './BrotEinkauf';
import { FrischEinkauf } from './FrischEinkauf';
import { LagerwareEinkauf } from './LagerwareEinkauf';
import { EinkaufsDialog} from './EinkaufsDialog';
import { useApi } from '../ApiService';
import NumberFormatComponent from '../logic/NumberFormatComponent';
import './MainEinkauf.css';

export function MainEinkauf() {
  const [totalFrischPrice, setTotalFrischPrice] = useState(0);
  const [totalBrotPrice, setTotalBrotPrice] = useState(0);
  const [totalProduktPrice, setTotalProduktPrice] = useState(0);
  const [frisch, setFrisch] = useState([]);
  const [brot, setBrot] = useState([]);
  const [produkt, setProdukt] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { keycloak } = useKeycloak();
  const api = useApi();

  const handleFrischPriceChange = (price) => {
    setTotalFrischPrice(price);
    setDeliveryCost(price * 0.05);
  };

  const handleBrotPriceChange = (price) => {
    setTotalBrotPrice(price);
  };

  const handleProduktPriceChange = (price) => {
    setTotalProduktPrice(price);
  };

  const handleFrisch = (frisch) => {
    setFrisch(frisch);
  };

  const handleBrot = (brot) => {
    setBrot(brot);
  };

  const handleProdukt = (produkt) => {
    setProdukt(produkt);
  };

  useEffect(() => {
    const total = totalFrischPrice + totalBrotPrice + totalProduktPrice + deliveryCost;
    setTotalPrice(total);
  }, [totalFrischPrice, totalBrotPrice, totalProduktPrice, deliveryCost]);

  const clearInputFields = () => {
    const inputFields = document.querySelectorAll('input[type="number"]');
    inputFields.forEach((input) => {
      input.value = "";
    });
    setTotalFrischPrice(0);
    setTotalBrotPrice(0);
    setTotalProduktPrice(0);
    setDeliveryCost(0);
    setTotalPrice(0);
  };

  const submitEinkauf = async () => {
    let person_id = keycloak.tokenParsed.preferred_username;

    // Lagerware
    let bestandBuyObjects = [];
    for (let i = 0; i < produkt.length; i++) {
        let einkaufsmenge = produkt[i].genommeneMenge;
        if (einkaufsmenge === undefined || einkaufsmenge === '0') {
        } else {
          //to get id of bestandEinkauf
            const newBestandBuyObject = {
                amount: einkaufsmenge,
                bestandEntity: {
                    id: produkt[i].id,
                    kategorie: {
                      id: produkt[i].kategorie.id,
                      mixable: produkt[i].kategorie.mixable,
                      name: produkt[i].kategorie.name
                    },
                    lagerbestand: {
                      einheit: {
                        id: produkt[i].lagerbestand.einheit.id,
                        name: produkt[i].lagerbestand.einheit.name
                      },
                      istLagerbestand: produkt[i].lagerbestand.istLagerbestand,
                      sollLagerbestand: produkt[i].lagerbestand.sollLagerbestand
                    },
                    name: produkt[i].name,
                    preis: produkt[i].preis, 
                    verfuegbarkeit: produkt[i].verfuegbarkeit
                },
            };
            try {
              const response = await api.createBestandBuyObject(newBestandBuyObject);
              const data = await response.json();
              bestandBuyObjects.push(data);
            } catch (error) {
              toast.error("Fehler beim Übermitteln des Einkaufs. Bitte versuchen Sie es erneut.");
            }   
        }
    }

    // Brot
    let bestellungsEinkaufe = [];
    for (let i = 0; i < brot.length; i++) {
        let einkaufsmenge = brot[i].genommeneMenge;
        if (einkaufsmenge === undefined || einkaufsmenge === '0') {
        } else {
          const brotEinkauf = {
              amount: einkaufsmenge,
              bestellung: {
                type: "brot",
                bestellmenge: brot[i].bestellmenge,
                datum: brot[i].datum,
                id: brot[i].id,
                personId: brot[i].personId,
                brotbestand: {
                  gewicht: brot[i].brotbestand.gewicht,
                  id: brot[i].brotbestand.id,
                  name: brot[i].brotbestand.name,
                  preis: brot[i].brotbestand.preis,
                  verfuegbarkeit: brot[i].brotbestand.verfuegbarkeit
                },
              },
            };
            bestellungsEinkaufe.push(brotEinkauf);
        }
    }

    // Frisch
    for (let i = 0; i < frisch.length; i++) {
        let einkaufsmenge = frisch[i].genommeneMenge;
        if (einkaufsmenge === undefined || einkaufsmenge === '0') {
        } else {
          const frischEinkauf = {
              amount: einkaufsmenge,
              bestellung: {
                type: "frisch",
                datum: frisch[i].datum,
                bestellmenge: frisch[i].bestellmenge,
                id: frisch[i].id,
                personId: frisch[i].personId,
                frischbestand: {
                  einheit: {
                    id: frisch[i].frischbestand.einheit.id,
                    name: frisch[i].frischbestand.einheit.name
                  },
                  gebindegroesse: frisch[i].frischbestand.gebindegroesse,
                  herkunftsland: frisch[i].frischbestand.herkunftsland,
                  id: frisch[i].frischbestand.id,
                  kategorie: {
                    id: frisch[i].frischbestand.kategorie.id,
                    name: frisch[i].frischbestand.kategorie.name
                  },
                  name: frisch[i].frischbestand.name,
                  preis: frisch[i].frischbestand.preis,
                  verfuegbarkeit: frisch[i].frischbestand.verfuegbarkeit
                },
              },
            };
            bestellungsEinkaufe.push(frischEinkauf);
        }
    }

    console.log(bestellungsEinkaufe);
    try {
      const einkaufData = {
        //Bestand = Lagerware
        bestandEinkauf: bestandBuyObjects,
        // Bestellung = Brot & Frischware
        bestellungsEinkauf: bestellungsEinkaufe,
        personId: person_id 
      };
      const response = await api.createEinkauf(einkaufData);
      console.log(einkaufData);
      console.log(response);

      if (response.ok) {
        clearInputFields();
        toast.success("Ihr Einkauf wurde übermittelt. Vielen Dank!");
      } else {
        toast.error("Fehler beim Übermitteln des Einkaufs. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      console.error("Fehler beim Übermitteln des Einkaufs:", error);
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="main-einkauf">
      <Accordion defaultExpanded>
        <AccordionSummary aria-controls="panel1-content" id="panel1-header" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom>Frischwaren-Einkauf</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FrischEinkauf onPriceChange={handleFrischPriceChange} handleFrisch={handleFrisch}/>
          <h5>Frisch-Preis: <NumberFormatComponent value={totalFrischPrice.toFixed(2)} /> €</h5>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom>Brot-Einkauf</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BrotEinkauf onPriceChange={handleBrotPriceChange} handleBrot={handleBrot}/>
          <h5>Brot-Preis: <NumberFormatComponent value={totalBrotPrice.toFixed(2)} /> €</h5>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom>Lagerware-Einkauf</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <LagerwareEinkauf onPriceChange={handleProduktPriceChange} handleProdukt={handleProdukt} />
          <h5>Lagerwaren-Preis: <NumberFormatComponent value={totalProduktPrice.toFixed(2)} /> €</h5>
        </AccordionDetails>
      </Accordion>

      <div className="price-section">
        <div className="price-details">
          <div>
            <h4>Frischware:</h4>
            <h4>Brot:</h4>
            <h4>Lagerware:</h4>
            <h4>5 % Lieferkosten:</h4>
          </div>
          <div className="total-price">
            <h4><span className="price"><NumberFormatComponent value={totalFrischPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
            <h4><span className="price"><NumberFormatComponent value={totalBrotPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
            <h4><span className="price"><NumberFormatComponent value={totalProduktPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
            <h4><span className="price"><NumberFormatComponent value={deliveryCost.toFixed(2)} /></span> <span className="currency">€</span></h4>
          </div>
        </div>
        <hr className="hr-divider" id="sum-divider" />
        <div className="total-price-section">
          <h4>Insgesamt:</h4>
          <h4><span className="price"><NumberFormatComponent value={totalPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
        </div>
        <EinkaufsDialog submitEinkauf={submitEinkauf} />
        <ToastContainer />
      </div>
    </div>
  );
}
