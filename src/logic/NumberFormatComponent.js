import React from 'react';

const useNumberFormat = () => {
  const formatNumber = (number, includeFractionDigits = true) => {
    if (includeFractionDigits) {
      return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(number);
    } else {
      return new Intl.NumberFormat('de-DE').format(number);
    }
  };

  return { formatNumber };
};

const NumberFormatComponent = ({ value, includeFractionDigits }) => {
  const { formatNumber } = useNumberFormat();

  return <span>{formatNumber(value, includeFractionDigits)}</span>;
};

export default NumberFormatComponent;