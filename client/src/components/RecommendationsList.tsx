import React from 'react';

const RecommendationsList = ({ recommendations }) => {
  return (
    <div>
      {recommendations.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {recommendations.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <a href={item.wUrl} target="_blank" rel="noopener noreferrer">
                {item.Name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations to display.</p>
      )}
    </div>
  );
};

export default RecommendationsList;