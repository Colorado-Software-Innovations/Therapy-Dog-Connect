/* eslint-disable no-undef */
import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Breadcrumb from '../../../UI/BreadCrumb';
import { AppContext } from '../../../../store/global-context';
import ProfilePicture from '../../../UI/ProfilePicture';
import useDogs from '../../../../hooks/dogs/useDogs';

const formatDate = (date) => {
  if (!date) return 'Unknown';
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
};

const generateUploadPath = (hospitalName, userFullName, dogName = '') => {
  const sanitizedHospital = hospitalName.replace(/\s+/g, '_');
  const sanitizedUser = userFullName.replace(/\s+/g, '_');
  const sanitizedDogName = dogName.replace(/\s+/g, '_');
  const fileName = `${sanitizedDogName || Date.now()}.jpg`;
  return `${sanitizedHospital}/${sanitizedUser}/${fileName}`;
};

const ProfilePage = () => {
  const { selectedHospital, selectedUser } = useContext(AppContext);
  const [isActive, setIsActive] = useState(selectedUser.is_active);
  const [dogs, setDogs] = useState([]);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const { fetchDogByUserId, updateDog } = useDogs();

  const userFullName = useMemo(
    () => `${selectedUser.first_name}_${selectedUser.last_name}`,
    [selectedUser],
  );

  const fetchDogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchDogByUserId(selectedUser.id);
      setDogs(
        response.map((dog) => ({
          ...dog,
          isSaving: false,
          isEditing: false,
        })),
      );
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchDogByUserId, selectedUser.id]);

  useEffect(() => {
    if (selectedUser?.id) fetchDogs();
  }, []);

  const handleToggleChange = (event) => setIsActive(event.target.checked);

  const handleBioChange = (index, newBio) => {
    setDogs((prevDogs) =>
      prevDogs.map((dog, i) => (i === index ? { ...dog, bio: newBio.slice(0, 1000) } : dog)),
    );
  };

  const handleSave = async (index) => {
    const dogToUpdate = dogs[index];
    setDogs((prevDogs) =>
      prevDogs.map((dog, i) => (i === index ? { ...dog, isSaving: true } : dog)),
    );

    try {
      const payload = {
        bio: dogToUpdate.bio,
        bio_image_url: uploadedUrl,
      };

      const updatedDog = await updateDog(dogToUpdate.id, payload);

      setDogs((prevDogs) =>
        prevDogs.map((dog, i) =>
          i === index ? { ...dog, ...updatedDog, isSaving: false, isEditing: false } : dog,
        ),
      );
    } catch (error) {
      console.error('Error updating dog:', error);
      setDogs((prevDogs) =>
        prevDogs.map((dog, i) => (i === index ? { ...dog, isSaving: false } : dog)),
      );
    }
  };

  const toggleEditMode = (index) => {
    setDogs((prevDogs) =>
      prevDogs.map((dog, i) => (i === index ? { ...dog, isEditing: !dog.isEditing } : dog)),
    );
  };

  const crumbs = useMemo(
    () => [
      { text: 'Hospitals', link: '/admin/hospitals' },
      { text: selectedHospital.name, link: `/admin/hospitals/${selectedHospital.id}` },
      { text: `${selectedUser.first_name} ${selectedUser.last_name}` },
    ],
    [selectedHospital, selectedUser],
  );

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Breadcrumb crumbs={crumbs} />

      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, marginBottom: 4, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <ProfilePicture
                isUploadEnabled={false}
                objectKey={selectedUser.profile_image_url.replace(
                  process.env.REACT_APP_S3_PROFILE_PICTURE_BUCKET_URL,
                  '',
                )}
                firstName={selectedUser.first_name}
                lastName={selectedUser.last_name}
                hospitalName={selectedHospital.name}
                bucketName={process.env.REACT_APP_S3_PROFILE_PICTURE_BUCKET}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                {selectedUser.first_name} {selectedUser.last_name}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                Phone: {selectedUser.phone}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
                Email: {selectedUser.email}
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <FormControlLabel
                control={
                  <Switch checked={isActive} onChange={handleToggleChange} color="primary" />
                }
                label="Activate Account"
              />
            </Grid>
          </Grid>
        </Paper>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}
        >
          Dogs Associated with {`${selectedUser.first_name} ${selectedUser.last_name}`}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
          Please upload pictures of the therapy dogs and include a bio. This is what the patient
          will see when they are requesting visits from the therapy dogs.
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {dogs.map((dog, index) => {
              const uploadPath = generateUploadPath(selectedHospital.name, userFullName, dog.name);
              const profilePictureKey = dog?.bio_image_url
                ? dog.bio_image_url.replace(
                    // eslint-disable-next-line no-undef
                    process.env.REACT_APP_S3_PROFILE_BIO_PICTURE_URL || '',
                    '',
                  )
                : '';

              const decodeProfilePictureKey = profilePictureKey ? decodeURI(profilePictureKey) : '';

              return (
                <Grid item xs={12} md={6} key={dog.id || index}>
                  <Card
                    elevation={2}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 3,
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      onClick={() => toggleEditMode(index)}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <ProfilePicture
                      uploadedPath={uploadPath}
                      dogName={dog.name || 'Unnamed Dog'}
                      isDog={true}
                      firstName={selectedUser.first_name}
                      lastName={selectedUser.last_name}
                      objectKey={decodeProfilePictureKey}
                      bucketName={process.env.REACT_APP_S3_PROFILE_BIO_PICTURE_BUCKET}
                      onUpload={(url) => setUploadedUrl(url)}
                      isUploadEnabled={dog.isEditing}
                    />

                    <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {dog.name || 'Unnamed Dog'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                        Breed: {dog.breed?.name || 'Unknown Breed'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                        Date of Birth: {formatDate(dog.birthday)}
                      </Typography>
                      {dog.isEditing ? (
                        <>
                          <TextField
                            fullWidth
                            label="Bio"
                            multiline
                            rows={3}
                            value={dog.bio || ''}
                            onChange={(e) => handleBioChange(index, e.target.value)}
                            variant="outlined"
                            sx={{ marginBottom: 1 }}
                            helperText={`${(dog.bio || '').length}/1000 characters`}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSave(index)}
                            disabled={(dog.bio || '').length > 1000 || dog.isSaving}
                            startIcon={
                              dog.isSaving && <CircularProgress size={20} color="inherit" />
                            }
                            sx={{ marginBottom: 2 }}
                          >
                            {dog.isSaving ? 'Saving...' : 'Save'}
                          </Button>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ fontStyle: 'italic', marginBottom: 2 }}
                        >
                          {dog.bio || 'No bio available.'}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ProfilePage;
