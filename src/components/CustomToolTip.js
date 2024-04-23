import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export default CustomTooltip;
