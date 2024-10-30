/* eslint-disable no-undef */
import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  FormHelperText,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { NotificationContext } from '../../../../store/notification-context';
import useUser from '../../../../hooks/users/useUsers';
import useVolunteerTypes from '../../../../hooks/volunteerTypes/useVolunteerTypes';
import createUser from '../../../Services/Cognito';
import phoneFormatter from '../../../../utils/PhoneFormatter';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
const validatePhoneNumber = (phone) => /^\+[1-9]\d{1,14}$/.test(phone);

export default function UserFormModal({ venueId, handleClose, open }) {
  const notificationCtx = useContext(NotificationContext);

  // State hooks
  const [userType, setUserType] = useState('');
  const [volunteerType, setVolunteerType] = useState(null);
  const [volunteerTypes, setVolunteerTypes] = useState([]);
  const [loadingVolunteerTypes, setLoadingVolunteerTypes] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { addPerson } = useUser();
  const { getVolunteerTypes } = useVolunteerTypes();

  useEffect(() => {
    if (userType !== 'Volunteer') {
      setVolunteerTypes([]);
      setVolunteerType('');
      return;
    }

    const fetchVolunteerTypes = async () => {
      setLoadingVolunteerTypes(true);
      try {
        const types = await getVolunteerTypes(venueId);
        setVolunteerTypes(types);
      } catch (error) {
        notificationCtx.show('error', `Failed to fetch volunteer types: ${error}`);
      } finally {
        setLoadingVolunteerTypes(false);
      }
    };

    fetchVolunteerTypes();
  }, [userType, getVolunteerTypes, venueId, notificationCtx]);

  const validateForm = () => {
    let formErrors = {};

    if (!userType) formErrors.userType = 'User type is required';
    if (userType === 'Volunteer' && !volunteerType)
      formErrors.volunteerType = 'Volunteer Type is required';
    if (!firstName) formErrors.firstName = 'First name is required';
    if (!lastName) formErrors.lastName = 'Last name is required';
    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      formErrors.email = 'Email is invalid';
    }
    if (!confirmEmail) {
      formErrors.confirmEmail = 'Confirm email is required';
    } else if (email !== confirmEmail) {
      formErrors.confirmEmail = 'Emails do not match';
    }
    if (phone && !validatePhoneNumber(phone)) {
      formErrors.phone = 'Invalid phone number';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const newUser = { userType, volunteerType, firstName, lastName, email, phone };
    const params = generateCognitoParams(newUser);

    try {
      const result = await createUser(params);
      if (result?.User?.Username) {
        const payload = prepareUserPayload(result.User.Username);
        await addPerson(payload);
        notificationCtx.show('success', `User Invite sent to: ${email}`);
        handleClose();
      }
    } catch (error) {
      notificationCtx.show('error', `Failed to send User Invite. ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const generateCognitoParams = (newUser) => {
    const userPoolId =
      newUser.userType === 'Admin'
        ? process.env.REACT_APP_AWS_USER_POOL_ADMIN
        : process.env.REACT_APP_AWS_USER_POOL_VOLUNTEER;

    return {
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'phone_number', Value: phone },
        { Name: 'family_name', Value: lastName },
        { Name: 'given_name', Value: firstName },
        { Name: 'custom:venueId', Value: `${venueId}` },
      ],
      DesiredDeliveryMediums: ['EMAIL'],
    };
  };

  const prepareUserPayload = (username) => {
    const payload = {
      auth_user_id: username,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      role: userType,
      venue_id: venueId,
      is_active: false,
    };

    if (volunteerType) {
      payload.volunteer_type_id = volunteerType;
    }

    return payload;
  };

  const handlePhoneChange = (e) => {
    setPhone(phoneFormatter(e.target.value));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Add New User
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">User Type</Typography>
              <FormControl component="fieldset" error={!!errors.userType}>
                <RadioGroup row value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                  <FormControlLabel value="Volunteer" control={<Radio />} label="Volunteer" />
                </RadioGroup>
                {errors.userType && <FormHelperText>{errors.userType}</FormHelperText>}
              </FormControl>
            </Grid>

            {userType === 'Volunteer' && (
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.volunteerType} sx={{ mb: 3 }}>
                  <Tooltip title={loadingVolunteerTypes ? 'Loading volunteer types...' : ''} arrow>
                    <Select
                      aria-label="Select Volunteer Type"
                      value={volunteerType}
                      onChange={(e) => setVolunteerType(e.target.value)}
                      displayEmpty
                      disabled={loadingVolunteerTypes}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <Typography color="textSecondary">Select Volunteer Type</Typography>
                          );
                        }
                        return volunteerTypes.find((type) => type.id === selected)?.name || '';
                      }}
                      sx={{ borderRadius: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                    >
                      {volunteerTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Tooltip>
                  {loadingVolunteerTypes && (
                    <FormHelperText>Loading volunteer types...</FormHelperText>
                  )}
                  {!loadingVolunteerTypes && volunteerTypes.length === 0 && (
                    <FormHelperText error>
                      Failed to load volunteer types. Please try again later.
                    </FormHelperText>
                  )}
                  {errors.volunteerType && <FormHelperText>{errors.volunteerType}</FormHelperText>}
                </FormControl>
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                error={!!errors.confirmEmail}
                helperText={errors.confirmEmail}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone (Optional)"
                value={phone}
                onChange={handlePhoneChange}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="+11234567890"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{ mt: 2 }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}
