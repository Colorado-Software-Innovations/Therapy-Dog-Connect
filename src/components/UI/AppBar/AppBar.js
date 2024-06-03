import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { COLORS } from '../../../constants/colors';
import { useNavigate } from 'react-router-dom';

const pages = ['locations', 'volunteers', 'about', 'contact', 'request a demo', 'login'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageClicked = (e) => {
    navigate(e);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" sx={{ padding: 0 }} style={styles.appBar}>
      <Toolbar disableGutters style={{ marginLeft: 40, marginRight: 40 }}>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'Lora-SemiBold',
            fontWeight: 700,
            fontSize: 30,
            color: 'inherit',
            textDecoration: 'none',
          }}
          style={{ color: COLORS.primary }}
        >
          Therapy Dog Connect
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon style={{ color: COLORS.primary }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={() => handlePageClicked(page)}>
                <Typography style={styles.button} textAlign="center">
                  {page}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
          style={{ color: COLORS.primary }}
        >
          Therapy Dog Connect
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => {
            if (page === 'request a demo') {
              return (
                <Button
                  variant="outlined"
                  style={styles.button}
                  key={page}
                  onClick={() => handlePageClicked(page)}
                  sx={{ my: 2, display: 'block' }}
                >
                  {page}
                </Button>
              );
            }
            if (page === 'login') {
              return (
                <Button
                  variant="contained"
                  style={styles.containedButton}
                  key={page}
                  onClick={() => handlePageClicked(page)}
                  sx={{ my: 2, display: 'block' }}
                >
                  {page}
                </Button>
              );
            }
            return (
              <Button
                style={styles.button}
                key={page}
                onClick={() => handlePageClicked(page)}
                sx={{ my: 2, display: 'block' }}
              >
                {page}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const styles = {
  appBar: {
    backgroundColor: '#f5f5f5',
    boxShadow: 'none',
    borderBottom: '1px solid',
    borderColor: '#D4D4D4',
  },
  button: {
    color: COLORS.primary,
    textTransform: 'lowercase',
    borderRadius: 25,
    margin: 5,
  },
  containedButton: {
    color: '#f5f5f5',
    textTransform: 'lowercase',
    borderRadius: 25,
    margin: 5,
    boxShadow: 'none',
  },
};

export default ResponsiveAppBar;
