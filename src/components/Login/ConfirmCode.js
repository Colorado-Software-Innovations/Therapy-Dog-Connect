import React, { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PasswordIcon from '@mui/icons-material/Password';
import Typography from '@mui/material/Typography';
import CopyRight from '../UI/CopyRight';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ConfirmCode = ({ handleConfirmationCode, confirmComplete }) => {
  const [confirmCode, setConfirmCode] = useState(new Array(6).fill(''));
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...confirmCode];
      newCode[index] = value;
      setConfirmCode(newCode);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const code = confirmCode.join('');
    setLoading(true); // Start loading animation

    try {
      const result = await handleConfirmationCode(e, code);
      if (result.isSignUpComplete) {
        setIsVerified(result.isSignUpComplete); // Verification successful
        setShowSuccessMessage(true); // Show success message
        setTimeout(() => {
          setShowSuccessMessage(false);
          setConfirmCode(new Array(6).fill('')); // Reset confirmation code
          confirmComplete();
        }, 3000); // Show success message for 3 seconds
      }
    } catch (error) {
      setShowErrorMessage(true);
      setConfirmCode(new Array(6).fill(''));
      setErrorMessage(`Oops something went wrong. ${error}`);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  // Check if all fields are filled and not loading
  const isAllFilledAndNotLoading = confirmCode.every((code) => code !== '') && !isLoading;

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <PasswordIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        We sent you a code to your email. Please confirm below.
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {confirmCode.map((_, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              value={confirmCode[index]}
              margin="normal"
              required
              name={`code-${index}`}
              label=""
              type="text"
              disabled={isVerified || isLoading}
              inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
              sx={{ width: '3rem' }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {isLoading && <CircularProgress />}
        </Box>
        {isVerified ? (
          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled>
            <CheckCircleOutlineIcon sx={{ marginRight: '0.5rem' }} />
            Confirmed
          </Button>
        ) : (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isAllFilledAndNotLoading}
          >
            Confirm
          </Button>
        )}
        {showSuccessMessage && (
          <Typography sx={{ mt: 2, color: '#275C4A', textAlign: 'center' }}>
            Code is valid!
          </Typography>
        )}
        {showErrorMessage && (
          <Typography sx={{ mt: 2, color: '#cc0000', textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        )}
        <CopyRight sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
};

export default ConfirmCode;
