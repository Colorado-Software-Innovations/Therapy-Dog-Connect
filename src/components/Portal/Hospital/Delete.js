import { useState, useContext } from 'react';
import { Box, Button, Container, Grid, Modal, Typography } from '@mui/material';

import { HospitalContext } from '../../../store/hospital-context';
import { NotificationContext } from '../../../store/notification-context';
import { useNavigate } from 'react-router-dom';
import useAddress from '../../../hooks/address/useAddress';
import useVenues from '../../../hooks/venues/useVenues';
import usePerson from '../../../hooks/users/useUsers';
import { Promise } from 'bluebird';
const Delete = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const hospitalCtx = useContext(HospitalContext);
  const notificationCtx = useContext(NotificationContext);
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const { deleteAddress } = useAddress();
  const { deleteVenue } = useVenues();
  const { deletePerson } = usePerson();

  const handleDeleteHospital = async () => {
    const { id, Address, User, name } = hospitalCtx.selectedHospital;
    const addressId = Address.id;
    const userId = User.id;

    const deleteVenuePromise = deleteVenue(id)
      .then((response) => response)
      .catch((err) => notificationCtx.show('error', `Error Deleting the venue: ${err}`));

    const deleteAddressPromise = deleteAddress(addressId)
      .then((response) => response)
      .catch((err) => notificationCtx.show('error', `Error Deleting the address: ${err}`));

    const deletePersonPromise = deletePerson(userId)
      .then((response) => response)
      .catch((err) => notificationCtx.show('error', `Error Deleting the person: ${err}`));

    Promise.all([deleteVenuePromise, deleteAddressPromise, deletePersonPromise])
      .then((resp) => {
        console.log(resp);
        notificationCtx.show('success', `Hospital: ${name} was deleted`);
      })
      .catch((err) => {
        notificationCtx.show('error', `${err}`);
      })
      .finally(() => {
        hospitalCtx.setHospitalData(hospitalCtx.hospitals.filter((h) => h.id !== id));
        navigate(`/admin/hospitals`);
      });
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    justifyContent: 'center',
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
  };
  return (
    <Container>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ textAlign: 'center' }}
          >
            Are you sure you want to delete this hospital?
          </Typography>

          <Grid container spacing={2} style={{ textAlign: 'center', marginTop: 20 }}>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <Button onClick={handleDeleteHospital} color="error" variant="contained">
                Delete
              </Button>
            </Grid>
            <Grid item xs={6} tyle={{ textAlign: 'center' }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Typography variant="h6">Danger Zone</Typography>

      <Grid
        container
        spacing={2}
        style={{
          border: 'solid 2px red',
          marginTop: 20,
          paddingBottom: 20,
          borderRadius: 5,
        }}
      >
        <Grid item xs={4} style={{ textAlign: 'left' }}>
          <Button variant="outlined" color="error" onClick={handleOpenModal}>
            Delete Hospital
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="p">This action cannot be undone</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Delete;
