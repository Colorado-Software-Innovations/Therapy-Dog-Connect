import React, { useState, useEffect, useContext } from 'react';
import useVisits from '../../../hooks/visits/useVisits';
import { NotificationContext } from '../../../store/notification-context';
import { Promise } from 'bluebird';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const VisitRequests = ({ hospitalId }) => {
  const [visitState, setVisitState] = useState({
    isLoading: false,
    data: [],
  });
  const columns = [
    { field: 'room_id', headerName: 'ID' },
    { field: 'patient_first_name', headerName: 'First', width: 150 },
    { field: 'patient_last_name', headerName: 'Last', width: 150 },
    { field: 'room_number', headerName: 'Room', width: 150 },
  ];
  const { fetchVisitsByHospitalId } = useVisits();
  const notificationCtx = useContext(NotificationContext);
  useEffect(() => {
    setVisitState((prevState) => ({ ...prevState, isLoading: true }));
    Promise.try(() => {
      fetchVisitsByHospitalId(hospitalId)
        .then((response) => {
          const responseBody = JSON.parse(response.data.body);
          setVisitState((prevState) => ({
            ...prevState,
            isLoading: false,
            data: responseBody,
          }));
        })
        .catch((err) => {
          notificationCtx.show('error', `Oops something went wrong: ${err}`);
        });
    });
  }, [fetchVisitsByHospitalId, hospitalId, notificationCtx]);

  return (
    <Box>
      <Grid item>
        {visitState.data.length > 0 && (
          <DataGrid
            rowSelection={false}
            rows={visitState.data}
            columns={columns}
            loading={visitState.isLoading}
            density="compact"
            pageSizeOptions={[5, 10, 15, 25]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
          />
        )}

        {visitState.data.length === 0 && (
          <Typography>There are no patients requesting visits at this time.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default VisitRequests;
