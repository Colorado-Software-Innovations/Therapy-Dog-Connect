import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

export default function DynamicBreadcrumbs({ crumbs }) {
  const navigate = useNavigate();

  const handleOnClick = (e, to) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {/* Home link */}
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        onClick={(e) => handleOnClick(e, '/')}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
      </Link>

      {/* Render dynamic crumbs */}
      {crumbs.map((crumb, index) =>
        index < crumbs.length - 1 ? (
          <Link
            key={index}
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            onClick={(e) => handleOnClick(e, crumb.link)}
          >
            {crumb.text}
          </Link>
        ) : (
          <Typography
            key={index}
            sx={{ display: 'flex', alignItems: 'center' }}
            color="text.primary"
          >
            {crumb.text}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}
