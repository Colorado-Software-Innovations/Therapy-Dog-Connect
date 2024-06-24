import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const VisitRequests = ({ visitState }) => {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: 'patient_first_name', headerName: 'First', width: 150 },
    { field: 'patient_last_name', headerName: 'Last', width: 150 },
    { field: 'number', headerName: 'Room', width: 150 },
  ];

  useEffect(() => {
    if (visitState.data.length > 0) {
      setRows(
        visitState.data.map((visit) => {
          return {
            patientFirst: visit.first_name,
            patientLast: visit.last_name,
            roomNumber: visit.number,
          };
        }),
      );
    }
  }, [visitState.data]);

  return (
    <Box>
      <Grid item>
        {rows.length > 0 && (
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

        {rows.length === 0 && (
          <Typography>There are no patients requesting visits at this time.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default VisitRequests;
