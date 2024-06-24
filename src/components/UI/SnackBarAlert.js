import React, { useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { NotificationContext } from '../../store/notification-context';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarAlert = () => {
  const { open, severity, message } = useContext(NotificationContext);
  const notificationCtx = useContext(NotificationContext);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    notificationCtx.hide();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={handleCloseAlert}
    >
      <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
