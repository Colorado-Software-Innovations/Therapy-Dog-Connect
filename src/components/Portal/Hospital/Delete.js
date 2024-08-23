import { useState, useContext } from 'react';
import { Box, Button, Container, Grid, Modal, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HospitalContext } from '../../../store/hospital-context';
import { NotificationContext } from '../../../store/notification-context';
import useAddress from '../../../hooks/address/useAddress';
import useVenues from '../../../hooks/venues/useVenues';
import usePerson from '../../../hooks/users/useUsers';
import LoadingOverlay from '../../UI/LoadingOverlay';

const Delete = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const hospitalCtx = useContext(HospitalContext);
  const notificationCtx = useContext(NotificationContext);
  const { deleteAddress } = useAddress();
  const { deleteVenue } = useVenues();
  const { deletePerson } = usePerson();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleDeleteHospital = async () => {
    setIsLoading(true);

    const { id, Address, User, name, addressId, userId } = hospitalCtx.selectedHospital;

    try {
      await Promise.all([
        deletePerson(userId || User?.id),
        deleteVenue(id),
        deleteAddress(addressId || Address?.id),
      ]);

      notificationCtx.show('success', `Hospital: ${name} was deleted`);
      hospitalCtx.setHospitalData(hospitalCtx.hospitals.filter((h) => h.id !== id));
      navigate(`/admin/hospitals`);
    } catch (err) {
      notificationCtx.show('error', `Error during deletion: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingOverlay />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" color="error" gutterBottom>
        Danger Zone
      </Typography>

      <Box
        sx={{
          border: '2px solid red',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="body1">Deleting this hospital cannot be undone.</Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={handleOpenModal}>
          Delete Hospital
        </Button>
      </Box>

      <Modal open={open} onClose={handleCloseModal} aria-labelledby="delete-modal-title">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography id="delete-modal-title" variant="h6" align="center" gutterBottom>
            Are you sure you want to delete this hospital?
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button onClick={handleDeleteHospital} color="error" variant="contained">
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Container>
  );
};

export default Delete;
