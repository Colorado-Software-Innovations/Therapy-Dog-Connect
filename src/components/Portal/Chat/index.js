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

  // Initialize WebSocket connection
  useEffect(() => {
    if (!authCtx?.currentUser) {
      console.error('User is not authenticated');
      return;
    }

    const ws = new WebSocket('wss://370srz3qol.execute-api.us-east-1.amazonaws.com/dev', );
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.warn('WebSocket connection closed');
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [authCtx?.currentUser]);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch contacts based on venue ID
  useEffect(() => {
    const fetchContacts = async () => {
      if (!authCtx?.currentUser) {
        console.error('User is not authenticated');
        return;
      }

      try {
        const response = await getUserByVenueId(authCtx.currentUser.attributes['custom:venueId']);
        const filteredUsers = response.filter(
          (user) => user.auth_user_id !== authCtx.currentUser.username,
        );
        setContacts(filteredUsers);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, [authCtx?.currentUser, getUserByVenueId]);

  const handleWebSocketMessage = (data) => {
    switch (data.action) {
      case 'retrieveMessages':
        setMessages(data.messages || []);
        break;
      case 'sendMessage':
        setMessages((prevMessages) => [...prevMessages, data]);
        break;
      default:
        console.warn('Unknown WebSocket action:', data.action);
    }
  };

  const handleContactClick = (contact) => {
    if (!authCtx?.currentUser) {
      console.error('User is not authenticated');
      return;
    }

    setSelectedContact(contact);
    setMessages([]); // Clear current messages while fetching new ones

    if (socket?.readyState === WebSocket.OPEN) {
      const messagePayload = {
        action: 'retrieveMessages',
        senderId: authCtx.currentUser.userId,
        recipientId: contact.auth_user_id,
        startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
        endDate: Date.now(),
      };

      try {
        socket.send(JSON.stringify({ body: messagePayload }));
        console.log('Retrieve messages request sent');
      } catch (error) {
        console.error('Error sending retrieveMessages request:', error);
      }
    } else {
      console.error('WebSocket connection is not open.');
    }
  };

  const handleSendMessage = (newMessage) => {
    if (!authCtx?.currentUser || !selectedContact || !newMessage.content.trim()) {
      console.error('Invalid message or user/contact not selected');
      return;
    }

    if (socket?.readyState === WebSocket.OPEN) {
      const messagePayload = {
        action: 'sendMessage',
        senderId: authCtx.currentUser.userId,
        recipientId: selectedContact.auth_user_id,
        messageContent: newMessage.content,
        timestamp: Date.now(),
      };

      try {
        socket.send(JSON.stringify({ body: messagePayload }));
        console.log('Message sent');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('WebSocket connection is not open.');
    }
  };

  const getInitials = (contact) => {
    if (!contact) return '';
    const firstNameInitial = contact.first_name?.[0]?.toUpperCase() || '';
    const lastNameInitial = contact.last_name?.[0]?.toUpperCase() || '';
    return `${firstNameInitial}${lastNameInitial}`;
  };

  if (!authCtx?.currentUser) {
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
      {/* Contacts List */}
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
          {contacts.map((contact) => (
            <ListItem
              key={contact.auth_user_id}
              button
              onClick={() => handleContactClick(contact)}
              sx={{
                padding: '10px 20px',
                borderBottom: 1,
                borderColor: 'divider',
                '&:hover': { backgroundColor: 'grey.100' },
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

      {/* Chat Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
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
