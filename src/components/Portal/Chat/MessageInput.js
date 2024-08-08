import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onSend, isDrawerOpen, drawerWidth }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageObject = {
        content: newMessage,
        timestamp: Date.now(),
      };
      onSend(messageObject);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
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
        position: 'fixed',
        bottom: 0,
        left: isDrawerOpen ? `${drawerWidth + 100}px` : `calc(50% + ${250 / 2}px)`,
        transform: isDrawerOpen ? 'none' : 'translateX(-50%)',
        minWidth: 650,
        maxWidth: isDrawerOpen ? `calc(100% - ${drawerWidth + 120}px)` : 'calc(100% - 20px)',
        width: 'auto',
        boxSizing: 'border-box',
        borderRadius: 2, // Rounded edges for the outer box
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        multiline
        maxRows={4}
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          marginRight: 1,
          borderRadius: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <IconButton
        color="primary"
        type="submit"
        sx={{
          borderRadius: 2,
          alignSelf: 'center', // Center the button vertically
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
