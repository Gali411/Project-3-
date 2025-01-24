import { useState, useEffect } from 'react';

export default function Home() {
 
    // fetch("http://localhost:3000/api/similar?artist=Knxwledge")

    useEffect(() => {
      fetch("/api/similar?artist=Knxwledge")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    }, [])

  return (
    <div>
      I'm running
    </div>
  );
}
