import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import QRCode from 'qrcode';
import { Typography, Button } from '@mui/material';

const QrCode = ({ qrInput, message, hospitalName }) => {
  const generateQR = async () => {
    try {
      return await QRCode.toCanvas(document.getElementById('canvas'), qrInput);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  useEffect(() => {
    generateQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadQR = () => {
    var canvas = document.getElementById('canvas');
    var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    var link = document.createElement('a');
    link.download = `${hospitalName}-QRCode.png`;
    link.href = image;
    link.click();
  };
  return (
    <Box
      style={{
        textAlign: 'center',
      }}
    >
      <Button onClick={downloadQR}>
        <canvas id="canvas"></canvas>
      </Button>
      <Typography style={{ margin: 4 }}>{message}</Typography>
    </Box>
  );
};

export default QrCode;
