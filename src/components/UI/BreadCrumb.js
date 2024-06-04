import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

export default function IconBreadcrumbs({ middleCrumb, lastCrumb }) {
  const navigate = useNavigate();
  const handleOnClick = (e, to) => {
    e.preventDefault();
    navigate(to);
  };
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        onClick={(e) => handleOnClick(e, '/')}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
      </Link>
      {middleCrumb && (
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          onClick={(e) => handleOnClick(e, middleCrumb.link)}
        >
          {middleCrumb.text}
        </Link>
      )}
      {lastCrumb && (
        <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
          {lastCrumb}
        </Typography>
      )}
    </Breadcrumbs>
  );
}
