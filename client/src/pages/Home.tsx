import { useState } from 'react';

import image_1 from '../assets/music/image_1.avif';
import image_2 from '../assets/music/image_2.avif';
import image_3 from '../assets/music/image_3.avif';
import image_4 from '../assets/music/image_4.avif';

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

  const _recommendations = [
    {
      "artistName": "Yukon Blonde",
      "track": {
        "name": "Stairway",
        "url": "https://www.last.fm/music/Yukon+Blonde/_/Stairway",
        "imageUrl": image_1,
      }
    },
    {
      "artistName": "Ivan & Alyosha",
      "track": {
        "name": "Girl",
        "url": "https://www.last.fm/music/Ivan+/_/Girl",
        "imageUrl": image_2,
      }
    },
    {
      "artistName": "Imaginary Cities",
      "track": {
        "name": "Marry The Sea (Bonus Track)",
        "url": "https://www.last.fm/music/Imaginary+Cities/_/Marry+The+Sea+(Bonus+Track)",
        "imageUrl": image_3,
      }
    },
    {
      "artistName": "Arkells",
      "track": {
        "name": "Never Thought That This Would Happen",
        "url": "https://www.last.fm/music/Arkells/_/Never+Thought+That+This+Would+Happen",
        "imageUrl": image_4,
      }
    },
  ];

  //_recommendations.tracks

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
        setRecommendations(data); setLoading(false);
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
        className="custom-label" // Add custom CSS class here
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
          <ListSubheader component="div">Artists List LIST</ListSubheader>
        </ImageListItem>
        {_recommendations.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={item.track.imageUrl}
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




