import React, { useState, useContext } from 'react';
import { Grid, Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { NotificationContext } from '../../../../store/notification-context';
import useRooms from '../../../../hooks/rooms/useRooms';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

export default function Rooms({ hospitalId, fetchRooms, data }) {
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [roomState, setRoomState] = useState({ isLoading: false, data });
  const [editRowId, setEditRowId] = useState(null);
  const [rowValues, setRowValues] = useState({});

  const notificationCtx = useContext(NotificationContext);
  const { addRoom, updateRoom } = useRooms();

  // Handle saving changes to the row (new or existing)
  const handleSaveRow = async (id) => {
    const finalRoomNumber = rowValues[id]?.number.trim();

    if (!finalRoomNumber) {
      notificationCtx.show('error', 'Room number cannot be empty.');
      return;
    }
    try {
      if (id === 'new') {
        await addRoom({ venue_id: hospitalId, number: rowValues[id]?.number.trim() });
        notificationCtx.show('success', 'Room added successfully.');
      } else {
        await updateRoom(id, { id, number: finalRoomNumber });
        notificationCtx.show('success', 'Room updated successfully.');
      }

      setIsAddingNewRow(false);
      setEditRowId(null);
      fetchRooms(true);
    } catch (error) {
      notificationCtx.show(
        'error',
        `Failed to ${id === 'new' ? 'add' : 'update'} room. ${error.message}`,
      );
    }
  };

  // Handle deleting a row
  const handleDeleteRow = async (id) => {
    try {
      await updateRoom(id, { id, is_deleted: true });
      notificationCtx.show('success', 'Room deleted successfully.');
      fetchRooms(true);
    } catch (error) {
      notificationCtx.show('error', `Failed to delete room. ${error.message}`);
    }
  };

  // Handle adding a new row
  const handleAddRow = () => {
    if (!isAddingNewRow) {
      setIsAddingNewRow(true);
      setRoomState((prev) => ({
        ...prev,
        data: [{ id: 'new', number: '' }, ...prev.data],
      }));
      setEditRowId('new');
      setRowValues({ new: { number: '' } });
    }
  };

  // Handle canceling an edit
  const handleCancelClick = () => {
    setEditRowId(null);
    setRowValues({});
    setIsAddingNewRow(false);
  };

  // Handle edit cell change
  const handleEditCellChange = (id, field, value) => {
    setRowValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
      field: 'number',
      headerName: 'Room Number',
      width: 250,
      renderCell: (params) =>
        editRowId === params.id ? (
          <TextField
            value={rowValues[params.id]?.number ?? params.value}
            onChange={(e) => handleEditCellChange(params.id, 'number', e.target.value)}
            variant="standard"
            size="small"
            fullWidth
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      type: 'actions',
      getActions: (params) => {
        const { id } = params;
        if (editRowId === id) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => handleSaveRow(id)}
              key="save"
            />,
            <GridActionsCellItem
              icon={<CloseIcon />}
              label="Cancel"
              onClick={handleCancelClick}
              key="cancel"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => setEditRowId(id)}
            key="edit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteRow(id)}
            key="delete"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {roomState.isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="div">
                Room Management
              </Typography>
              <Button
                onClick={handleAddRow}
                variant="contained"
                startIcon={<Add />}
                disabled={isAddingNewRow}
                sx={{ mb: 2 }}
              >
                Add Room
              </Button>
            </Box>
          </Grid>

          <Grid item>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: 3,
                p: 2,
              }}
            >
              <DataGrid
                rows={roomState.data}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                autoHeight
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  '& .MuiDataGrid-cell': { px: 1.5 },
                  '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
