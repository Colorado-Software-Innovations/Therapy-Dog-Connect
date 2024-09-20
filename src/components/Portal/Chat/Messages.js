import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const getInitials = (name) => {
  if (!name) return;
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const Messages = ({ messages, sender, selectedContact }) => {
  return (
    <Box sx={{ padding: 2 }}>
      {messages.map((message, index) => {
        const isSender = message.senderId === sender;
        const isRecipient = message.recipientId === selectedContact.auth_user_id;

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
              <Avatar alt={message.sender} src={isRecipient ? selectedContact.imageUrl : message.avatar || null} sx={{ marginRight: 1 }}>
                {(!isRecipient || !selectedContact.imageUrl) && getInitials(message.sender)}
              </Avatar>
            )}
            <Box sx={{ maxWidth: '75%', textAlign: isSender ? 'right' : 'left' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 0.5,
                }}
              >
                {!isSender && (
                  <Typography variant="caption" sx={{ fontWeight: 'bold', marginRight: 1 }}>
                    {isRecipient ? selectedContact.name : message.sender}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  {new Date(Number(message.timestamp)).toLocaleTimeString([], {
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
                  boxShadow: 2,
                }}
              >
                <Typography variant="body1">{message.messageContent}</Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Messages;
