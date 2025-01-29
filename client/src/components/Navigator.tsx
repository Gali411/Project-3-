import { useState } from 'react';
import Auth from '../utils/auth';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Login from './Login';
import Signup from './Signup';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const Navigator = () => {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // Toggle between login and signup

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleForm = () => setShowLogin(!showLogin);

  const token = Auth.getToken();

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpen} 
        sx={{ fontWeight: 'bold' }}
      >
        {token ? 'Logout' : 'Login / Signup'}
      </Button>

      <Modal open={open} onClose={handleClose} aria-labelledby="auth-modal-title">
        <Box sx={modalStyle}>
          {token ? (
            <Stack spacing={3}>
              <Typography variant="h6">Are you sure you want to logout?</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  Auth.removeToken();
                  window.location.href = '/';
                }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {showLogin ? 'Welcome Back!' : 'Join Music Finder!'}
              </Typography>

              {showLogin ? <Login /> : <Signup />}

              <Button variant="text" onClick={toggleForm} sx={{ fontSize: '0.9rem' }}>
                {showLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Navigator;
