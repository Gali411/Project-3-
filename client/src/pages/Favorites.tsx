import React, { useEffect, useState } from 'react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const removeFromFavorites = (item) => {
    const updatedFavorites = favorites.filter((fav) => fav.Name !== item.Name);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <h1>Your Favorite Songs & Artists</h1>
      {favorites.length === 0 ? (
        <p>No favorites saved yet!</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((item) => (
            <div key={item.Name} className="favorite-item">
              <h3>{item.Name}</h3>
              <p>{item.wTeaser}</p>
              <button onClick={() => removeFromFavorites(item)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
