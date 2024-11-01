/* eslint-disable no-console */
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import Messages from './Messages';
import MessageInput from './MessageInput';
import useUser from '../../../hooks/users/useUsers';
import { AuthContext } from '../../../store/auth-context';

const ChatUI = ({ drawerWidth }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const authCtx = useContext(AuthContext);
  const { getUserByVenueId } = useUser();

  useEffect(() => {
    if (!authCtx.currentUser) {
      console.error('User is not authenticated');
      return;
    }

    const ws = new WebSocket('wss://370srz3qol.execute-api.us-east-1.amazonaws.com/dev/');
    setSocket(ws);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'retrieveMessages') {
        // Assuming the server responds with the retrieved messages
        setMessages(data.messages || []); // Ensure it sets an array to avoid errors
      } else if (data.action === 'sendMessage') {
        // Handle incoming messages
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [authCtx.currentUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      if (!authCtx.currentUser) {
        console.error('User is not authenticated');
        return;
      }

      try {
        const response = await getUserByVenueId(authCtx.currentUser.attributes['custom:venueId']);
        const filteredUsers = response.filter(
          (u) => u.auth_user_id !== authCtx.currentUser.username,
        );
        setContacts(filteredUsers);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, [authCtx.currentUser, getUserByVenueId]);

  const handleContactClick = (contact) => {
    if (!authCtx.currentUser) {
      console.error('User is not authenticated');
      return;
    }

    setSelectedContact(contact);
    setMessages([]); // Clear the current messages while waiting for the new messages

    if (socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = JSON.stringify({
        body: {
          action: 'retrieveMessages',
          senderId: authCtx.currentUser.userId, // Current user's ID
          recipientId: contact.auth_user_id, // Selected contact's ID
          startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
          endDate: Date.now(),
        },
      });

      try {
        socket.send(messagePayload);
        console.log('Message sent successfully.');
      } catch (error) {
        console.error('Error sending retrieveMessages request:', error);
      }
    } else {
      console.error('WebSocket connection is not open.');
    }
  };

  const handleSendMessage = (newMessage) => {
    if (!authCtx.currentUser || !selectedContact) {
      console.error('User or selected contact is not available');
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN && newMessage.content.trim() !== '') {
      const messagePayload = JSON.stringify({
        body: {
          action: 'sendMessage',
          senderId: authCtx.currentUser.userId,
          recipientId: selectedContact.auth_user_id,
          messageContent: newMessage.content,
          timestamp: Date.now(),
        },
      });

      try {
        socket.send(messagePayload);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const getInitials = (contact) => {
    if (!contact) return '';

    const firstNameInitial = contact.first_name ? contact.first_name[0].toUpperCase() : '';
    const lastNameInitial = contact.last_name ? contact.last_name[0].toUpperCase() : '';

    return `${firstNameInitial}${lastNameInitial}`;
  };

  if (!authCtx.currentUser) {
    return (
      <Box
        sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}
    >
      <Box
        sx={{
          width: drawerWidth,
          minWidth: 250,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <List>
          {contacts.map((contact, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleContactClick(contact)}
              sx={{
                padding: '10px 20px',
                borderBottom: 1,
                borderColor: 'divider',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Avatar
                alt={`${contact.first_name} ${contact.last_name}`}
                src={contact.imageUrl || null}
                sx={{ marginRight: 2 }}
              >
                {!contact.imageUrl && getInitials(contact)}
              </Avatar>
              <ListItemText
                primary={`${contact.first_name} ${contact.last_name}`}
                secondary={contact.role}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2, bgcolor: 'background.default' }}>
          <Messages
            messages={messages}
            sender={authCtx.currentUser.username}
            selectedContact={selectedContact}
          />
          <Box ref={messagesEndRef} />
        </Box>
        <Divider />
        <MessageInput onSend={handleSendMessage} disabled={!isConnected} />
      </Box>
    </Box>
  );
};

export default ChatUI;
