import React, { useEffect, useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import useUsers from '../../../hooks/users/useUsers';
import { Promise } from 'bluebird';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { NotificationContext } from '../../../store/notification-context';

const Index = ({ venue_id }) => {
  const { getUserByVenueId } = useUsers();
  const notificationCtx = useContext(NotificationContext);
  const [usersState, setUsersState] = useState({
    isLoading: false,
    name: '',
    data: [],
  });
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

  useEffect(() => {
    Promise.try(() => {
      getUserByVenueId(venue_id)
        .then((response) => {
          const responseBody = JSON.parse(response.data['body-json'].body);
          const data = responseBody.map((user) => {
            return {
              id: user.id,
              role: user.role,
              user: `${user.first_name} ${user.last_name}`,
              email: user.email,
              phone: user.phone,
              is_active: user.is_active,
            };
          });
          setUsersState((prevState) => ({
            ...prevState,
            isLoading: false,
            data,
          }));
        })
        .catch((err) => {
          notificationCtx.show('error', `Failed to fetch users. : ${err}`);
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClick = () => {};
  return (
    <div>
      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={usersState.data}
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
