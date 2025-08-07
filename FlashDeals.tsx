
import React from 'react';
import { type Listing } from '../types';
import ListingCard from './ListingCard';

interface FlashDealsProps {
  deals: Listing[];
  onSelectListing: (listing: Listing) => void;
}

const FlashDeals: React.FC<FlashDealsProps> = ({ deals, onSelectListing }) => {
  if (deals.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-brand-dark">⚡ Flash Deals</h2>
        <div className="ml-3 h-1 flex-grow bg-gradient-to-r from-brand-accent to-transparent"></div>
      </div>
      <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
        {deals.map(deal => (
          <div key={deal.id} className="flex-shrink-0 w-80">
            <ListingCard listing={deal} onSelect={onSelectListing} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashDeals;
