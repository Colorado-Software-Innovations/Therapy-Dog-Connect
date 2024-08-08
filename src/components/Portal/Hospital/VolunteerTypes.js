import React, { useEffect, useCallback, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Grid, TextField, Select, MenuItem } from '@mui/material';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import useVolunteerTypes from '../../../hooks/volunteerTypes/useVolunteerTypes';
import { NotificationContext } from '../../../store/notification-context';
import LoadingOverlay from '../../UI/LoadingOverlay';

const VolunteerTypes = () => {
  const notificationCtx = useContext(NotificationContext);
  const { getVolunteerTypes, updateVolunteerType, addVolunteerType } = useVolunteerTypes();
  const { id: venue_id } = useParams();

  const [volunteerTypesState, setVolunteerTypesState] = useState({
    isLoading: true,
    data: [],
  });
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [rowValues, setRowValues] = useState({});
  const hasFetched = useRef(false);

  const fetchVolunteerTypes = useCallback(async () => {
    setVolunteerTypesState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await getVolunteerTypes(venue_id);
      setVolunteerTypesState({ isLoading: false, data: response });
    } catch (error) {
      notificationCtx.show('error', `Failed to fetch volunteer types. ${error}`);
    }
  }, [getVolunteerTypes, venue_id, notificationCtx]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchVolunteerTypes();
      hasFetched.current = true;
    }
  }, [fetchVolunteerTypes]);

  const processRowUpdate = useCallback(
    async (newRow) => {
      try {
        if (newRow.id === 'new') {
          await addVolunteerType({
            venue_id,
            name: newRow.name,
            require_patient: newRow.require_patient,
          });
          notificationCtx.show('success', 'Volunteer type added successfully.');
        } else {
          await updateVolunteerType(newRow.id, {
            name: newRow.name,
            require_patient: newRow.require_patient,
          });
          notificationCtx.show('success', 'Volunteer type updated successfully.');
        }
        setIsAddingNewRow(false);
        setEditRowId(null);
        fetchVolunteerTypes();
      } catch (error) {
        notificationCtx.show(
          'error',
          `Failed to ${newRow.id === 'new' ? 'add' : 'update'} volunteer type. ${error}`,
        );
      }
      return newRow;
    },
    [addVolunteerType, updateVolunteerType, venue_id, fetchVolunteerTypes, notificationCtx],
  );

  const handleProcessRowUpdateError = (error) => {
    notificationCtx.show('error', `Update failed: ${error.message}`);
  };

  const handleAddRow = () => {
    setIsAddingNewRow(true);
    setEditRowId('new');
    setRowValues({ new: { name: '', require_patient: 0 } });
    setVolunteerTypesState((prev) => ({
      ...prev,
      data: [{ id: 'new', name: '', require_patient: 0 }, ...prev.data],
    }));
  };

  const handleCancelAddRow = () => {
    setIsAddingNewRow(false);
    setEditRowId(null);
    setRowValues({});
    setVolunteerTypesState((prev) => ({
      ...prev,
      data: prev.data.filter((row) => row.id !== 'new'),
    }));
  };

  const handleDeleteRow = async (id) => {
    try {
      await updateVolunteerType(id, { id, is_deleted: true });
      notificationCtx.show('success', 'Volunteer type deleted successfully.');
      fetchVolunteerTypes();
    } catch (error) {
      notificationCtx.show('error', `Failed to delete volunteer type. ${error}`);
    }
  };

  const handleEditClick = (id) => {
    const row = volunteerTypesState.data.find((row) => row.id === id);
    if (row) {
      setEditRowId(id);
      setRowValues((prev) => ({ ...prev, [id]: row }));
    }
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setRowValues({});
  };

  const handleEditCellChange = (params) => {
    setRowValues((prev) => ({
      ...prev,
      [params.id]: { ...prev[params.id], [params.field]: params.value },
    }));
  };

  const renderEditSelectCell = (params) => {
    return (
      <Select
        value={rowValues[params.id]?.require_patient ?? params.value}
        onChange={(e) =>
          handleEditCellChange({ id: params.id, field: 'require_patient', value: e.target.value })
        }
        variant="standard"
        size="small"
      >
        <MenuItem value={1}>Yes</MenuItem>
        <MenuItem value={0}>No</MenuItem>
      </Select>
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'name',
      headerName: 'Volunteer Type',
      width: 150,
      editable: false,
      renderCell: (params) =>
        editRowId === params.id ? (
          <TextField
            value={rowValues[params.id]?.name ?? params.value}
            onChange={(e) =>
              handleEditCellChange({ id: params.id, field: 'name', value: e.target.value })
            }
            variant="standard"
            size="small"
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'require_patient',
      headerName: 'Requires Patient',
      width: 150,
      editable: false,
      renderEditCell: renderEditSelectCell,
      renderCell: (params) =>
        editRowId === params.id ? (
          renderEditSelectCell(params)
        ) : (
          <span>{params.value === 1 ? 'Yes' : 'No'}</span>
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
              onClick={() => processRowUpdate({ ...params.row, ...rowValues[params.id] })}
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
      {volunteerTypesState.isLoading ? (
        <LoadingOverlay />
      ) : (
        <Grid container style={{ marginTop: 20 }}>
          <Button
            onClick={handleAddRow}
            style={{ marginBottom: 10, marginRight: 10 }}
            variant="contained"
            startIcon={<Add />}
            disabled={isAddingNewRow}
          >
            Add Volunteer Type
          </Button>
          <Grid item xs={12}>
            <DataGrid
              rows={volunteerTypesState.data}
              columns={columns}
              editMode="row"
              density="compact"
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              editRowsModel={rowValues}
              onEditRowsModelChange={setRowValues}
              pageSizeOptions={[25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default VolunteerTypes;
