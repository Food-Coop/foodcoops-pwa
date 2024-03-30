import React from 'react';

const useNumberFormat = () => {
  const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(number);
  };

  return { formatNumber };
};

const NumberFormatComponent = ({ value }) => {
  const { formatNumber } = useNumberFormat();

  return <span>{formatNumber(value)}</span>;
};

export default NumberFormatComponent;
