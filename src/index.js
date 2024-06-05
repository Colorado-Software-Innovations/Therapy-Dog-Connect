import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthContextProvider from './store/auth-context';
import NotificationContextProvider from './store/notification-context';
import CssBaseline from '@mui/material/CssBaseline';
import { COLORS } from './constants/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary,
    },
    secondary: {
      main: COLORS.secondary,
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Noto Sans, Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
    },
  },
  // You can add more customizations here
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
