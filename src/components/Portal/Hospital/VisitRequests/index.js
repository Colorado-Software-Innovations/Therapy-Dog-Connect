import React, { useState, useEffect, useContext } from 'react';
import useVisits from '../../../../hooks/visits/useVisits';
import { NotificationContext } from '../../../../store/notification-context';
import { Promise } from 'bluebird';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography, CircularProgress } from '@mui/material';

const VisitRequests = ({ hospitalId }) => {
  const [visitState, setVisitState] = useState({
    isLoading: false,
    data: [],
  });

  const columns = [
    { field: 'room_id', headerName: 'ID', width: 90 },
    { field: 'patient_first_name', headerName: 'First Name', width: 150 },
    { field: 'patient_last_name', headerName: 'Last Name', width: 150 },
    { field: 'room_number', headerName: 'Room Number', width: 120 },
  ];

  const { fetchVisitsByHospitalId } = useVisits();
  const notificationCtx = useContext(NotificationContext);

  useEffect(() => {
    setVisitState((prevState) => ({ ...prevState, isLoading: true }));
    Promise.try(() => {
      fetchVisitsByHospitalId(hospitalId)
        .then((response) => {
          const responseBody = JSON.parse(response.data['body-json'].body);
          setVisitState((prevState) => ({
            ...prevState,
            isLoading: false,
            data: responseBody,
          }));
        })
        .catch((err) => {
          setVisitState((prevState) => ({ ...prevState, isLoading: false }));
          notificationCtx.show('error', `Oops something went wrong: ${err}`);
        });
    });
  }, [fetchVisitsByHospitalId, hospitalId, notificationCtx]);

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {visitState.isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {!visitState.isLoading && (
        <Grid container>
          {visitState.data.length > 0 ? (
            <DataGrid
              rowSelection={false}
              rows={visitState.data}
              columns={columns}
              autoHeight
              pageSizeOptions={[5, 10, 15, 25]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
                width: '100%', // Ensure the box takes the full width of its container
                height: '100%', // Ensure the box takes the full height of its container
              }}
            >
              <Typography variant="h6" color="textSecondary">
                There are no patients requesting visits at this time.
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default VisitRequests;
