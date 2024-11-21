import React, { useState, useContext, useEffect, useCallback } from 'react';
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

const ProfilePage = () => {
  const { selectedHospital, selectedUser } = useContext(AppContext);
  const [isActive, setIsActive] = useState(selectedUser.is_active);
  const [dogs, setDogs] = useState([]);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const { fetchDogByUserId, updateDog } = useDogs();

  const fetchDogs = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetchDogByUserId(selectedUser.id);
      const mappedResponse = response.map((dog) => ({
        ...dog,
        isSaving: false,
        isEditing: false,
      }));
      setDogs(mappedResponse);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [fetchDogByUserId, selectedUser.id]);

  useEffect(() => {
    if (selectedUser?.id) {
      fetchDogs();
    }
  }, []);

  const handleToggleChange = (event) => {
    setIsActive(event.target.checked);
  };

  const handleBioChange = (index, newBio) => {
    setDogs((prevDogs) =>
      prevDogs.map((dog, i) => (i === index ? { ...dog, bio: newBio.slice(0, 1000) } : dog)),
    );
  };

  const handleSave = async (index) => {
    setDogs((prevDogs) =>
      prevDogs.map((dog, i) => (i === index ? { ...dog, isSaving: true } : dog)),
    );

    try {
      const dogToUpdate = dogs[index];
      const payload = {
        bio: dogToUpdate.bio,
        bio_image_url: uploadedUrl, // Correctly assigning the S3 URL
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

  const fullName = `${selectedUser.first_name} ${selectedUser.last_name}`;
  const crumbs = [
    { text: 'Hospitals', link: '/admin/hospitals' },
    {
      text: selectedHospital.name,
      link: `/admin/hospitals/${selectedHospital.id}`,
    },
    { text: fullName },
  ];

  const getUploadPath = (dogName) => {
    const hospitalName = selectedHospital.name.replace(/\s+/g, '_');
    const userFullName = `${selectedUser.first_name}_${selectedUser.last_name}`.replace(
      /\s+/g,
      '_',
    );
    const fileName = dogName
      ? `${dogName.replace(/\s+/g, '_')}_${Date.now()}.jpg`
      : `${Date.now()}.jpg`;
    return `${hospitalName}/${userFullName}/${fileName}`;
  };



  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Breadcrumb crumbs={crumbs}></Breadcrumb>

      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, marginBottom: 4, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <ProfilePicture
                isUploadEnabled={false}
                objectKey="users/60/29fdc9c7-f974-424c-8548-177c7854b1be_1728329510839.jpg"
                firstName={selectedUser.first_name}
                lastName={selectedUser.last_name}
                hospitalName={selectedHospital.name}
                // eslint-disable-next-line no-undef
                bucketName={process.env.REACT_APP_S3_PROFILE_PICTURE_BUCKET}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                {fullName}
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
          Dogs Associated with {fullName}
        </Typography>

        {loading ? ( // Render spinner when loading
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {dogs.map((dog, index) => {
              const profilePictureKey = dog.bio_image_url.replace(
                        // eslint-disable-next-line no-undef
                        process.env.REACT_APP_S3_PROFILE_BIO_PICTURE_URL,
                        ''
                      )
              const decodeProfilePictureKey = decodeURI(profilePictureKey)
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
                      uploadedPath={getUploadPath(dog.name)}
                      dogName={dog.name || 'Unnamed Dog'}
                      isDog={true}
                      firstName={selectedUser.first_name}
                      lastName={selectedUser.last_name}
                      objectKey={decodeProfilePictureKey}
                      // eslint-disable-next-line no-undef
                      bucketName={process.env.REACT_APP_S3_PROFILE_BIO_PICTURE_BUCKET}
                      onUpload={(url) => {
                        setUploadedUrl(url);
                      }}
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
                        Date of Birth:{' '}
                        {dog.birthday
                          ? `${dog.birthday.split('-')[1]}/${dog.birthday.split('-')[2]}/${dog.birthday.split('-')[0]}`
                          : 'Unknown'}
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
