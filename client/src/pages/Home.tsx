

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

  function submit(e:any) {

    e.preventDefault();
    
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
        backgroundColor: 'lightgray',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{
        //color: 'red',
        fontWeight: 300,
      }}>
        Music Finder
      </Typography>

      {/* Input and Submit Button Side by Side */}
      <form onSubmit={submit}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%', maxWidth: 600, justifyContent: 'flex-end' }}>
          
          <TextField
            value={artist}
            onChange={handleInputChange}
            label="Enter artist name"
            variant="filled"
            fullWidth
            className="custom-label"
          />
          <Button onClick={submit} variant="contained" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>

        </Box>
      </form>


      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

      <ImageList sx={{ width: 900, height: 800, marginTop: 4 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">Artists List LIST</ListSubheader>
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