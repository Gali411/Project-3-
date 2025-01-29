import React from 'react';

interface Recommendation {
  Name: string;
  wTeaser: string;
  id: string; // Assuming each recommendation has a unique id
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
  onSave: (item: Recommendation) => void;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations, onSave }) => {
  if (!recommendations.length) {
    return <p>No recommendations found. Try searching for something!</p>;
  }

  return (
    <div className="recommendations-list">
      {recommendations.map((item) => (
        <div key={item.id} className="recommendation-item">
          <h3>{item.Name}</h3>
          <p>{item.wTeaser}</p>
          <button onClick={() => onSave(item)}>Save</button>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
