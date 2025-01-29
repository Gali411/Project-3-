

import React, { useState } from 'react';

import ImageList from '@mui/material/ImageList';
import { Box, TextField, Button, Typography } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
//import InfoIcon from '@mui/icons-material/Info';

export default function Home() {

  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  function handleInputChange(event: { target: { value: string } }) {
    setArtist(event.target.value);
  }

  function submit() {
    if (!artist) {
      setError('Please enter an artist name');
      return;
    }

    setLoading(true);
    setError(null); // Reset error on new request

    fetch(`/api/similar?artist=${artist}`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data.similarArtists || []); setLoading(false);
      })
      .catch((error) => {
        setError('Something went wrong. Please try again later.');
        setLoading(false);
      });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        padding: 4,
        backgroundColor: 'lightgrey',
      }}
    >
      <Typography variant="h3"
        gutterBottom
        sx={{
          fontFamily: "'Roboto', sans-serif",
          fontWeight: '700',
          color: 'black',
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
          letterSpacing: '2px',
          fontSize: '2.5rem', // Adjust size for prominence
          marginBottom: 4,
        }}
      >
        Find Me Music!
      </Typography>

      

<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 1,
    width: '100%',
    maxWidth: 600,
    marginBottom: 2,
  }}
>
  <TextField
    value={artist}
    onChange={handleInputChange}
    label="Enter artist name"
    variant="filled"
    fullWidth
    sx={{ flexGrow: 1 }}
  />

  <Button 
    onClick={submit} 
    variant="contained" 
    disabled={loading}
    sx={{ height: '56px' }} // Align button height with text field
  >
    {loading ? 'Loading...' : 'Submit'}
  </Button>
</Box>

      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

      <ImageList sx={{ width: 900, height: 800, marginTop: 2 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">Artists List</ListSubheader>
        </ImageListItem>
        {recommendations.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={item.image}
              alt={item.track.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.track.name}
              subtitle={item.artistName}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.track.name}`}
                >

                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
} 