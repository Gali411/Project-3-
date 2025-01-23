import { useState, useEffect } from 'react';

export default function Home() {
 
  const [link, setLink] = useState(null);

  useEffect(() => {
    
    fetch("https://api.song.link/v1-alpha.1/links?url=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F4pnupHcsf2U60BY1SzMwJZ&userCountry=US&songIfSingle=true")
      .then(response => response.json())
      .then(data => {
        
        const amazonMusicLink = data.linksByPlatform.amazonMusic?.url;
        setLink(amazonMusicLink);  
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Amazon Music Link
          </a>
        ) : (
          'Loading link...'
        )}
      </h1>
    </div>
  );
}
