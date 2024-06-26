import React, { useState, useContext, useEffect } from 'react';
import { Promise } from 'bluebird';
import { Grid, Button, IconButton, Modal, Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import isEmpty from 'lodash/isEmpty';
import { useParams } from 'react-router-dom';

import { NotificationContext } from '../../../store/notification-context';
import useRooms from '../../../hooks/rooms/useRooms';
export default function RoomTable({ hospitalId }) {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [error, setError] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const notificationCtx = useContext(NotificationContext);
  const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'number', headerName: 'Room Number', width: '200' },
  ];
  const params = useParams();
  const { addRoom, fetchRoomsByHospitalId } = useRooms();

  useEffect(() => {
    Promise.try(() => {
      fetchRoomsByHospitalId(hospitalId)
        .then((data) => {
          setRooms(data);
        })
        .catch((err) => {
          notificationCtx.show('error', `Error fetching rooms: ${err}`);
        });
    });
  }, [fetchRoomsByHospitalId, hospitalId, notificationCtx]);

  const AddRoomButton = () => {
    return (
      <Grid item xs={12} style={{ margin: 20 }}>
        <Button onClick={handleOpen} variant="contained" startIcon={<AddIcon />}>
          Add Room
        </Button>
      </Grid>
    );
  };

  useEffect(() => {
    Promise.try(() => {
      fetchRoomsByHospitalId(params.id)
        .then((data) => {
          setRooms(data);
        })
        .catch((err) => {
          notificationCtx.show('error', `Error fetching rooms. ${err}`);
        });
    });
  }, [fetchRoomsByHospitalId, notificationCtx, params.id]);

  const handleAddRoom = () => {
    if (isEmpty(roomNumber)) {
      setError('Please provide a room number');
    } else {
      Promise.try(() => {
        addRoom({
          number: roomNumber,
          venueId: hospitalId,
        }).then((response) => {
          if (response.status === 200) {
            notificationCtx.show('success', `Room: ${roomNumber} created successfully.`);
            //fetchRooms();
            setOpen(false);
          }
        });
      }).catch((error) => {
        notificationCtx.show('error', `Could not create room. Error: ${error}`);
      });
    }
  };

  const handleChange = (e) => {
    setRoomNumber(e.target.value);
  };
  const rows = rooms.map((room) => ({
    id: room.id,
    number: room.number,
  }));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5,
    p: 2,
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container>
            <Grid container direction="row" justify="center" alignItems="center">
              <IconButton aria-label="close" onClick={handleClose} sx={{ ml: 'auto' }}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <TextField
                id="outlined-basic"
                label="Room Number"
                variant="outlined"
                name="room"
                onChange={handleChange}
                error={error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: 20, textAlign: 'center' }}>
              <Button onClick={handleAddRoom} variant="contained">
                Add Room
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            density="compact"
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
          />
        </Grid>
        <AddRoomButton />
      </Grid>
    </>
  );
}
