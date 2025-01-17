import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={query}
        placeholder="Enter an artist or band name"
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px' }}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;