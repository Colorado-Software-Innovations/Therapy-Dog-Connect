import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { uploadImageToS3, getImageFromS3 } from '../../utils/S3';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { PhotoCamera, Pets as PetsIcon } from '@mui/icons-material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfilePicture = ({
  firstName,
  lastName,
  uploadedPath,
  bucketName,
  objectKey,
  onUpload,
  isDog,
  isUploadEnabled,
}) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (objectKey) {
        try {
          const image = await getImageFromS3(bucketName, objectKey);
          setProfilePicture(image);
        } catch (error) {
          console.error('Error fetching profile picture from S3:', error);
          showSnackbar('Failed to fetch profile picture. Please try again.', 'error');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchProfilePicture();
  }, [bucketName, objectKey]);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    setIsUploading(true);
    const uploadPath = uploadedPath; // Ensure correct directory structure
    const uploadedUrl = await uploadImageToS3(file, uploadPath, bucketName);
    setProfilePicture(uploadedUrl);
    showSnackbar('Profile picture uploaded successfully!', 'success');
    if (onUpload) onUpload(uploadedUrl); // Returning the correct S3 URL
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    showSnackbar('Failed to upload profile picture. Please try again.', 'error');
  } finally {
    setIsUploading(false);
  }
};

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getPlaceholder = () => {
    if (isDog) {
      return <PetsIcon fontSize="large" />;
    }
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Box
        position="relative"
        display="inline-block"
        sx={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: 3,
          '&:hover .hover-overlay': {
            opacity: isUploadEnabled ? 1 : 0, // Show hover overlay only if upload is enabled
          },
        }}
      >
        {isLoading || isUploading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        ) : null}

        <Avatar
          alt={`${isDog ? firstName : `${firstName} ${lastName}`}`}
          src={profilePicture}
          sx={{
            width: 150,
            height: 150,
            backgroundColor: 'grey.300',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {!profilePicture && getPlaceholder()}
        </Avatar>

        {/* Hover Overlay */}
        {isUploadEnabled && (
          <Box
            className="hover-overlay"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.3s',
              zIndex: 5,
              cursor: 'pointer',
            }}
            component="label"
            htmlFor="upload-profile-picture"
          >
            <PhotoCamera sx={{ fontSize: 40 }} />
            <Typography variant="body1">Click to Upload</Typography>
          </Box>
        )}
      </Box>

      {isUploadEnabled && (
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-profile-picture"
          type="file"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Prop Types validation
ProfilePicture.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  bucketName: PropTypes.string.isRequired,
  objectKey: PropTypes.string,
  onUpload: PropTypes.func,
  isDog: PropTypes.bool,
  isUploadEnabled: PropTypes.bool,
};

ProfilePicture.defaultProps = {
  objectKey: null,
  onUpload: null,
  isDog: false,
  isUploadEnabled: true, // Default to upload enabled
};

export default ProfilePicture;
