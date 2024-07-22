import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import LoadingOverlay from '../../UI/LoadingOverlay';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { IconButton, Stack, Typography } from '@mui/material';
import { NotificationContext } from '../../../store/notification-context';
import Grid from '@mui/material/Grid';
import EditHospitalForm from './EditHospital';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import QrCode from '../../UI/QRCode';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import VisitRequests from './VisitRequest';
import BreadCrumb from '../../UI/BreadCrumb';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RoomTable from './AddRoom';
import useAddress from '../../../hooks/address/useAddress';
import useVenues from '../../../hooks/venues/useVenues';
import usePerson from '../../../hooks/users/useUsers';
import { QR_URL } from '../../../constants/restfulQueryConstants';
import Users from '../Users';
import VolunteerTypes from './VolunteerTypes';

const Details = () => {
  const [hospital, setHospital] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const notificationCtx = useContext(NotificationContext);
  const params = useParams();
  const { updateAddress } = useAddress();
  const { fetchVenueById, updateVenue } = useVenues();
  const { updatePerson } = usePerson();

  const fetchHospitalDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchVenueById(params.id);
      const responseBody = JSON.parse(response.data['body-json'].body);
      if (responseBody.length) {
        const users = responseBody[0].Users;
        const admins = users.filter((u) => u.role === 'Admin' && u.is_active);
        setAdmin(admins[0]);
      }
      setHospital(responseBody[0]);
    } catch (error) {
      notificationCtx.show('error', `Failed to fetch hospital. ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [fetchVenueById, notificationCtx, params.id]);

  useEffect(() => {
    fetchHospitalDetails();
  }, [fetchHospitalDetails]);

  const handleSave = async (values) => {
    try {
      const hospitalPayload = {
        name: values.hospital_name,
        is_active: values.is_active,
      };
      const contactPayload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        role: 'Admin',
      };
      const addressPayload = {
        street_1: values.street_1,
        street_2: values.street_2,
        city: values.city,
        state: values.state,
        postal_code: values.postal_code,
      };

      const venuePromise = updateVenue(hospital.id, hospitalPayload);
      const addressPromise = updateAddress(hospital.Address.id, addressPayload);
      const personPromise = updatePerson(hospital.User.id, contactPayload);

      await Promise.all([venuePromise, addressPromise, personPromise]);

      notificationCtx.show('success', `Hospital: ${hospital.id} updated successfully.`);
      fetchHospitalDetails();
      setIsEditing(false);
    } catch (error) {
      notificationCtx.show('error', `Oops something went wrong: ${error}`);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const Item = styled(Paper)(({ theme, display }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    height: '100%',
    color: theme.palette.text.secondary,
    display: display,
  }));

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  return (
    <>
      {hospital ? (
        <>
          <BreadCrumb
            middleCrumb={{ link: '/admin/hospitals', text: 'Hospitals' }}
            lastCrumb={hospital.name}
          />
          <Grid style={{ marginTop: 20 }}>
            {isEditing ? (
              <EditHospitalForm
                buttonText={'Save'}
                handleSave={handleSave}
                handleCancelClick={handleCancelClick}
                initialValues={{
                  id: hospital.id,
                  email: hospital.User.email,
                  first_name: hospital.User.first_name,
                  last_name: hospital.User.last_name,
                  phone: hospital.User.phone,
                  hospital_name: hospital.name,
                  street_1: hospital.Address.street_1,
                  street_2: hospital.Address.street_2,
                  city: hospital.Address.city,
                  state: hospital.Address.state,
                  postal_code: hospital.Address.postal_code,
                  is_active: hospital.is_active,
                }}
              />
            ) : (
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} alignItems="center" justifyContent="left">
                  <Grid item xs={12}>
                    <Stack direction="row">
                      <Typography style={{ textAlign: 'left' }} variant="h4" component="h2">
                        {hospital.name}
                      </Typography>
                      <IconButton
                        style={{ height: 40, marginTop: 0, marginLeft: 5 }}
                        onClick={() => setIsEditing(true)}
                      >
                        <EditIcon style={{ height: 40 }} />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" style={{ textAlign: 'left', marginTop: 5 }}>
                      <LocationOnIcon style={{ fontSize: 24 }} />
                      <Typography style={{ marginLeft: 5 }}>
                        {hospital.Address.street_1} {hospital.Address.street_2}{' '}
                        {hospital.Address.city}, {hospital.Address.state},{' '}
                        {hospital.Address.postal_code}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      marginTop: 2.5,
                      marginLeft: 2.5,
                    }}
                  >
                    <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                      <Tab label="Details" />
                      <Tab label="Rooms" />
                      <Tab label="Users" />
                      <Tab label="Volunteer Types" />
                    </Tabs>
                  </Box>
                </Grid>
                <TabPanel value={tab} index={0}>
                  <Grid
                    container
                    rowSpacing={{ xs: 2, sm: 4, md: 4 }}
                    columnSpacing={{ xs: 2, sm: 4, md: 4 }}
                  >
                    <Grid item xs={6}>
                      <Item display="flex">
                        <Box m="auto">
                          <PersonIcon style={{ fontSize: 35 }} />
                          <Typography>
                            {admin?.first_name} {admin?.last_name}
                          </Typography>
                          <Typography>{admin?.phone}</Typography>
                          <Typography>{admin?.email}</Typography>
                        </Box>
                      </Item>
                    </Grid>
                    <Grid item xs={6}>
                      <Item style={{ textAlign: 'left' }} display="flex">
                        <QrCode
                          qrInput={QR_URL.replace(':id', hospital.id)}
                          message={
                            'This QR code is used in the patient room to request visits to this hospital. Click to Download'
                          }
                          hospitalName={hospital.name}
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={12}>
                      <Item>
                        <Typography
                          style={{ marginTop: 10, marginBottom: 10, textAlign: 'center' }}
                        >
                          Active Visits
                        </Typography>
                        <VisitRequests hospitalId={hospital.id} />
                      </Item>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <RoomTable hospitalId={params.id} isAdmin={true} />
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  <Users venue_id={hospital.id} />
                </TabPanel>
                <TabPanel value={tab} index={3}>
                  <VolunteerTypes />
                </TabPanel>
              </Box>
            )}
          </Grid>
        </>
      ) : (
        <Typography variant="h5" component="h2">
          No hospital data found.
        </Typography>
      )}
    </>
  );
};

export default Details;
