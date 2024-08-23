/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Promise } from 'bluebird';
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext } from '../../../store/auth-context';
import { HospitalContext } from '../../../store/hospital-context';
import { NotificationContext } from '../../../store/notification-context';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import _ from 'lodash';
import { IconButton, TextField, Typography } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { STATES } from '../../../constants/states';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import isEmpty from 'lodash/isEmpty';
import LoadingButton from '@mui/lab/LoadingButton';
import LoadingOverlay from '../../UI/LoadingOverlay';
import Breadcrumb from '../../UI/BreadCrumb';
import useAddress from '../../../hooks/address/useAddress';
import useVenues from '../../../hooks/venues/useVenues';
import usePerson from '../../../hooks/users/useUsers';
import StatusCell from '../../UI/StatusCell';
import createUser from '../../Services/Cognito';
import phoneFormatter from '../../../utils/PhoneFormatter';

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'name', headerName: 'Hospital Name', width: 250 },
  {
    field: 'is_active',
    headerName: 'Active',
    width: 70,
    renderCell: (params) => {
      return <StatusCell status={params.row.is_active} />;
    },
  },
  {
    field: 'street_1',
    headerName: 'Street',
    width: 200,
    renderCell: (params) => {
      const streetValue =
        params.row.Address && params.row.Address.street_1
          ? params.row.Address.street_1
          : params.row.street_1;
      return <div className="rowitem">{streetValue}</div>;
    },
  },
  {
    field: 'street_2',
    headerName: 'Street2',
    width: 70,
    renderCell: (params) => {
      const streetValue =
        params.row.Address && params.row.Address.street_2
          ? params.row.Address.street_2
          : params.row.street_2;
      return <div className="rowitem">{streetValue}</div>;
    },
  },
  {
    field: 'city',
    headerName: 'City',
    width: 150,
    renderCell: (params) => {
      const cityValue =
        params.row.Address && params.row.Address.city ? params.row.Address.city : params.row.city;
      return <div className="rowitem">{cityValue}</div>;
    },
  },
  {
    field: 'state',
    headerName: 'State',
    width: 70,
    renderCell: (params) => {
      const stateValue =
        params.row.Address && params.row.Address.state
          ? params.row.Address.state
          : params.row.state;
      return <div className="rowitem">{stateValue}</div>;
    },
  },
  {
    field: 'postal_code',
    headerName: 'Postal Code',
    width: 250,
    renderCell: (params) => {
      const postalCodeValue =
        params.row.Address && params.row.Address.postal_code
          ? params.row.Address.postal_code
          : params.row.postal_code;
      return <div className="rowitem">{postalCodeValue}</div>;
    },
  },
];

