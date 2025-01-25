import { useState } from 'react';

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
        setRecommendations(data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Something went wrong. Please try again later.');
        setLoading(false);
      });
  }

  return (
    <div>
      <h1>Artist Recommendations</h1>
      <input
        type="text"
        value={artist}
        onChange={handleInputChange}
        placeholder="Enter artist name"
      />
      <button onClick={submit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {recommendations.length > 0 && (
        <div>
          <h2>Recommendations for {artist}</h2>
          <ul>
            {recommendations.map((item, index) => (
              <li key={index}>
                <h3>{item.Name}</h3>
                <p>{item.wTeaser}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
