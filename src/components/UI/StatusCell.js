import React from 'react';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
const StatusCell = ({ status }) => {
  if (status) {
    return <ToggleOffIcon sx={{ color: 'green' }} />;
  }
  return <ToggleOnIcon sx={{ color: '#c83542' }} />;
};

export default StatusCell;
