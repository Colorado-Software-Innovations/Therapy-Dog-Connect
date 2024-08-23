/* eslint-disable no-undef */
import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { NotificationContext } from '../../../../store/notification-context';
import useUser from '../../../../hooks/users/useUsers';
import useVolunteerTypes from '../../../../hooks/volunteerTypes/useVolunteerTypes';
import createUser from '../../../Services/Cognito';
import phoneFormatter from '../../../../utils/PhoneFormatter';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhoneNumber = (phone) => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

export default function UserFormModal({ venueId, handleClose, open }) {
  const notificationCtx = useContext(NotificationContext);

  const [userType, setUserType] = useState('');
  const [volunteerType, setVolunteerType] = useState('');
  const [volunteerTypes, setVolunteerTypes] = useState([]);
  const [loadingVolunteerTypes, setLoadingVolunteerTypes] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const { addPerson } = useUser();
  const { getVolunteerTypes } = useVolunteerTypes();

  useEffect(() => {
    const fetchVolunteerTypes = async () => {
      if (userType === 'Volunteer') {
        setLoadingVolunteerTypes(true);
        try {
          const volunteerTypes = await getVolunteerTypes(venueId);
          setVolunteerTypes(volunteerTypes);
        } catch (error) {
          console.error('Failed to fetch volunteer types:', error);
        } finally {
          setLoadingVolunteerTypes(false);
        }
      } else {
        setVolunteerTypes([]);
        setVolunteerType('');
      }
    };

    fetchVolunteerTypes();
  }, [getVolunteerTypes, userType, venueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!userType) newErrors.userType = 'User type is required';
    if (userType === 'Volunteer' && !volunteerType)
      newErrors.volunteerType = 'Volunteer Type is required';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Email is invalid';
    if (!confirmEmail) newErrors.confirmEmail = 'Confirm email is required';
    else if (email !== confirmEmail) newErrors.confirmEmail = 'Emails do not match';

    if (phone && !validatePhoneNumber(phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newUser = { userType, volunteerType, firstName, lastName, email, phone };
      let params;
      if (newUser.userType === 'Admin') {
        params = {
          UserPoolId: process.env.REACT_APP_AWS_USER_POOL_ADMIN,
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
      } else if (newUser.userType === 'Volunteer') {
        params = {
          UserPoolId: process.env.REACT_APP_AWS_USER_POOL_VOLUNTEER,
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
      }
      try {
        const result = await createUser(params);
        if (result?.User?.Username) {
          const payload = {
            auth_user_id: result.User.Username,
            email,
            first_name: firstName,
            is_active: false,
            last_name: lastName,
            phone,
            role: userType,
            venue_id: venueId,
          };
          if (volunteerType && volunteerType.id) {
            payload.volunteer_type_id = volunteerType.id;
          }
          await addPerson(payload);
        }
        notificationCtx.show('success', `User Invite sent to: ${email}`);
      } catch (error) {
        notificationCtx.show('error', `Failed to send User Invite. ${error}`);
      }
      handleClose();
    }
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = phoneFormatter(e.target.value);
    setPhone(formattedPhone);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
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
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Add New User
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Typography variant="subtitle1">User Type</Typography>
          <RadioGroup
            row
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
            <FormControlLabel value="Volunteer" control={<Radio />} label="Volunteer" />
          </RadioGroup>
          {errors.userType && <FormHelperText error>{errors.userType}</FormHelperText>}

          {userType === 'Volunteer' && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Volunteer Type
              </Typography>
              {loadingVolunteerTypes ? (
                <CircularProgress size={24} sx={{ mb: 2 }} />
              ) : (
                <Select
                  fullWidth
                  value={volunteerType}
                  onChange={(e) => setVolunteerType(e.target.value)}
                  displayEmpty
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select Volunteer Type
                  </MenuItem>
                  {volunteerTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {errors.volunteerType && (
                <FormHelperText error>{errors.volunteerType}</FormHelperText>
              )}
            </>
          )}

          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            error={!!errors.confirmEmail}
            helperText={errors.confirmEmail}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone (Optional)"
            value={phone}
            onChange={handlePhoneChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            placeholder="+11234567890"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: 'primary.main',
              ':hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
