import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const Messages = ({ messages }) => (
  <Box>
    {messages.map((message, index) => {
      const isSender = message.sender === 'You';
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: isSender ? 'flex-end' : 'flex-start',
            marginBottom: 2,
          }}
        >
          {!isSender && (
            <Avatar alt={message.sender} src={message.avatar || null} sx={{ marginRight: 1 }}>
              {!message.avatar && getInitials(message.sender)}
            </Avatar>
          )}
          <Box sx={{ maxWidth: '75%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 0.5,
              }}
            >
              {!isSender && (
                <Typography variant="caption" sx={{ fontWeight: 'bold', marginRight: 1 }}>
                  {message.sender}
                </Typography>
              )}
              <Typography variant="caption" color="textSecondary">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
            <Box
              sx={{
                padding: '10px',
                borderRadius: 2,
                bgcolor: isSender ? 'primary.main' : 'grey.300',
                color: isSender ? 'white' : 'black',
                overflowWrap: 'break-word',
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Box>
          </Box>
        </Box>
      );
    })}
  </Box>
);

export default Messages;