export default function Hospital() {
  const [hospitalState, setHospitalState] = useState({
    isLoading: false,
    name: '',
    data: [],
  });
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newHospitalState, setNewHospitalState] = useState({
    name: '',
    address: {
      street_1: '',
      street_2: '',
      city: '',
      state: '',
      postal_code: '',
    },
    contact: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
  });
  const [nameError, setNameError] = useState(false);
  const [addressError, setAddressError] = useState({
    street_1: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [contactError, setContactError] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  });
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const hospitalCtx = useContext(HospitalContext);
  const notificationCtx = useContext(NotificationContext);
  const { addAddress } = useAddress();
  const { fetchAllVenues, addVenue } = useVenues();
  const { addPerson } = usePerson();

  useEffect(() => {
    Promise.try(() => {
      if (hospitalCtx.hospitals.length === 0) {
        fetchAllVenues()
          .then((response) => {
            const respBody = JSON.parse(response.data['body-json'].body);
            if (respBody && respBody.length) {
              setHospitalState((prevState) => ({
                ...prevState,
                isLoading: false,
                data: respBody,
              }));
              hospitalCtx.setHospitalData(respBody);
            }
          })
          .catch((error) => {
            notificationCtx.show('error', `Failed to fetch venues. : ${error}`);
          });
      } else {
        setHospitalState((prevState) => ({
          ...prevState,
          isLoading: false,
          data: hospitalCtx.hospitals,
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx.token, fetchAllVenues, hospitalCtx]);

  const handleRowClick = ({ row }) => {
    const selectedHospital = _.first(hospitalState.data.filter((data) => data.id === row.id));

    hospitalCtx.setSelectedHospital(selectedHospital);
    navigate(`${row.id}`);
  };

  const resetState = () => {
    setNameError(false);
    setAddressError({
      street_1: '',
      city: '',
      state: '',
      postal_code: '',
    });
    setContactError({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
    });

    setActiveStep(0);
  };

  const openCreateHospitalModal = () => {
    resetState();
    setOpen(true);
  };

  const handleStepOne = (hospitalName) => {
    if (hospitalName) {
      setNameError(false);
      setActiveStep(1);
      setNewHospitalState((prevValue) => {
        return {
          ...prevValue,
          name: hospitalName,
        };
      });
    } else if (!hospitalName) {
      setNameError(true);
    }
  };

  const handleStepTwo = (addressDetails) => {
    let addressIsValid = true;
    if (isEmpty(addressDetails.street_1)) {
      setAddressError((prev) => {
        return {
          ...prev,
          street_1: 'Street is required',
        };
      });
      addressIsValid = false;
    }
    if (isEmpty(addressDetails.city)) {
      setAddressError((prev) => {
        return {
          ...prev,
          city: 'City is required',
        };
      });
      addressIsValid = false;
    }
    if (isEmpty(addressDetails.state)) {
      setAddressError((prev) => {
        return {
          ...prev,
          state: 'State is required',
        };
      });
      addressIsValid = false;
    }
    if (isEmpty(addressDetails.postal_code)) {
      setAddressError((prev) => {
        return {
          ...prev,
          postal_code: 'Postal Code is required',
        };
      });
      addressIsValid = false;
    }

    if (addressIsValid) {
      setAddressError({
        street_1: '',
        city: '',
        state: '',
        postal_code: '',
      });
      setNewHospitalState((prevValue) => {
        return {
          ...prevValue,
          address: addressDetails,
        };
      });
      setActiveStep(2);
    }
  };

  const handleStepThree = (contactDetails) => {
    let contactIsValid = true;
    setIsLoading(true);
    if (isEmpty(contactDetails.first_name)) {
      setContactError((prev) => {
        return {
          ...prev,
          first_name: 'First name is required',
        };
      });
      contactIsValid = false;
    }
    if (isEmpty(contactDetails.last_name)) {
      setContactError((prev) => {
        return {
          ...prev,
          last_name: 'Last name is required',
        };
      });
      contactIsValid = false;
    }
    if (isEmpty(contactDetails.phone)) {
      setContactError((prev) => {
        return {
          ...prev,
          phone: 'Phone is required',
        };
      });
      contactIsValid = false;
    }
    if (isEmpty(contactDetails.email)) {
      setContactError((prev) => {
        return {
          ...prev,
          email: 'Email is required',
        };
      });
      contactIsValid = false;
    }

    if (!isEmpty(contactDetails.email)) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!contactDetails.email.match(emailRegex)) {
        contactIsValid = false;
        setContactError((prev) => {
          return {
            ...prev,
            email: 'Email is invalid',
          };
        });
      }
    }

    if (contactIsValid) {
      setNewHospitalState((prevValue) => {
        return {
          ...prevValue,
          contact: contactDetails,
        };
      });
      generateHospital(contactDetails);
    }
    setIsLoading(false);
  };

  const generateHospital = (contactDetails) => {
    setOpen(false);
    setHospitalState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const hospitalPayload = {
      name: newHospitalState.name,
      is_active: false,
    };

    addVenue(hospitalPayload)
      .then(async (hospitalResponse) => {
        if (hospitalResponse.status === 200) {
          const hospitalResponseBody = JSON.parse(hospitalResponse.data['body-json'].body);
          const venue_id = hospitalResponseBody.id;

          const contactPayload = {
            first_name: contactDetails.first_name,
            last_name: contactDetails.last_name,
            email: contactDetails.email,
            phone: phoneFormatter(contactDetails.phone),
            role: 'Admin',
            is_active: true,
            venue_id, // Include venue_id in the contact payload
          };
          await createUser({
            UserPoolId: process.env.REACT_APP_AWS_USER_POOL_VOLUNTEER,
            Username: contactDetails.email,
            UserAttributes: [
              {
                Name: 'email',
                Value: contactDetails.email,
              },
              {
                Name: 'phone_number',
                Value: phoneFormatter(contactDetails.phone),
              },
              {
                Name: 'family_name',
                Value: contactDetails.last_name,
              },
              {
                Name: 'given_name',
                Value: contactDetails.first_name,
              },
              {
                Name: 'custom:venueId',
                Value: `${venue_id}`,
              },
            ],
            DesiredDeliveryMediums: ['EMAIL'],
          });

          return addPerson(contactPayload).then((contactResponse) => {
            if (contactResponse.status === 200) {
              const contactResponseBody = JSON.parse(contactResponse.data['body-json'].body);

              const addressPayload = {
                street_1: newHospitalState.address.street_1,
                street_2: newHospitalState.address.street_2,
                city: newHospitalState.address.city,
                state: newHospitalState.address.state,
                postal_code: newHospitalState.address.postal_code,
                country: 'USA',
                venue_id, // Include venue_id in the address payload
              };

              return addAddress(addressPayload).then((addressResponse) => {
                if (addressResponse.status === 200) {
                  const addressResponseBody = JSON.parse(addressResponse.data['body-json'].body);
                  notificationCtx.show(
                    'success',
                    `Hospital: ${hospitalResponseBody.name} created successfully.`,
                  );

                  // Update the state with the new hospital
                  setHospitalState((prevState) => ({
                    ...prevState,
                    data: [
                      ...prevState.data,
                      {
                        id: venue_id,
                        name: newHospitalState.name,
                        is_active: false,
                        street_1: newHospitalState.address.street_1,
                        street_2: newHospitalState.address.street_2,
                        city: newHospitalState.address.city,
                        state: newHospitalState.address.state,
                        postal_code: newHospitalState.address.postal_code,
                        addressId: addressResponseBody.id,
                      },
                    ],
                    isLoading: false,
                  }));
                  handleClose();
                }
              });
            }
          });
        }
      })
      .catch((error) => {
        notificationCtx.show('error', `Oops something went wrong: ${error}`);
        setHospitalState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      });
  };

  const steps = ['Name', 'Address', 'Contact'];

  const StepOne = ({ handleContinue, nameError }) => {
    const [name, setName] = useState('');
    const handleHospitalNameChange = (e) => {
      setName(e.target.value);
    };
    return (
      <Grid container spacing={8}>
        <Grid style={{ marginTop: 60, textAlign: 'center' }} item xs={12}>
          <Typography variant="h5">What is the name of the hospital?</Typography>
        </Grid>
        <Grid style={{ marginBottom: 50, textAlign: 'center' }} item xs={12}>
          <TextField
            color="primary"
            placeholder="Hospital Name"
            style={{ width: '80%' }}
            value={name}
            onChange={handleHospitalNameChange}
            error={nameError}
            helperText={nameError && 'Hospital Name is required'}
          />
        </Grid>
        <Grid style={{ textAlign: 'center' }} item xs={12}>
          <Button onClick={() => handleContinue(name)} variant="contained">
            Continue
          </Button>
        </Grid>
      </Grid>
    );
  };

  const StepTwo = ({ handleStepTwo, addressError }) => {
    const [address, setAddress] = useState({
      street_1: '',
      street_2: '',
      city: '',
      state: '',
      postal_code: '',
    });

    const handleChange = (e) => {
      setAddress((values) => ({ ...values, [e.target.name]: e.target.value }));
    };
    return (
      <Grid container spacing={2}>
        <Grid style={{ marginTop: 30, textAlign: 'center' }} item xs={12}>
          <Typography variant="h4">Where is the hospital Located?</Typography>
        </Grid>
        <Grid xs={12} item>
          <TextField
            fullWidth
            id="street_1"
            name="street_1"
            label="Street"
            onChange={handleChange}
            error={addressError.street_1}
            helperText={addressError.street_1}
          />
        </Grid>
        <Grid xs={12} item>
          {' '}
          <TextField
            fullWidth
            id="street_1"
            name="street_2"
            label="Street 2"
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} item>
          {' '}
          <TextField
            fullWidth
            id="city"
            name="city"
            label="City"
            onChange={handleChange}
            error={addressError.city}
            helperText={addressError.city}
          />
        </Grid>
        <Grid xs={6} item>
          <FormControl fullWidth error={addressError.state}>
            <InputLabel id="stateSelectLabel">State</InputLabel>
            <Select
              onChange={handleChange}
              labelId="stateSelectLabel"
              id="state"
              name="state"
              label="State"
              autoWidth
              error={addressError.state}
              helperText={addressError.state}
              style={{ textAlign: 'left', width: '100%' }}
            >
              {STATES.map((state, i) => {
                return (
                  <MenuItem key={`${i}-${state}`} value={state}>
                    {state}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{addressError.state}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={6} item>
          <TextField
            fullWidth
            id="postal_code"
            name="postal_code"
            label="Postal Code"
            onChange={handleChange}
            error={addressError.postal_code}
            helperText={addressError.postal_code}
          />
        </Grid>
        <Grid style={{ marginTop: 20, textAlign: 'center' }} item xs={12}>
          <Button
            onClick={() => {
              handleStepTwo(address);
            }}
            variant="contained"
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    );
  };

  const StepThree = ({ handleStepThree, contactError, isLoading }) => {
    const [contact, setContact] = useState({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
    });
    const handleChange = (e) => {
      setContact((values) => ({
        ...values,
        [e.target.name]: e.target.value,
      }));
    };
    return (
      <Grid container spacing={2}>
        <Grid style={{ marginTop: 30, textAlign: 'center' }} item xs={12}>
          <Typography variant="h4">Who is the hospital administrator?</Typography>
        </Grid>
        <Grid xs={6} item>
          <TextField
            fullWidth
            id="first_name"
            name="first_name"
            label="First Name"
            error={contactError.first_name}
            helperText={contactError.first_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={6} item>
          <TextField
            fullWidth
            id="last_name"
            name="last_name"
            label="Last Name"
            error={contactError.last_name}
            helperText={contactError.last_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} item>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone Number"
            error={contactError.phone}
            helperText={contactError.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} item>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            error={contactError.email}
            helperText={contactError.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid style={{ marginTop: 20, textAlign: 'center' }} item xs={12}>
          <LoadingButton
            onClick={() => {
              handleStepThree(contact);
            }}
            variant="contained"
            loading={isLoading}
          >
            Generate Hospital
          </LoadingButton>
        </Grid>
      </Grid>
    );
  };

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  if (hospitalState.isLoading) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <Breadcrumb
        middleCrumb={{
          link: 'http:localhost:3000/hospitals',
          text: 'Hospitals',
        }}
      ></Breadcrumb>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        style={{ borderRadius: 15 }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Grid container direction="row" justify="space-between" alignItems="center">
            <IconButton aria-label="close" onClick={handleClose} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: 20 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && <StepOne handleContinue={handleStepOne} nameError={nameError} />}
          {activeStep === 1 && (
            <StepTwo handleStepTwo={handleStepTwo} addressError={addressError} />
          )}
          {activeStep === 2 && (
            <StepThree
              handleStepThree={handleStepThree}
              contactError={contactError}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      <Grid container spacing={5}>
        <Grid item style={{ marginTop: 16 }}>
          <Button onClick={openCreateHospitalModal} variant="outlined">
            Create Hospital
          </Button>
        </Grid>
        <Grid xs={12} item>
          {hospitalState.isLoading ? (
            <LoadingOverlay />
          ) : (
            <DataGrid
              rows={hospitalState.data}
              columns={columns}
              onRowClick={handleRowClick}
              density="compact"
              loading={hospitalState.isLoading}
              pageSizeOptions={[25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 25 },
                },
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
