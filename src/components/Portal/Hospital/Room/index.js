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
import StyledItem from '../../../UI/StyledItem';

export default function Rooms({ hospitalId, fetchRooms, data }) {
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [roomState, setRoomState] = useState({ isLoading: false, data });
  const [editRowId, setEditRowId] = useState(null);
  const [editRowValue, setEditRowValue] = useState('');
  const [newRowValue, setNewRowValue] = useState('');

  const notificationCtx = useContext(NotificationContext);
  const { addRoom, updateRoom } = useRooms();

  const processRowUpdate = async (updatedRow) => {
    try {
      // Use the value directly from state instead of relying on the stale params.row.number
      const finalRoomNumber =
        updatedRow.id === 'new' ? newRowValue : editRowValue || updatedRow.number;

      if (!finalRoomNumber.trim()) {
        throw new Error('Room number cannot be empty');
      }

      if (updatedRow.id === 'new') {
        await addRoom({ venue_id: hospitalId, number: finalRoomNumber });
        notificationCtx.show('success', 'Room added successfully.');
      } else {
        await updateRoom(updatedRow.id, { id: updatedRow.id, number: finalRoomNumber });
        notificationCtx.show('success', 'Room updated successfully.');
      }

      setIsAddingNewRow(false);
      setEditRowId(null);
      await fetchRooms(true);
    } catch (error) {
      notificationCtx.show(
        'error',
        `Failed to ${updatedRow.id === 'new' ? 'add' : 'update'} room. ${error.message}`,
      );
    }
  };

  const handleProcessRowUpdateError = (error) => {
    notificationCtx.show('error', `Update failed: ${error.message}`);
  };

  const handleAddRow = () => {
    if (!isAddingNewRow) {
      setIsAddingNewRow(true);
      setRoomState((prev) => ({
        ...prev,
        data: [{ id: 'new', number: '' }, ...prev.data],
      }));
      setEditRowId('new');
      setNewRowValue('');
    }
  };

  const handleCancelAddRow = () => {
    setRoomState((prev) => ({
      ...prev,
      data: prev.data.filter((row) => row.id !== 'new'),
    }));
    setIsAddingNewRow(false);
    setEditRowId(null);
    setNewRowValue('');
  };

  const handleDeleteRow = async (id) => {
    try {
      await updateRoom(id, { id: id, is_deleted: true });
      notificationCtx.show('success', 'Room deleted successfully.');
      await fetchRooms(true);
    } catch (error) {
      notificationCtx.show('error', `Failed to delete room. ${error.message}`);
    }
  };

  const handleEditClick = (id) => {
    const row = roomState.data.find((row) => row.id === id);
    if (row) {
      setEditRowId(id);
      setEditRowValue(row.number);
    }
  };

  const handleSaveClick = async (params) => {
    // Instead of using params.row.number, directly use editRowValue or newRowValue
    const finalRoomNumber = params.id === 'new' ? newRowValue : editRowValue;

    if (!finalRoomNumber.trim()) {
      notificationCtx.show('error', 'Room number cannot be empty.');
      return;
    }

    // Create an updatedRow object manually with the correct room number from state
    const updatedRow = { ...params.row, number: finalRoomNumber };
    await processRowUpdate(updatedRow);
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditRowValue('');
  };

  const handleEditCellChange = (e) => {
    if (editRowId === 'new') {
      setNewRowValue(e.target.value);
    } else {
      setEditRowValue(e.target.value);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
      field: 'number',
      headerName: 'Room Number',
      width: 200,
      editable: true,
      renderCell: (params) =>
        params.id === editRowId || (isAddingNewRow && params.id === 'new') ? (
          <TextField
            value={params.id === 'new' ? newRowValue : editRowValue}
            onChange={handleEditCellChange}
            variant="standard"
            size="small"
            fullWidth
          />
        ) : (
          <Typography>{params.value}</Typography>
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      type: 'actions',
      getActions: (params) => {
        if (params.id === editRowId || (isAddingNewRow && params.id === 'new')) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => handleSaveClick(params)}
              key="save"
            />,
            <GridActionsCellItem
              icon={<CloseIcon />}
              label="Cancel"
              onClick={params.id === 'new' ? handleCancelAddRow : handleCancelClick}
              key="cancel"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(params.id)}
            key="edit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteRow(params.id)}
            key="delete"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {roomState.isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {!roomState.isLoading && (
        <Grid container direction="column" spacing={2}>
          <StyledItem>
            <Grid justifyContent="flex-start">
              <Button
                onClick={handleAddRow}
                variant="contained"
                startIcon={<Add />}
                disabled={isAddingNewRow}
                sx={{ mb: 2 }}
              >
                Add Room
              </Button>
            </Grid>

            <Grid item>
              {roomState.data.length > 0 ? (
                <DataGrid
                  rows={roomState.data}
                  columns={columns}
                  editMode="row"
                  density="compact"
                  processRowUpdate={processRowUpdate}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                  pageSizeOptions={[5, 10, 25, 50]}
                  autoHeight
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: 3,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    There are no rooms configured at this time.
                  </Typography>
                </Box>
              )}
            </Grid>
          </StyledItem>
        </Grid>
      )}
    </Box>
  );
}
