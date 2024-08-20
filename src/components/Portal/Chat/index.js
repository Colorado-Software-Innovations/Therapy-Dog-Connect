import React, { useState, useEffect, useRef } from 'react';
import { List, ListItem, ListItemText, Box } from '@mui/material';
// import Messages from './Messages';
// import MessageInput from './MessageInput';

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

// const getInitials = (name) =>
//   name
//     .split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase();

const ChatUI = ({ drawerWidth, isDrawerOpen }) => {
  console.log('isdrawerOpen', isDrawerOpen);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(
    mockMessages[selectedContact.first + ' ' + selectedContact.last] || [],
  );
  const messagesEndRef = useRef(null);
  let socket;
  useEffect(() => {
    socket = new WebSocket('wss://48m7d7by9a.execute-api.us-east-1.amazonaws.com/dev');

    // Once the connection is established, send the recipientId
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      socket.send(JSON.stringify({ action: 'retrieveMessages', recipientId: 22 }));
    };

    // Listen for messages
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log('newMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setMessages(mockMessages[contact.first + ' ' + contact.last] || []);
  };

  // eslint-disable-next-line no-unused-vars
  const handleSendMessage = (newMessage) => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'You', content: newMessage, timestamp: Date.now() },
      ]);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          width: drawerWidth,
          minWidth: 250,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
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
              <ListItemText
                primary={`${contact.first} ${contact.last}`}
                secondary={contact.volunteerType}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100%',
          overflow: 'hidden',
        }}
      ></Box>
    </Box>
  );
};

export default ChatUI;
