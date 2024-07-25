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
  const [roomState, setRoomState] = useState({
    isLoading: true,
    data: [],
  });
  const [editRowId, setEditRowId] = useState(null);
  const [editRowValue, setEditRowValue] = useState('');
  const [newRowValue, setNewRowValue] = useState('');
  const [isCellEditing, setIsCellEditing] = useState(false);
  const notificationCtx = useContext(NotificationContext);
  const hospitalCtx = useContext(HospitalContext);
  const params = useParams();
  const { addRoom, fetchRoomsByHospitalId, updateRoom } = useRooms();
  const hasFetched = useRef(false); // To prevent fetching rooms multiple times on initial load

  const fetchRooms = useCallback(
    async (forceFetch = false) => {
      if (forceFetch || !hospitalCtx.selectedHospital?.rooms) {
        try {
          const response = await fetchRoomsByHospitalId(params.id);
          setRoomState({
            isLoading: false,
            data: response || [],
          });
          hospitalCtx.setSelectedHospital((prev) => ({
            ...prev,
            rooms: response || [],
          }));
        } catch (error) {
          notificationCtx.show('error', `Failed to fetch room numbers. ${error}`);
        }
      } else {
        setRoomState({
          isLoading: false,
          data: hospitalCtx.selectedHospital.rooms,
        });
      }
    },
    [fetchRoomsByHospitalId, params.id, notificationCtx, hospitalCtx],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRooms(true); // Force fetch on first load
      hasFetched.current = true;
    }
  }, [fetchRooms]);

  const processRowUpdate = async (newRow) => {
    if (newRow.id === 'new') {
      try {
        await addRoom({ venue_id: hospitalId, number: newRow.number });
        notificationCtx.show('success', 'Room added successfully.');
        setIsAddingNewRow(false);
        fetchRooms(true); // Force fetch data after adding
      } catch (error) {
        notificationCtx.show('error', `Failed to add room. ${error}`);
      }
    } else {
      try {
        await updateRoom(newRow.id, newRow);
        notificationCtx.show('success', 'Room updated successfully.');
        fetchRooms(true); // Force fetch data after updating
      } catch (error) {
        notificationCtx.show('error', `Failed to update room. ${error}`);
      }
    }
    return newRow;
  };

  const handleProcessRowUpdateError = (error) => {
    notificationCtx.show('error', `Update failed: ${error.message}`);
  };

  const handleAddRow = () => {
    if (!isAddingNewRow) {
      setIsAddingNewRow(true);
      const id = 'new';
      setRoomState((prev) => ({
        ...prev,
        data: [{ id, number: '' }, ...prev.data],
      }));
      setEditRowId(id);
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

  const handleSaveClick = async () => {
    const updatedRow =
      editRowId === 'new'
        ? { id: 'new', number: newRowValue }
        : { id: editRowId, number: editRowValue };
    await processRowUpdate(updatedRow);
    setEditRowId(null);
    setEditRowValue('');
    setNewRowValue('');
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditRowValue('');
    setNewRowValue('');
  };

  const handleEditCellChange = (params) => {
    if (params.id === 'new') {
      setNewRowValue(params.props.value);
    } else {
      setEditRowValue(params.props.value);
    }
  };

  const handleEditCellStart = () => {
    setIsCellEditing(true);
  };

  const handleEditCellStop = () => {
    setIsCellEditing(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
      field: 'number',
      headerName: 'Room Number',
      width: 200,
      editable: true,
      renderCell: (params) => {
        if (editRowId === params.id) {
          return (
            <TextField
              value={editRowId === 'new' ? newRowValue : editRowValue}
              onChange={(e) =>
                editRowId === 'new'
                  ? setNewRowValue(e.target.value)
                  : setEditRowValue(e.target.value)
              }
              variant="standard"
              size="small"
            />
          );
        }
        return <span>{params.value}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      type: 'actions',
      getActions: (params) => {
        if (isAddingNewRow && params.id === 'new') {
          return [
            <GridActionsCellItem
              icon={<CloseIcon />}
              label="Cancel"
              onClick={handleCancelAddRow}
              key="cancel"
            />,
          ];
        }
        if (editRowId === params.id) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick}
              key="save"
              disabled={isCellEditing}
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
            onEditCellChange={handleEditCellChange}
            onCellEditStart={handleEditCellStart}
            onCellEditStop={handleEditCellStop}
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
