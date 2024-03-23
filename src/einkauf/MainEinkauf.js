// MainEinkauf.js
import React, { useState } from 'react';
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
  const [totalPrice, setTotalPrice] = useState(0);

  const handlePriceChange = (price) => {
    setTotalPrice(price);
  };

  return (
    <div className="main-einkauf">
      <CollapsibleSection
        title="Frischwaren-Einkauf"
        onToggle={() => setShowFrischEinkauf(!showFrischEinkauf)}
        isOpen={showFrischEinkauf}
      />
      <div style={{ display: showFrischEinkauf ? 'block' : 'none' }}>
        <FrischEinkauf onPriceChange={handlePriceChange} />
      </div>
      <hr className="hr-divider" />

      <CollapsibleSection
        title="Brot-Einkauf"
        onToggle={() => setShowBrotEinkauf(!showBrotEinkauf)}
        isOpen={showBrotEinkauf}
      />
      <div style={{ display: showBrotEinkauf ? 'block' : 'none' }}>
        <BrotEinkauf />
      </div>
      <hr className="hr-divider" />

      <CollapsibleSection
        title="Lagerware-Einkauf"
        onToggle={() => setShowLagerwareEinkauf(!showLagerwareEinkauf)}
        isOpen={showLagerwareEinkauf}
      />
      <div style={{ display: showLagerwareEinkauf ? 'block' : 'none' }}>
        <LagerwareEinkauf />
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
            <h4>{totalPrice} €</h4>
            <h4>0,00 €</h4>
            <h4>0,00 €</h4>
            <h4>0,00 €</h4>
          </div>
        </div>
        <hr className="hr-divider" id="sum-divider" />
        <div className="total-price-section">
          <h4>Insgesamt:</h4>
          <h4>0,00 €</h4>
        </div>
        <Button className="confirm-button" variant="success">
          Einkauf bestätigen
        </Button>
      </div>
    </div>
  );
}
