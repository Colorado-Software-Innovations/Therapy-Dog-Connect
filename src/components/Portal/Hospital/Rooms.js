import React, { useState, useContext, } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { NotificationContext } from '../../../store/notification-context';
import useRooms from '../../../hooks/rooms/useRooms';
import LoadingOverlay from '../../UI/LoadingOverlay';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

export default function Rooms({ hospitalId, fetchRooms, data }) {
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [roomState, setRoomState] = useState({ isLoading: false, data });
  const [editRowId, setEditRowId] = useState(null);
  const [editRowValue, setEditRowValue] = useState('');
  const [newRowValue, setNewRowValue] = useState('');

  const notificationCtx = useContext(NotificationContext);

  const { addRoom, updateRoom } = useRooms();

  const processRowUpdate = async (newRow) => {
    try {
      if (newRow.id === 'new') {
        await addRoom({ venue_id: hospitalId, number: newRow.number });
        notificationCtx.show('success', 'Room added successfully.');
      } else {
        await updateRoom(newRow.id, newRow);
        notificationCtx.show('success', 'Room updated successfully.');
      }
      setIsAddingNewRow(false);
      fetchRooms(true); // Force fetch data after adding or updating
    } catch (error) {
      notificationCtx.show(
        'error',
        `Failed to ${newRow.id === 'new' ? 'add' : 'update'} room. ${error}`,
      );
    }
    return newRow;
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
      await updateRoom(id, { id, is_deleted: true });
      notificationCtx.show('success', 'Room deleted successfully.');
      fetchRooms(true); // Force fetch data after deleting
    } catch (error) {
      notificationCtx.show('error', `Failed to delete room. ${error}`);
    }
  };

  const handleEditClick = (id) => {
    const row = roomState.data.find((row) => row.id === id);
    if (row) {
      setEditRowId(id);
      setEditRowValue(row.number);
    }
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditRowValue('');
    setNewRowValue('');
  };

  const handleEditCellChange = (params) => {
    if (params.id === 'new') {
      setNewRowValue(params.value);
    } else {
      setEditRowValue(params.value);
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
        editRowId === params.id ? (
          <TextField
            value={editRowId === 'new' ? newRowValue : editRowValue}
            onChange={(e) =>
              editRowId === 'new' ? setNewRowValue(e.target.value) : setEditRowValue(e.target.value)
            }
            variant="standard"
            size="small"
          />
        ) : (
          <span>{params.value}</span>
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      type: 'actions',
      getActions: (params) => {
        if (editRowId === params.id || (isAddingNewRow && params.id === 'new')) {
          return [
            <GridActionsCellItem
              icon={<CloseIcon />}
              label="Cancel"
              onClick={editRowId === 'new' ? handleCancelAddRow : handleCancelClick}
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
    <div>
      {roomState.isLoading && <LoadingOverlay />}
      <Grid container style={{ marginTop: 20 }}>
        <Button
          onClick={handleAddRow}
          style={{ marginBottom: 10, marginRight: 10 }}
          variant="contained"
          startIcon={<Add />}
          disabled={isAddingNewRow}
        >
          Add Room
        </Button>
        <Grid item xs={12}>
          <DataGrid
            rows={roomState.data ? roomState.data : []}
            columns={columns}
            editMode="row"
            density="compact"
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            onEditCellChange={handleEditCellChange}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
