import React from 'react';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';

const PhoneNumberInput = ({ onChange }) => {
  return (
    <InputMask
      mask="+1 (999) 999-9999"
      maskChar={null}
      onChange={(e) => {
        const formattedValue = e.target.value.replace(/[^\d+]/g, '');
        onChange(formattedValue);
      }}
    >
      {() => <TextField margin="normal" type="tel" name="tel" label="Phone Number" fullWidth />}
    </InputMask>
  );
};

export default PhoneNumberInput;
