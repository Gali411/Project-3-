import { useState } from 'react';

interface Track {
  rank: number;
  name: string;
  playcount: number;
  url: string;
}

interface ArtistData {
  similarArtist: string;
  tracks: Track[];
}

export default function Home() {
  const [artist, setArtist] = useState<string>('');
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArtist(event.target.value);
  };

  const submit = async () => {
    if (!artist) {
      setError('Please enter an artist name');
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/similar?artist=${artist}`);
      if (!response.ok) {
        throw new Error('Failed to fetch similar artist data');
      }
      const data = await response.json();
      setArtistData(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data');
    }
  };

  return (
    <div>
      <h1>Find Similar Artists</h1>

      <input
        type="text"
        value={artist}
        onChange={handleInputChange}
        placeholder="Enter artist name"
      />

      <button onClick={submit}>Submit</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {artistData && (
        <div>
          <h2>Similar Artist: {artistData.similarArtist}</h2>
          <h3>Top Tracks:</h3>
          <ul>
            {artistData.tracks.map((track) => (
              <li key={track.rank}>
                <strong>{track.rank}. {track.name}</strong> - Played {track.playcount} times
                <br />
                <a href={track.url} target="_blank" rel="noopener noreferrer">Listen here</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
