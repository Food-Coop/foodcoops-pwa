import React from 'react';
import './CollapsibleSection.css';

const CollapsibleSection = ({ title, onToggle, isOpen }) => (
  <div className="collapsible-section" onClick={onToggle}>
    <span className={isOpen ? 'icon-open' : 'icon-closed'} />
    <h5>{title}</h5>
  </div>
);

export default CollapsibleSection;
