import { useState } from 'react';
import axios from 'axios';

interface Track {
  name: string;
  url: string;
}

interface SimilarArtist {
  artistName: string;
  track: Track;
  image: string;
}

const Home = () => {
  const [artists, setArtists] = useState<SimilarArtist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [artistName, setArtistName] = useState<string>('');

  const fetchSimilarArtists = async (artist: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/similar`, {
        params: { artist },
      });

      if (response.data.similarArtists) {
        setArtists(response.data.similarArtists);
      } else {
        setError('No similar artists found.');
      }
    } catch (err) {
      setError('Failed to fetch similar artists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find Similar Artists</h1>
      <input
        type="text"
        placeholder="Enter an artist name"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />
      <button onClick={() => fetchSimilarArtists(artistName)} disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {artists.length > 0 && (
        <div>
          {artists.map((artist) => (
            <div key={artist.artistName} style={{ marginBottom: '20px' }}>
              {artist.image && (
                <img
                  src={artist.image}
                  alt={artist.artistName}
                  style={{ width: '150px', height: '150px', borderRadius: '8px' }}
                />
              )}
              <h2>{artist.artistName}</h2>
              <p>
                <a href={artist.track.url} target="_blank" rel="noopener noreferrer">
                  {artist.track.name}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
