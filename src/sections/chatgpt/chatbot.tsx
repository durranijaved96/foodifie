import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon, Close as CloseIcon, Chat as ChatIcon } from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: 390,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: theme.shadows[3],
  padding: theme.spacing(0, 2),
  borderRadius: '8px',
  border: '1px solid #919EAB3D',
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: '#00A5AA',
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(1),
  fontFamily: 'Public Sans, sans-serif',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: '1.6',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.light,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-input': {
    fontFamily: 'Public Sans, sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    fontStyle: 'normal',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: '#212B36',
  color: 'white',
  fontFamily: 'Public Sans, sans-serif',
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '22px',
  textTransform: 'capitalize',
  '&:hover': {
    backgroundColor: '#212B36',
  },
}));

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ user: string, bot: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const exponentialBackoff = (retryCount: number) => {
    const baseDelay = 1000; // 1 second
    return Math.pow(2, retryCount) * baseDelay;
  };

  const handleSendMessage = async (retryCount = 0) => {
    if (input.trim() === '') return;
  
    const userMessage = input.trim();
    setMessages([...messages, { user: userMessage, bot: 'Thinking...' }]);
    setInput('');
    setLoading(true);
  
    console.log(API_KEY); // Check if API_KEY is correctly loaded
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userMessage }],
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const botMessage = response.data.choices[0].message.content.trim();
      setMessages(prevMessages => [
        ...prevMessages.slice(0, prevMessages.length - 1),
        { user: userMessage, bot: botMessage },
      ]);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        // Handle rate limiting
      } else {
        console.error('Error sending message to OpenAI API:', error);
        setMessages(prevMessages => [
          ...prevMessages.slice(0, prevMessages.length - 1),
          { user: userMessage, bot: 'Sorry, something went wrong.' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleSendButtonClick = () => {
    handleSendMessage();
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: 1000, margin: 2 }}>
      {isOpen ? (
        <StyledPaper>
          <StyledHeader>
            <StyledTypography variant="h6">Chat Assistant</StyledTypography>
            <StyledIconButton onClick={handleToggle}>
              <CloseIcon />
            </StyledIconButton>
          </StyledHeader>
          <Box sx={{ padding: 1, overflowY: 'auto', flexGrow: 1 }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="primary">{`You: ${msg.user}`}</Typography>
                <Typography variant="body2" color="textSecondary">{`Bot: ${msg.bot}`}</Typography>
              </Box>
            ))}
            {loading && <CircularProgress size={24} sx={{ display: 'block', margin: 'auto' }} />}
          </Box>
          <Box sx={{ display: 'flex', padding: 1 }}>
            <StyledTextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendButtonClick()}
              placeholder="Type a message"
              variant="outlined"
              size="medium"
            />
            <StyledIconButton onClick={handleSendButtonClick} color="primary" disabled={loading}>
              <SendIcon />
            </StyledIconButton>
          </Box>
        </StyledPaper>
      ) : (
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleToggle}
          startIcon={<ChatIcon />}
          sx={{ boxShadow: 3 }}
        >
          AI Assistant
        </StyledButton>
      )}
    </Box>
  );
};

export default Chatbot;
