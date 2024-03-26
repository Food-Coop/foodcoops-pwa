import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CollapsibleSection from './CollapsibleSection';
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
      <CollapsibleSection
        title="Frischwaren-Einkauf"
        onToggle={() => setShowFrischEinkauf(!showFrischEinkauf)}
        isOpen={showFrischEinkauf}
      />
      <div style={{ display: showFrischEinkauf ? 'block' : 'none' }}>
        <FrischEinkauf onPriceChange={handleFrischPriceChange} />
      </div>
      <h5 style={{ display: showFrischEinkauf ? 'block' : 'none' }}>Frisch-Preis: {totalFrischPrice.toFixed(2)} €</h5>
      <hr className="hr-divider" />

      <CollapsibleSection
        title="Brot-Einkauf"
        onToggle={() => setShowBrotEinkauf(!showBrotEinkauf)}
        isOpen={showBrotEinkauf}
      />
      <div style={{ display: showBrotEinkauf ? 'block' : 'none' }}>
        <BrotEinkauf onPriceChange={handleBrotPriceChange} />
      </div>
      <h5 style={{ display: showBrotEinkauf ? 'block' : 'none' }}>Brot-Preis: {totalBrotPrice.toFixed(2)} €</h5>
      <hr className="hr-divider" />

      <CollapsibleSection
        title="Lagerware-Einkauf"
        onToggle={() => setShowLagerwareEinkauf(!showLagerwareEinkauf)}
        isOpen={showLagerwareEinkauf}
      />
      <div style={{ display: showLagerwareEinkauf ? 'block' : 'none' }}>
        <LagerwareEinkauf onPriceChange={handleProduktPriceChange} />
      </div>
      <h5 style={{ display: showLagerwareEinkauf ? 'block' : 'none' }}>Lagerwaren-Preis: {totalProduktPrice.toFixed(2)} €</h5>
      <hr className="hr-divider" />

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
