
import React from 'react';
import { type Listing } from '../types';
import StarRating from './StarRating';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
      onClick={() => onSelect(listing)}
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={listing.imageUrl} alt={listing.title} />
        {listing.isFlashDeal && (
          <div className="absolute top-2 left-2 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            ⚡ Flash Deal
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide">{listing.category} &bull; {listing.barangay}</p>
        <h3 className="text-lg font-bold text-brand-dark mt-1 truncate">{listing.title}</h3>
        <p className="text-xl font-extrabold text-brand-dark mt-2">
          ₱{listing.price.toLocaleString()}
          {listing.priceUnit && <span className="text-sm font-medium text-gray-500"> /{listing.priceUnit}</span>}
        </p>
        <div className="flex items-center mt-3 text-sm">
          <StarRating rating={listing.rating} />
          <span className="text-gray-500 ml-2">({listing.reviewCount} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
