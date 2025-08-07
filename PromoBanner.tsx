
import React, { useState } from 'react';

const PromoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-brand-primary to-yellow-600 text-white rounded-lg shadow-lg p-4 my-6 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg">🎉 Welcome to RoomFinderPH!</h3>
        <p className="text-sm">New user? Enjoy 10% off on your first transaction. Use code: <span className="font-bold bg-white/20 px-2 py-1 rounded">PAGADIAN10</span></p>
      </div>
      <button 
        onClick={() => setIsVisible(false)} 
        className="text-xl font-bold hover:text-yellow-200 transition-colors"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
};

export default PromoBanner;
