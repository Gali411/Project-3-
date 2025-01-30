import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import Auth from '../utils/auth';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser] = useMutation(LOGIN_USER);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: { username, password } });
      Auth.setToken(data.loginUser.token); // Save the token
      window.location.href = '/'; // Redirect on success
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
        Login to Your Account
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;
