import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BrotEinkauf } from './BrotEinkauf';
import { FrischEinkauf } from './FrischEinkauf';
import { LagerwareEinkauf } from './LagerwareEinkauf';

const CollapsibleSection = ({ title, content, onToggle, isOpen }) => (
  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
    {isOpen ? (
      <span
        style={{
          marginRight: '5px',
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: '5px solid darkblue',
          transform: 'rotate(90deg)',
          color: 'yellow'
        }}
      />
    ) : (
        <span
        style={{ marginRight: '5px', width: '6px', borderTop: '3px solid darkblue'}}
      />
    )}
    <h5 onClick={onToggle} style={{ cursor: 'pointer', marginBottom: '0', color: 'darkblue' }}>
      {title}
    </h5>
  </div>
);

export function MainEinkauf() {
  const [showFrischEinkauf, setShowFrischEinkauf] = useState(true);
  const [showBrotEinkauf, setShowBrotEinkauf] = useState(true);
  const [showLagerwareEinkauf, setShowLagerwareEinkauf] = useState(true);

  return (
      <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ marginRight: '20px', borderRight: '5px solid lightgrey', padding: '20px' }}>
        <CollapsibleSection
          title="Frischwaren-Einkauf"
          onToggle={() => setShowFrischEinkauf(!showFrischEinkauf)}
          isOpen={showFrischEinkauf}
        />
        <CollapsibleSection
          title="Brot-Einkauf"
          onToggle={() => setShowBrotEinkauf(!showBrotEinkauf)}
          isOpen={showBrotEinkauf}
        />
        <CollapsibleSection
          title="Lagerware-Einkauf"
          onToggle={() => setShowLagerwareEinkauf(!showLagerwareEinkauf)}
          isOpen={showLagerwareEinkauf}
        />
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {showFrischEinkauf && (
            <div style={{ marginBottom: '10px' }}>
                <h5 style={{ textAlign: 'left', color: 'darkblue' }}>Frischwaren-Einkauf</h5>
                <FrischEinkauf />
                <hr style={{ borderTop: '3px solid lightgrey', margin: '0' }} />
            </div>
        )}
        {showBrotEinkauf && (
            <div style={{ marginBottom: '10px' }}>
                <h5 style={{ textAlign: 'left', color: 'darkblue' }}>Brot-Einkauf</h5>
                <BrotEinkauf />
                <hr style={{ borderTop: '3px solid lightgrey', margin: '0' }} />
            </div>
        )}
        {showLagerwareEinkauf && (
            <div style={{ marginBottom: '10px' }}>
                <h5 style={{ textAlign: 'left', color: 'darkblue' }}>Lagerware-Einkauf</h5>
                <LagerwareEinkauf />
                <hr style={{ borderTop: '3px solid lightgrey', margin: '0' }} />
            </div>
        )}
        <div>
            <div style={{ overflowX: "auto", width: "20%", margin: "auto", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div>
                    <h4 style={{ textAlign: "left", margin: "0" }}>Frischware:</h4>
                    <h4 style={{ textAlign: "left", margin: "0" }}>Brot:</h4>
                    <h4 style={{ textAlign: "left", margin: "0" }}>Lagerware:</h4>
                    <h4 style={{ textAlign: "left", margin: "0" }}>5 % Lieferkosten:</h4>
                    </div>
                    <div>
                    <h4 style={{ textAlign: "right", margin: "0" }}>0 €</h4>
                    <h4 style={{ textAlign: "right", margin: "0" }}>0 €</h4>
                    <h4 style={{ textAlign: "right", margin: "0" }}>0 €</h4>
                    <h4 style={{ textAlign: "right", margin: "0" }}>0 €</h4>
                    </div>
                </div>

                <hr style={{ borderTop: "1px solid black", margin: "10px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ textAlign: "left", margin: "0" }}>Insgesamt:</h4>
                    <h4 style={{ textAlign: "right", margin: "0" }}>0 €</h4>
                </div>

                <Button style={{ margin: "20px 0.25rem" }} variant="success">
                    Einkauf bestätigen
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}