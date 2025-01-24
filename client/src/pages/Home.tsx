import { useState, useEffect, SetStateAction } from 'react';

export default function Home() {
 
    // fetch("http://localhost:3000/api/similar?artist=Knxwledge")

    const [artist, setArtist] = useState('')

    function handleInputChange(event: { target: { value: SetStateAction<string>; }; }) {
      setArtist(event.target.value);
    }

    function submit() {
      fetch(`/api/similar?artist=${artist}`)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    }

  return (
    <div>
      I'm running
      <input
        type="text"
        value={artist}
        onChange={handleInputChange}
        placeholder="Enter artist name"
      />
      <button onClick={submit}>Submit</button>
    </div>
  );
}
