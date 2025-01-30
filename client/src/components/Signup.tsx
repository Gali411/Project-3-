import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations';

import Auth from '../utils/auth';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await registerUser({
        variables: { ...formState },
      });

      Auth.setToken(data.registerUser.token); // Save the token
      window.location.href = '/'; // Redirect on success
    } catch (err) {
      console.error('Error registering user:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
        Create a New Account
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          fullWidth
          value={formState.username}
          onChange={handleChange}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          value={formState.email}
          onChange={handleChange}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          value={formState.password}
          onChange={handleChange}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>

        {error && <Alert severity="error">{error.message}</Alert>}
      </Stack>
    </Box>
  );
};

export default Signup;
