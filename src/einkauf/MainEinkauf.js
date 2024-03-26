import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
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
import './MainEinkauf.css';

export function MainEinkauf() {
  const [showFrischEinkauf, setShowFrischEinkauf] = useState(true);
  const [showBrotEinkauf, setShowBrotEinkauf] = useState(true);
  const [showLagerwareEinkauf, setShowLagerwareEinkauf] = useState(true);
  const [totalFrischPrice, setTotalFrischPrice] = useState(0);
  const [totalBrotPrice, setTotalBrotPrice] = useState(0);
  const [totalProduktPrice, setTotalProduktPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

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

  const submitEinkauf = () => {
    clearInputFields();
    toast.success("Ihr Einkauf wurde übermittelt. Vielen Dank!");
  };

  return (
    <div className="main-einkauf">
      <Accordion defaultExpanded>
        <AccordionSummary aria-controls="panel1-content" id="panel1-header" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom>Frischwaren-Einkauf</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FrischEinkauf onPriceChange={handleFrischPriceChange} />
          <h5 style={{ display: showFrischEinkauf ? 'block' : 'none' }}>Frisch-Preis: {totalFrischPrice.toFixed(2)} €</h5>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom>Brot-Einkauf</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BrotEinkauf onPriceChange={handleBrotPriceChange} />
          <h5 style={{ display: showBrotEinkauf ? 'block' : 'none' }}>Brot-Preis: {totalBrotPrice.toFixed(2)} €</h5>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom>Lagerware-Einkauf</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LagerwareEinkauf onPriceChange={handleProduktPriceChange} />
          <h5 style={{ display: showLagerwareEinkauf ? 'block' : 'none' }}>Lagerwaren-Preis: {totalProduktPrice.toFixed(2)} €</h5>
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
            <h4><span className="price">{totalFrischPrice.toFixed(2)}</span> <span className="currency">€</span></h4>
            <h4><span className="price">{totalBrotPrice.toFixed(2)}</span> <span className="currency">€</span></h4>
            <h4><span className="price">{totalProduktPrice.toFixed(2)}</span> <span className="currency">€</span></h4>
            <h4><span className="price">{deliveryCost.toFixed(2)}</span> <span className="currency">€</span></h4>
          </div>
        </div>
        <hr className="hr-divider" id="sum-divider" />
        <div className="total-price-section">
          <h4>Insgesamt:</h4>
          <h4><span className="price">{totalPrice.toFixed(2)}</span> <span className="currency">€</span></h4>
        </div>
        <Button className="confirm-button" variant="success" onClick={submitEinkauf}>
          Einkauf bestätigen
        </Button>
        <ToastContainer />
      </div>
    </div>
  );
}
