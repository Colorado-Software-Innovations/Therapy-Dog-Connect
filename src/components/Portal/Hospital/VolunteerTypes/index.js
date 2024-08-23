/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { Box, Grid, Button, Typography, Select, MenuItem, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import useVolunteerTypes from '../../../../hooks/volunteerTypes/useVolunteerTypes';
import { NotificationContext } from '../../../../store/notification-context';

export default function VolunteerTypes({ data, venueId, fetchVolunteerTypes }) {
  const [rows, setRows] = useState(data);
  const [editRowId, setEditRowId] = useState(null);
  const [rowValues, setRowValues] = useState({});
  const notificationCtx = useContext(NotificationContext);
  const { updateVolunteerType, addVolunteerType } = useVolunteerTypes();

  // Handle saving changes to the row (new or existing)
  const handleSaveRow = async (id) => {
    if (id === 'new') {
      await addVolunteerType({
        venue_id: venueId,
        name: rowValues[id].name.trim(), // Ensure leading/trailing spaces are handled
        require_patient: rowValues[id].require_patient,
      });
      fetchVolunteerTypes();
      notificationCtx.show('success', 'Volunteer type added successfully.');
    } else {
      await updateVolunteerType(id, {
        id,
        venue_id: venueId,
        name: rowValues[id].name.trim(), // Ensure leading/trailing spaces are handled
        require_patient: rowValues[id].require_patient,
      });
      fetchVolunteerTypes();
      notificationCtx.show('success', 'Volunteer type updated successfully.');
    }
    const updatedRows = rows.map((row) => (row.id === id ? { ...row, ...rowValues[id] } : row));
    setRows(updatedRows);
    setEditRowId(null);
    setRowValues({});
  };

  // Handle deleting a row
  const handleDeleteRow = async (id) => {
    try {
      await updateVolunteerType(id, { id, is_deleted: true });
      notificationCtx.show('success', 'Volunteer type deleted successfully.');
      fetchVolunteerTypes();
    } catch (error) {
      notificationCtx.show('error', `Failed to delete volunteer type. ${error}`);
    }
  };

  // Handle adding a new row
  const handleAddRow = () => {
    setRows((prevRows) => [{ id: 'new', name: '', require_patient: 0 }, ...prevRows]);
    setEditRowId('new');
    setRowValues({ new: { name: '', require_patient: 0 } });
  };

  // Handle cell edit changes
  const handleEditCellChange = (id, field, value) => {
    setRowValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Handle canceling an edit
  const handleCancelClick = () => {
    setEditRowId(null);
    setRowValues({});
  };

  // Define the columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Volunteer Type',
      width: 200,
      renderCell: (params) =>
        editRowId === params.id ? (
          <TextField
            value={rowValues[params.id]?.name ?? params.value}
            onChange={(e) => handleEditCellChange(params.id, 'name', e.target.value)}
            variant="standard"
            size="small"
            fullWidth
            sx={{ height: '100%' }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        ),
    },
    {
      field: 'require_patient',
      headerName: 'Requires Patient',
      width: 200,
      renderCell: (params) =>
        editRowId === params.id ? (
          <Select
            value={rowValues[params.id]?.require_patient ?? params.value}
            onChange={(e) => handleEditCellChange(params.id, 'require_patient', e.target.value)}
            variant="standard"
            size="small"
            sx={{ height: '100%', width: '100%' }}
          >
            <MenuItem value={1}>Yes</MenuItem>
            <MenuItem value={0}>No</MenuItem>
          </Select>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Typography variant="body2">{params.value === 1 ? 'Yes' : 'No'}</Typography>
          </Box>
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      type: 'actions',
      getActions: (params) => {
        const { id } = params;

        if (editRowId === id) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => handleSaveRow(id)}
              key="save"
            />,
            <GridActionsCellItem
              icon={<CloseIcon />}
              label="Cancel"
              onClick={handleCancelClick}
              key="cancel"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => setEditRowId(id)}
            key="edit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteRow(id)}
            key="delete"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="div">
              Volunteer Types
            </Typography>
            <Button onClick={handleAddRow} variant="contained" startIcon={<Add />} sx={{ mb: 2 }}>
              Add Volunteer Type
            </Button>
          </Box>
        </Grid>

        <Grid item>
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: 3,
              p: 2,
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50]}
              autoHeight
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                '& .MuiDataGrid-cell': { px: 1.5 },
                '& .MuiDataGrid-cell:focus-within': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
