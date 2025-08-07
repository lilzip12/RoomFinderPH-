
import React from 'react';
import { type Listing } from '../types';
import ListingCard from './ListingCard';

interface ListingGridProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, onSelectListing }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} onSelect={onSelectListing} />
      ))}
    </div>
  );
};

export default ListingGrid;
