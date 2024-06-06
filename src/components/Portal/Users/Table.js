import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';

import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

export default function UsersTable() {
  const StatusCell = ({ status }) => {
    if (status) {
      return <ToggleOffIcon sx={{ color: 'green' }} />;
    }
    return <ToggleOnIcon sx={{ color: '#c83542' }} />;
  };
  const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'role', headerName: 'Role' },
    { field: 'user', headerName: 'User' },
    {
      field: 'active',
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

  const data = [
    {
      id: 1,
      role: 'Admin',
      user: 'John Smith',

      active: true,
      email: 'johnsmith@hospital.com',
      phone: '970-555-1234',
    },
    {
      id: 2,
      role: 'Volunteer',
      user: 'Jane Doe',
      active: false,
      email: 'jdoe@gmail.com',
      phone: '970-555-4321',
    },
    {
      id: 3,
      role: 'Volunteer',
      user: 'Zach Cervi',
      active: true,
      email: 'zachcervi@gmail.com',
      phone: '970-555-4983',
    },
  ];

  const handleRowClick = () => {};
  return (
    <div>
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
}
