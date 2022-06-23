import React from 'react';
import './../App.css';

/**
 * LoadingIndicatorコンポーネント
 */
const LoadingIndicator = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIndicator;