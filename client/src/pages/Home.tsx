import React, { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import { Box, TextField, Button, Typography } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';

export default function Home() {
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Handle input changes
  function handleInputChange(event: { target: { value: string } }) {
    setArtist(event.target.value);
  }

  // Submit the artist name and fetch recommendations
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
        if (data.similarArtists) {
          setRecommendations(data.similarArtists); // Set fetched recommendations
        } else {
          setError('No similar artists found.');
        }
        setLoading(false);
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
        padding: 2,
        backgroundColor: 'lightgray',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Artist Recommendations
      </Typography>

      <TextField
        value={artist}
        onChange={handleInputChange}
        label="Enter artist name"
        variant="filled"
        fullWidth
        className="custom-label"
        sx={{
          marginBottom: 6,
          width: '100%',
          maxWidth: 600,
        }}
      />

      <Button onClick={submit} variant="contained" disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </Button>

      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

      <ImageList sx={{ width: 900, height: 800, marginTop: 4 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">Artist Recommendations</ListSubheader>
        </ImageListItem>

        {recommendations.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={item.image || 'https://via.placeholder.com/150'} // Fallback image if no image is available
              alt={item.track.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={
                <a
                  href={item.track.url} // Make the track name a clickable link
                  target="_blank"        // Open in a new tab
                  rel="noopener noreferrer" // For security reasons
                  style={{ color: 'white', textDecoration: 'none' }} // Style the link
                >
                  {item.track.name}
                </a>
              }
              subtitle={item.artistName}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.track.name}`}
                >
                  {/* Optional: Add icon or info */}
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
