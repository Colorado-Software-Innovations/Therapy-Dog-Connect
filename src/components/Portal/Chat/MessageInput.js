import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onSend }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSend(newMessage);
      setNewMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 1,
        bgcolor: 'background.paper',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        sx={{ marginRight: 1 }}
      />
      <IconButton color="primary" type="submit" sx={{ borderRadius: 1 }}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
