import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Box,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import useVenues from '../../hooks/venues/useVenues';
import useVisits from '../../hooks/visits/useVisits';
import LoadingOverlay from '../UI/LoadingOverlay';

const Index = () => {
  const params = useParams();
  const hospitalId = params.id;
  const { fetchVenueById } = useVenues();
  const { requestVisit } = useVisits();
  const isMobile = useMediaQuery('(max-width:600px)'); // Check if screen width is mobile

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    roomNumber: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    roomNumber: false,
  });
  const [loading, setLoading] = useState(true);
  const [venueData, setVenueData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const [submitting, setSubmitting] = useState(false); // New state for button loading

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await fetchVenueById(hospitalId);
        setVenueData(response[0]);
      } catch (error) {
        setErrorMessage('Failed to load hospital information.');
      } finally {
        setLoading(false); // Ensure loading is turned off after fetch
      }
    };
    fetchHospital();
  }, [fetchVenueById, hospitalId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'firstName' || name === 'lastName') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value.trim() === '',
      }));
    } else if (name === 'roomNumber') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roomNumber: value.trim() === '' || isNaN(value),
      }));
    }
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.roomNumber &&
    !errors.roomNumber &&
    formData.termsAccepted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmitting(true); // Set submitting to true on form submit
      const payload = buildPayload(formData);
      try {
        const response = await requestVisit(payload);
        if (response && response.id) {
          setSuccessMessage('You are now on the active waiting list.');
          
        } else {
          setErrorMessage('Failed to add you to the active waiting list.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while submitting your request.');
      } finally {
        setSubmitting(false); // Reset submitting to false after request is done
        resetForm();
      }
    } else {
      alert('Please fill in all fields correctly and accept the terms.');
    }
  };

  const buildPayload = (data) => {
    return {
      patient_first_name: data.firstName,
      patient_last_name: data.lastName,
      venue_id: hospitalId,
      room_number: data.roomNumber,
    };
  };

  const resetForm = () => {
      setFormData({
        firstName: '',
        lastName: '',
        roomNumber: '',
        termsAccepted: false,
      });
  }
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (venueData && !venueData.is_active) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}
      >
        <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
          <Paper elevation={3} sx={{ padding: isMobile ? 2 : 4, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <ErrorIcon color="error" fontSize="large" />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              gutterBottom
              color="error"
              fontSize={isMobile ? '1.5rem' : '2rem'}
            >
              Hospital Not Active
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
              Unfortunately, this hospital is currently not active or not configured correctly.
              Please contact support for assistance.
            </Typography>
            <Box mt={3} display="flex" justifyContent="center">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => window.history.back()}
                sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
              >
                Go Back
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}
    >
      <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
        <Paper elevation={3} sx={{ padding: isMobile ? 2 : 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            fontSize={isMobile ? '1.75rem' : '2.5rem'}
          >
            Request a Visit
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              helperText={errors.firstName ? 'First name is required' : ''}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { fontSize: isMobile ? '0.9rem' : '1rem' } }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              helperText={errors.lastName ? 'Last name is required' : ''}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { fontSize: isMobile ? '0.9rem' : '1rem' } }}
            />
            <TextField
              label="Room Number"
              variant="outlined"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              error={errors.roomNumber}
              helperText={errors.roomNumber ? 'Valid room number is required' : ''}
              fullWidth
              margin="normal"
              required
              inputProps={{
                maxLength: 5, // limit length as needed
                inputMode: 'numeric', // restrict to numbers on mobile
                pattern: '[0-9]*', // enforce numeric input pattern
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
              }
              label="I agree to the terms and conditions"
              sx={{ mt: 2, fontSize: isMobile ? '0.8rem' : '1rem' }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontSize: isMobile ? '0.9rem' : '1rem' }}
              disabled={!isFormValid || submitting}
              startIcon={submitting ? <CircularProgress size={24} /> : null}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={Boolean(errorMessage)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Index;
