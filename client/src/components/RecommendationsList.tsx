import React from 'react';

const RecommendationsList = ({ recommendations, onSave }) => {
  if (!recommendations.length) return <p>No recommendations found. Try searching for something!</p>;

  return (
    <div className="recommendations-list">
      {recommendations.map((item) => (
        <div key={item.Name} className="recommendation-item">
          <h3>{item.Name}</h3>
          <p>{item.wTeaser}</p>
          <button onClick={() => onSave(item)}>Save</button>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;