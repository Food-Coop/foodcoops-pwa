import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
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
      <hr className="hr-divider" />

      <CollapsibleSection
        title="Brot-Einkauf"
        onToggle={() => setShowBrotEinkauf(!showBrotEinkauf)}
        isOpen={showBrotEinkauf}
      />
      <div style={{ display: showBrotEinkauf ? 'block' : 'none' }}>
        <BrotEinkauf onPriceChange={handleBrotPriceChange} />
      </div>
      <hr className="hr-divider" />

      <CollapsibleSection
        title="Lagerware-Einkauf"
        onToggle={() => setShowLagerwareEinkauf(!showLagerwareEinkauf)}
        isOpen={showLagerwareEinkauf}
      />
      <div style={{ display: showLagerwareEinkauf ? 'block' : 'none' }}>
        <LagerwareEinkauf onPriceChange={handleProduktPriceChange} />
      </div>
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
            <h4>{totalFrischPrice.toFixed(2)} €</h4>
            <h4>{totalBrotPrice.toFixed(2)} €</h4>
            <h4>{totalProduktPrice.toFixed(2)} €</h4>
            <h4>{deliveryCost.toFixed(2)} €</h4>
          </div>
        </div>
        <hr className="hr-divider" id="sum-divider" />
        <div className="total-price-section">
          <h4>Insgesamt:</h4>
          <h4>{totalPrice.toFixed(2)} €</h4>
        </div>
        <Button className="confirm-button" variant="success">
          Einkauf bestätigen
        </Button>
      </div>
    </div>
  );
}
