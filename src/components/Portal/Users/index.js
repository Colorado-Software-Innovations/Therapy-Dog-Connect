import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import StatusCell from '../../UI/StatusCell';

import UserFormModal from './NewUserModal';

const Index = ({ venue_id, data }) => {
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'role', headerName: 'Role' },
    { field: 'user', headerName: 'User', width: 250 },
    {
      field: 'is_active',
      headerName: 'Status',
      renderCell: (cellValues) => (
        <div>
          <StatusCell status={cellValues.value} />
        </div>
      ),
    },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 250 },
  ];

  const handleRowClick = () => {};

  return (
    <div>
      <UserFormModal venueId={venue_id} />
      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={data}
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

export default Index;
