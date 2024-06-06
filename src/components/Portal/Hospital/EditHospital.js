import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { STATES } from '../../../constants/states';
import Delete from './Delete';

const validationSchema = yup.object({
  first_name: yup.string('Enter first name').trim().required('First name is required'),
  last_name: yup.string('Enter last name').trim().required('Last name is required'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .trim()
    .matches(/(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/g, {
      message: 'Please enter valid number.',
      excludeEmptyString: false,
    })
    .required('Phone number is required'),
  hospital_name: yup.string('Enter hospital name').trim().required('Hospital name is required'),
  street_1: yup.string('Enter Street').trim().required('Street is required'),
  city: yup.string('Enter city').trim().required('City is required'),
  state: yup.string('Select a State').trim().required('State is required'),
  postal_code: yup
    .string('Enter postal code')
    .trim()
    .required('Postal Code is required')
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, {
      message: 'Please enter a valid postal code.',
      excludeEmptyString: false,
    }),
});

const EditHospital = ({
  initialValues,
  saveIsLoading,
  handleCancelClick,
  handleSave,
  buttonText,
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="first_name"
                name="first_name"
                label="First Name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />
              <TextField
                fullWidth
                id="last_name"
                name="last_name"
                label="Last Name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="hospital_name"
                name="hospital_name"
                label="Hospital Name"
                value={formik.values.hospital_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.hospital_name && Boolean(formik.errors.hospital_name)}
                helperText={formik.touched.hospital_name && formik.errors.hospital_name}
              />
              <TextField
                fullWidth
                id="street_1"
                name="street_1"
                label="Street"
                value={formik.values.street_1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.street_1 && Boolean(formik.errors.street_1)}
                helperText={formik.touched.street_1 && formik.errors.street_1}
              />
              <TextField
                fullWidth
                id="street_2"
                name="street_2"
                label="Street 2"
                value={formik.values.street_2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
              <FormControl>
                <InputLabel id="stateSelectLabel">State</InputLabel>
                <Select
                  labelId="stateSelectLabel"
                  id="state"
                  name="state"
                  value={formik.values.state}
                  label="State"
                  onChange={formik.handleChange}
                  autoWidth
                  style={{ textAlign: 'left' }}
                >
                  {STATES.map((state, i) => {
                    return (
                      <MenuItem key={`${i}-${state}`} value={state}>
                        {state}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                id="postal_code"
                name="postal_code"
                label="Postal Code"
                value={formik.values.postal_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                helperText={formik.touched.postal_code && formik.errors.postal_code}
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      id="is_active"
                      name="is_active"
                      checked={formik.values.is_active}
                      value={formik.values.is_active}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Is Active"
                />
              </FormGroup>
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} style={{ margin: 10 }}>
          <LoadingButton loading={saveIsLoading} variant="contained" type="submit">
            {buttonText}
          </LoadingButton>
          <Button variant="outlined" onClick={handleCancelClick}>
            Cancel
          </Button>
        </Stack>
      </form>
      <Delete />
    </>
  );
};

export default EditHospital;
