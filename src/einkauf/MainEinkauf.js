import React, { useState } from 'react';
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
          title="Frisch-Einkauf"
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
                <h5 style={{ textAlign: 'left', color: 'darkblue' }}>Frisch-Einkauf</h5>
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
      </div>
    </div>
  );
}
