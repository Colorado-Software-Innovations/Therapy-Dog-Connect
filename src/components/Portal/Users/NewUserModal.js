import React, { useState, useContext } from 'react';
import AWS from 'aws-sdk';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { NotificationContext } from '../../../store/notification-context';
import useUser from '../../../hooks/users/useUsers';

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1', // Your region
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

// Helper function to validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Updated helper function to validate and format phone number in E.164
const formatPhoneNumber = (phone) => {
  // Strip out non-numeric characters except for the leading +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Ensure the phone number starts with +1 and has no extra +1 prefixes
  if (cleaned.startsWith('+1')) {
    return cleaned; // If it already starts with +1, return as is
  } else if (cleaned.startsWith('+')) {
    return cleaned; // If it starts with another country code, return as is
  } else if (cleaned.length <= 10) {
    return '+1' + cleaned; // Assume US number and prepend +1
  }

  return '+' + cleaned;
};

const validatePhoneNumber = (phone) => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

export default function UserFormModal({ venueId }) {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const { addPerson } = useUser();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!userType) newErrors.userType = 'User type is required';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Email is invalid';
    if (!confirmEmail) newErrors.confirmEmail = 'Confirm email is required';
    else if (email !== confirmEmail) newErrors.confirmEmail = 'Emails do not match';

    // Validate optional phone field
    if (phone && !validatePhoneNumber(phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newUser = { userType, firstName, lastName, email, phone };
      if (newUser.userType === 'Admin') {
        const params = {
          UserPoolId: process.env.REACT_APP_AWS_USER_POOL_ADMIN, // User pool ID
          Username: email,
          UserAttributes: [
            {
              Name: 'email',
              Value: email,
            },
            {
              Name: 'phone_number',
              Value: phone,
            },
            {
              Name: 'family_name',
              Value: lastName,
            },
            {
              Name: 'given_name',
              Value: firstName,
            },
            {
              Name: 'custom:venueId',
              Value: `${venueId}`,
            },
          ],
          DesiredDeliveryMediums: ['EMAIL'], // Send the invite via email
        };
        try {
          const result = await cognito.adminCreateUser(params).promise();
          if (result?.User?.Username) {
            const payload = {
              auth_user_id: result.User.Username,
              email: email,
              first_name: firstName,
              is_active: false,
              last_name: lastName,
              phone: phone,
              role: userType,
              venue_id: venueId,
            };
            await addPerson(payload);
          }
          notificationCtx.show('success', `User Invite sent to: ${email}`);
        } catch (error) {
          notificationCtx.show('error', `Failed to send User Invite. ${error}`);
        }
      }
      handleClose();
    }
  };
  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen} startIcon={<PersonAdd />}>
        Add User
      </Button>
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
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2" gutterBottom>
            Add New User
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle1">User Type</Typography>
            <RadioGroup row value={userType} onChange={(e) => setUserType(e.target.value)}>
              <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              <FormControlLabel value="Volunteer" control={<Radio />} label="Volunteer" />
            </RadioGroup>
            {errors.userType && <FormHelperText error>{errors.userType}</FormHelperText>}

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

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}
