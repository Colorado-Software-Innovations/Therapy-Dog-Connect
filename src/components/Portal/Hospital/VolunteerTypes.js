import React, { useEffect, useCallback, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useVolunteerTypes from '../../../hooks/volunteerTypes/useVolunteerTypes';
import { NotificationContext } from '../../../store/notification-context';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Volunteer Type', width: 250 },
];
const VolunteerTypes = () => {
  const notificationCtx = useContext(NotificationContext);
  const { getVolunteerTypes } = useVolunteerTypes();
  const params = useParams();
  const [volunteerTypesState, setVolunteerTypesState] = useState({
    isLoading: true,
    name: '',
    data: [],
  });

  const fetchVolunteerTypes = useCallback(async () => {
    try {
      const response = await getVolunteerTypes(params.id);

      setVolunteerTypesState((prev) => ({
        ...prev,
        isLoading: false,
        data: response,
      }));
    } catch (error) {
      notificationCtx.show('error', `Failed to fetch hospital. ${error}`);
    }
  }, []);

  useEffect(() => {
    fetchVolunteerTypes();
  }, [fetchVolunteerTypes]);
  const handleRowClick = () => {};

  return (
    <div>
      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={volunteerTypesState.data}
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
      </Grid>
    </div>
  );
};

export default VolunteerTypes;
