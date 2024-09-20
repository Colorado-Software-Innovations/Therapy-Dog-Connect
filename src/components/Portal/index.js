import React, { useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import { styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ChatIcon from '@mui/icons-material/Chat';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SettingsIcon from '@mui/icons-material/Settings';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Admin() {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Add null checks for authCtx.currentUser
  const currentUser = authCtx.currentUser || {};
  const { family_name = '', given_name = '' } = currentUser.attributes || {};
  const userHospitalId = currentUser.attributes?.['custom:venueId'] || '';

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    authCtx.logOut();
    navigate('/login');
  };

  const getInitials = () => {
    if (given_name && family_name) {
      return `${given_name[0].toUpperCase()}${family_name[0].toUpperCase()}`;
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Therapy Dog Connect - Admin
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {getInitials() ? (
                  <Avatar>{getInitials()}</Avatar>
                ) : (
                  <Avatar /> // Default Avatar if initials are not available
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          <List>
            <ListItemButton component={RouterLink} to="hospitals">
              <Tooltip title="Hospitals">
                <ListItemIcon>
                  <LocalHospitalIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Hospitals" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="chat">
              <Tooltip title="Chat">
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Chat" />
            </ListItemButton>
            {userHospitalId && (
              <ListItemButton component={RouterLink} to={`hospitals/${userHospitalId}`}>
                <Tooltip title="My Hospital">
                  <ListItemIcon>
                    <DomainAddIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="My Hospital" />
              </ListItemButton>
            )}
          </List>
        </Box>
        <Box>
          <ListItemButton component={RouterLink} to="settings">
            <Tooltip title="Settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </Box>
      </Drawer>
      <Main open={open}>
        <Outlet />
      </Main>
    </Box>
  );
}
