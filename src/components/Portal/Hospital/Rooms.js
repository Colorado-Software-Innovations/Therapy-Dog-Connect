import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { HospitalContext } from '../../../store/hospital-context';
import { NotificationContext } from '../../../store/notification-context';
import useRooms from '../../../hooks/rooms/useRooms';
import LoadingOverlay from '../../UI/LoadingOverlay';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export default function Rooms({ hospitalId }) {
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [roomState, setRoomState] = useState({ isLoading: true, data: [] });
  const [editRowId, setEditRowId] = useState(null);
  const [editRowValue, setEditRowValue] = useState('');
  const [newRowValue, setNewRowValue] = useState('');

  const notificationCtx = useContext(NotificationContext);
  const hospitalCtx = useContext(HospitalContext);
  const params = useParams();
  const { addRoom, fetchRoomsByHospitalId, updateRoom } = useRooms();
  const hasFetched = useRef(false);

  const fetchRooms = useCallback(
    async (forceFetch = false) => {
      if (forceFetch || !hospitalCtx.selectedHospital?.rooms) {
        try {
          const response = await fetchRoomsByHospitalId(params.id);
          setRoomState({ isLoading: false, data: response || [] });
          hospitalCtx.setSelectedHospital((prev) => ({
            ...prev,
            rooms: response || [],
          }));
        } catch (error) {
          notificationCtx.show('error', `Failed to fetch room numbers. ${error}`);
        }
      } else {
        setRoomState({ isLoading: false, data: hospitalCtx.selectedHospital.rooms });
      }
    },
    [fetchRoomsByHospitalId, params.id, notificationCtx, hospitalCtx],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRooms(true);
      hasFetched.current = true;
    }
  }, [fetchRooms]);

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
      setEditRowId(null);
      fetchRooms(true);
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
      fetchRooms(true);
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
      editable: false,
      renderCell: (params) =>
        editRowId === params.id ? (
          <TextField
            value={editRowId === 'new' ? newRowValue : editRowValue}
            onChange={(e) =>
              handleEditCellChange({ id: params.id, field: 'number', value: e.target.value })
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
              icon={<SaveIcon />}
              label="Save"
              onClick={() =>
                processRowUpdate({
                  ...params.row,
                  number: editRowId === 'new' ? newRowValue : editRowValue,
                })
              }
              key="save"
            />,
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
            rows={roomState.data}
            columns={columns}
            editMode="row"
            density="compact"
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
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
