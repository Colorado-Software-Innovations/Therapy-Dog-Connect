import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Box, Typography, Button } from '@mui/material';
import StatusCell from '../../../UI/StatusCell';
import UserFormModal from './NewUserModal';
import { PersonAdd } from '@mui/icons-material';

const Index = ({ venue_id, data }) => {
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { field: 'user', headerName: 'User', width: 250 },
    {
      field: 'is_active',
      headerName: 'Approved',
      renderCell: (cellValues) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <StatusCell status={cellValues.value} />
        </Box>
      ),
      width: 120,
    },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 200 },
  ];

  const handleRowClick = () => {};
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              User Management
            </Typography>
            <Button variant="contained" onClick={handleOpen} startIcon={<PersonAdd />}>
              Add User
            </Button>
          </Box>
        </Grid>

        <Grid item>
          <UserFormModal
            venueId={venue_id}
            handleOpen={handleOpen}
            handleClose={handleClose}
            open={open}
          />
        </Grid>

        <Grid item>
          {data.length > 0 ? (
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: 4,
                p: 3,
                border: '1px solid #e0e0e0',
              }}
            >
              <DataGrid
                onRowClick={handleRowClick}
                rows={data}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                autoHeight
                sx={{
                  backgroundColor: '#fafafa',
                  borderRadius: 2,
                  '& .MuiDataGrid-cell': { px: 1.5 },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#fafafa',
                  },
                  '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                  },
                }}
              />
            </Box>
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ textAlign: 'center', mt: 3, fontWeight: 500 }}
            >
              No users available at this time.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Index;
