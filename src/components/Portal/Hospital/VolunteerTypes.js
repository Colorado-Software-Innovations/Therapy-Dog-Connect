import React, { useEffect, useCallback, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useVolunteerTypes from '../../../hooks/volunteerTypes/useVolunteerTypes';
import { NotificationContext } from '../../../store/notification-context';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Grid } from '@mui/material';
import Add from '@mui/icons-material/Add';
import Cancel from '@mui/icons-material/Cancel';
import LoadingOverlay from '../../UI/LoadingOverlay';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Volunteer Type', width: 250, editable: true },
];

const VolunteerTypes = () => {
  const notificationCtx = useContext(NotificationContext);
  const { getVolunteerTypes, updateVolunteerType, addVolunteerType } = useVolunteerTypes();
  const params = useParams();
  const venue_id = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [volunteerTypesState, setVolunteerTypesState] = useState({
    isLoading: true,
    name: '',
    data: [],
  });
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);

  const fetchVolunteerTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getVolunteerTypes(params.id);
      setVolunteerTypesState((prev) => ({
        ...prev,
        isLoading: false,
        data: response,
      }));
    } catch (error) {
      notificationCtx.show('error', `Failed to fetch volunteer types. ${error}`);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchVolunteerTypes();
  }, [fetchVolunteerTypes]);

  const handleRowClick = () => {};

  const processRowUpdate = async (newRow) => {
    if (newRow.id === 'new') {
      try {
        await addVolunteerType({ venue_id, name: newRow.name });
        notificationCtx.show('success', 'Volunteer type added successfully.');
        setIsAddingNewRow(false);
        fetchVolunteerTypes(); // Refresh data after adding
      } catch (error) {
        notificationCtx.show('error', `Failed to add volunteer type. ${error}`);
      }
    } else {
      try {
        await updateVolunteerType(newRow.id, { name: newRow.name });
        notificationCtx.show('success', 'Volunteer type updated successfully.');
      } catch (error) {
        notificationCtx.show('error', `Failed to update volunteer type. ${error}`);
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
      setVolunteerTypesState((prev) => ({
        ...prev,
        data: [{ id, name: '' }, ...prev.data],
      }));
    }
  };

  const handleCancelAddRow = () => {
    if (isAddingNewRow) {
      setVolunteerTypesState((prev) => ({
        ...prev,
        data: prev.data.filter((row) => row.id !== 'new'),
      }));
      setIsAddingNewRow(false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingOverlay />}
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
        {isAddingNewRow && (
          <Button
            onClick={handleCancelAddRow}
            style={{ marginBottom: 10 }}
            variant="contained"
            startIcon={<Cancel />}
            color="secondary"
          >
            Cancel
          </Button>
        )}
        <Grid item xs={12}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={volunteerTypesState.data}
            columns={columns}
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
};

export default VolunteerTypes;
