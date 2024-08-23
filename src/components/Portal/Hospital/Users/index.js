import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Box, Typography, Button } from '@mui/material';
import StatusCell from '../../../UI/StatusCell';
import UserFormModal from './NewUserModal';
import StyledItem from '../../../UI/StyledItem';
import { PersonAdd } from '@mui/icons-material';

const Index = ({ venue_id, data }) => {
  const [open, setOpen] = useState(false);
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'user', headerName: 'User', width: 250 },
    {
      field: 'is_active',
      headerName: 'Status',
      renderCell: (cellValues) => (
        <Box>
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
    <Box sx={{ mt: 3, mb: 3 }}>
      <Grid container direction="column" spacing={2}>
        <StyledItem>
          <Grid container justifyContent="flex-start">
            <Button
              justifyContent="flex-start"
              variant="contained"
              onClick={handleOpen}
              startIcon={<PersonAdd />}
              sx={{ mb: 2 }}
            >
              Add User
            </Button>
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
              <DataGrid
                onRowClick={handleRowClick}
                rows={data}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                density="compact"
                autoHeight
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: 3,
                }}
              />
            ) : (
              <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 3 }}>
                No users available at this time.
              </Typography>
            )}
          </Grid>
        </StyledItem>
      </Grid>
    </Box>
  );
};

export default Index;
