import React, { useState, useEffect, useRef } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import Messages from './Messages';
import MessageInput from './MessageInput';

const contacts = [
  { first: 'Zach', last: 'Cervi', volunteerType: 'Dog Handler' },
  { first: 'Jane', last: 'Doe', volunteerType: 'Event Coordinator' },
  // Add more contacts as needed...
];

const mockMessages = {
  'Zach Cervi': [
    { sender: 'Zach', content: 'Hello!', timestamp: 1629812345678 },
    { sender: 'You', content: 'Hi Zach!', timestamp: 1629812345678 },
    // More messages...
  ],
  'Jane Doe': [
    { sender: 'Jane', content: 'Good morning!', timestamp: 1629812345678 },
    { sender: 'You', content: 'Morning, Jane!', timestamp: 1629812345678 },
    // More messages...
  ],
  // Add more mock conversations...
};

const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const ChatUI = ({ drawerWidth }) => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(
    mockMessages[selectedContact.first + ' ' + selectedContact.last] || [],
  );
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the messages when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setMessages(mockMessages[contact.first + ' ' + contact.last] || []);
  };

  const handleSendMessage = (newMessage) => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'You', content: newMessage }]);
    }
  };

  //const fullName = `${selectedContact.first} ${selectedContact.last}`;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          width: drawerWidth,
          minWidth: 250,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflowY: 'auto',
          transition: 'width 0.3s',
        }}
      >
        <List>
          {contacts.map((contact, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleContactClick(contact)}
              sx={{ padding: '10px 20px', borderBottom: 1, borderColor: 'divider' }}
            >
              <ListItemAvatar>
                <Avatar>{getInitials(`${contact.first} ${contact.last}`)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${contact.first} ${contact.last}`}
                secondary={contact.volunteerType}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
          <Messages messages={messages} />
          <Box ref={messagesEndRef} />
        </Box>
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            boxSizing: 'border-box',
            padding: '8px 16px',
          }}
        ></Box>
        <MessageInput onSend={handleSendMessage} />
      </Box>
    </Box>
  );
};

export default ChatUI;
