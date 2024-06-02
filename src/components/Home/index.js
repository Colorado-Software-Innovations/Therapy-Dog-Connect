import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { COLORS } from '../../constants/colors';

const Index = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={2}>
      {/* Left Grid item */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: isSmallScreen ? '40px' : '60px',
        }}
      >
        <Typography variant="h1" sx={styles.heading}>
          Providing companionship for those in need
        </Typography>
        <Typography sx={styles.subHeading}>
          A therapy dog is a pet that is trained to provide comfort and stress relief to people in a
          variety of settings. Therapy Dog Connect connects patients with volunteers and their
          therapy dogs.
        </Typography>
        <Button sx={styles.button} variant="contained">
          Learn More
        </Button>
      </Grid>

      {/* Right Grid item */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: 700,
          paddingRight: isSmallScreen ? '0px' : '20px',
          paddingLeft: isSmallScreen ? '0px' : '20px',
          width: isSmallScreen ? '100vw' : 'auto', // Full width on mobile, auto on desktop
          left: isSmallScreen ? '50%' : '0', // Center on mobile, left aligned on desktop
          transform: isSmallScreen ? 'translateX(-50%)' : 'none', // Center on mobile
        }}
      >
        <img
          src={'https://therapydogconnect.s3.amazonaws.com/assets/person-petting-dog.jpg'}
          alt={'person petting golden retriever'}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Grid>
    </Grid>
  );
};

const styles = {
  heading: {
    fontFamily: 'Lora-SemiBold',
    fontWeight: 700,
    fontSize: { xs: 24, md: 60 },
    color: COLORS.primary,
    textAlign: 'left',
    marginBottom: '10px',
  },
  subHeading: {
    color: COLORS.primary,
    fontSize: { xs: 14, md: 18 },
    textAlign: 'left',
    marginBottom: '20px',
  },
  button: {
    borderRadius: 25,
    marginTop: '20px',
    paddingLeft: '20px',
    paddingRight: '20px',
    textTransform: 'lowercase',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    '&:hover': {
      backgroundColor: COLORS.primaryDark,
    },
  },
};

export default Index;
