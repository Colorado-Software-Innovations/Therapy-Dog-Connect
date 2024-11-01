import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  IconButton,
  Stack,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Card,
  Divider,
  Button,
} from '@mui/material';
import StyledItem from '../../UI/StyledItem';
import LoadingOverlay from '../../UI/LoadingOverlay';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';
import QrCode from '../../UI/QRCode';
import BreadCrumb from '../../UI/BreadCrumb';
import VisitRequests from './VisitRequests';
import Rooms from './Room';
import Users from './Users';
import VolunteerTypes from './VolunteerTypes/index';
import EditHospitalForm from './EditHospital';
import { NotificationContext } from '../../../store/notification-context';
import { HospitalContext } from '../../../store/hospital-context';
import useAddress from '../../../hooks/address/useAddress';
import useVenues from '../../../hooks/venues/useVenues';
import useUsers from '../../../hooks/users/useUsers';
import useRooms from '../../../hooks/rooms/useRooms';
import useVolunteerTypes from '../../../hooks/volunteerTypes/useVolunteerTypes';
import { QR_URL } from '../../../constants/restfulQueryConstants';

// Custom Tab styling
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    height: '4px',
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  '&.Mui-selected': {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.main,
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.action.focus,
  },
}));

const StyledQrCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

const Details = () => {
  const { fetchRoomsByHospitalId } = useRooms();
  const { updateAddress } = useAddress();
  const { fetchVenueById, updateVenue } = useVenues();
  const { updatePerson, getUserByVenueId } = useUsers();
  const { getVolunteerTypes } = useVolunteerTypes();
  const hospitalCtx = useContext(HospitalContext);
  const notificationCtx = useContext(NotificationContext);
  const params = useParams();
  const hasFetched = useRef(false);

  const [hospitalData, setHospitalData] = useState({
    hospital: null,
    admin: null,
    rooms: [],
    users: [],
    volunteerTypes: [],
    loading: { hospital: true, rooms: true, users: true, volunteerTypes: true },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tab, setTab] = useState(0);

  const setLoadingState = (key, value) => {
    setHospitalData((prev) => ({
      ...prev,
      loading: { ...prev.loading, [key]: value },
    }));
  };

  const fetchHospitalDetails = useCallback(async () => {
    setLoadingState('hospital', true);
    try {
      const response = await fetchVenueById(params.id);
      const hospital = response[0];
      const admins = hospital?.users?.filter((u) => u.role === 'Admin' && u.is_active) || [];
      setHospitalData((prev) => ({
        ...prev,
        hospital,
        admin: admins[0],
      }));
    } catch (error) {
      notificationCtx.show('error', `Failed to fetch hospital: ${error}`);
    } finally {
      setLoadingState('hospital', false);
    }
  }, [fetchVenueById, notificationCtx, params.id]);

  const fetchRooms = useCallback(
    async (forceFetch = false) => {
      setLoadingState('rooms', true);
      if (forceFetch || !hospitalCtx.selectedHospital?.rooms) {
        try {
          const response = await fetchRoomsByHospitalId(params.id);
          setHospitalData((prev) => ({
            ...prev,
            rooms: response || [],
          }));
          hospitalCtx.setSelectedHospital((prev) => ({
            ...prev,
            rooms: response || [],
          }));
        } catch (error) {
          notificationCtx.show('error', `Failed to fetch rooms: ${error}`);
        } finally {
          setLoadingState('rooms', false);
        }
      } else {
        setHospitalData((prev) => ({
          ...prev,
          rooms: hospitalCtx.selectedHospital.rooms,
        }));
        setLoadingState('rooms', false);
      }
    },
    [fetchRoomsByHospitalId, params.id, notificationCtx, hospitalCtx],
  );

  const fetchUsers = useCallback(async () => {
    setLoadingState('users', true);
    try {
      const response = await getUserByVenueId(params.id);
      const users = response.map((user) => ({
        id: user.id,
        role: user.role,
        user: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        is_active: user.is_active,
      }));
      setHospitalData((prev) => ({
        ...prev,
        users,
      }));
    } catch (error) {
      notificationCtx.show('error', `Failed to fetch users: ${error}`);
    } finally {
      setLoadingState('users', false);
    }
  }, [getUserByVenueId, notificationCtx, params.id]);

  const fetchVolunteerTypes = useCallback(async () => {
    setLoadingState('volunteerTypes', true);
    try {
      const response = await getVolunteerTypes(params.id);
      setHospitalData((prev) => ({
        ...prev,
        volunteerTypes: response,
      }));
    } catch (error) {
      notificationCtx.show('error', `Failed to fetch volunteer types: ${error}`);
    } finally {
      setLoadingState('volunteerTypes', false);
    }
  }, [getVolunteerTypes, params.id, notificationCtx]);

  useEffect(() => {
    fetchHospitalDetails();
  }, [fetchHospitalDetails]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRooms(true);
      fetchUsers();
      fetchVolunteerTypes();
      hasFetched.current = true;
    }
  }, [fetchRooms, fetchUsers, fetchVolunteerTypes]);

  const handleSave = async (values) => {
    try {
      const promises = [
        updateVenue(hospitalData.hospital.id, {
          name: values.hospital_name,
          is_active: values.is_active,
        }),
        updateAddress(hospitalData.hospital.Address.id, {
          street_1: values.street_1,
          street_2: values.street_2,
          city: values.city,
          state: values.state,
          postal_code: values.postal_code,
        }),
        updatePerson(hospitalData.hospital.User.id, {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          role: 'Admin',
        }),
      ];
      await Promise.all(promises);
      notificationCtx.show('success', `Hospital ${hospitalData.hospital.id} updated successfully.`);
      fetchHospitalDetails();
      setIsEditing(false);
    } catch (error) {
      notificationCtx.show('error', `Failed to update hospital: ${error}`);
    }
  };

  const handleTabChange = (event, newValue) => setTab(newValue);

  const { hospital, rooms, users, volunteerTypes, loading } = hospitalData;
  const volunteerUsers = users.filter((u) => u.role === 'Volunteer');
  const QRLink = hospital ? QR_URL.replace(':id', hospital.id) : '';

  if (loading.hospital || loading.rooms || loading.users || loading.volunteerTypes) {
    return <LoadingOverlay />;
  }

  const handleGoToVisitPageClicked = () => {
    window.open(QRLink, '_blank');
  };

  return hospital ? (
    <>
      <BreadCrumb
        middleCrumb={{ link: '/admin/hospitals', text: 'Hospitals' }}
        lastCrumb={hospital.name}
      />
      <Grid style={{ marginTop: 20 }}>
        {isEditing ? (
          <EditHospitalForm
            buttonText="Save"
            handleSave={handleSave}
            handleCancelClick={() => setIsEditing(false)}
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Stack direction="row">
                  <Typography variant="h4">{hospital.name}</Typography>
                  <IconButton onClick={() => setIsEditing(true)}>
                    <EditIcon />
                  </IconButton>
                </Stack>
                <Stack direction="row" sx={{ marginTop: 1 }}>
                  <LocationOnIcon />
                  <Typography>{`${hospital.Address?.street_1} ${hospital.Address?.street_2}, ${hospital.Address?.city}, ${hospital.Address?.state}, ${hospital.Address?.postal_code}`}</Typography>
                </Stack>
              </Grid>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: 2.5 }}>
                <StyledTabs value={tab} onChange={handleTabChange} aria-label="styled tabs">
                  <StyledTab label="Patient Visits" />
                  <StyledTab
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        {rooms.length === 0 && <WarningIcon color="error" />}
                        <Typography>Rooms</Typography>
                      </Stack>
                    }
                  />
                  <StyledTab
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        {volunteerTypes.length === 0 && <WarningIcon color="error" />}
                        <Typography>Volunteer Types</Typography>
                      </Stack>
                    }
                  />

                  <StyledTab
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        {volunteerUsers.length === 0 && <WarningIcon color="error" />}
                        <Typography>Users</Typography>
                      </Stack>
                    }
                  />
                </StyledTabs>
              </Box>
            </Grid>
            <TabPanel value={tab} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button onClick={handleGoToVisitPageClicked} variant="contained">
                    Go To Visit Page
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <StyledQrCard>
                    <QrCode
                      qrInput={QRLink}
                      message="Scan to request visits"
                      hospitalName={hospital.name}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Click QR Code to download
                    </Typography>
                  </StyledQrCard>
                </Grid>

                <Grid item xs={12}>
                  <StyledItem>
                    <Typography variant="h6">Active Visits</Typography>
                    <Divider sx={{ my: 2 }} />
                    <VisitRequests hospitalId={hospital.id} />
                  </StyledItem>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Rooms hospitalId={params.id} fetchRooms={fetchRooms} data={rooms} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <VolunteerTypes
                venueId={hospital.id}
                data={volunteerTypes}
                fetchVolunteerTypes={fetchVolunteerTypes}
              />
            </TabPanel>
            <TabPanel value={tab} index={3}>
              <Users venue_id={hospital.id} data={users} />
            </TabPanel>
          </Box>
        )}
      </Grid>
    </>
  ) : (
    <Typography variant="h5">No hospital data found.</Typography>
  );
};

export default Details;
