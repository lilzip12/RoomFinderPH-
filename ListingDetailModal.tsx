import React, { useState, useMemo } from 'react';
import { type Listing, Category } from '../types';
import StarRating from './StarRating';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

const GCashIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.22 14.47l-3.54-3.54c-.19-.19-.19-.51 0-.71l.71-.71c.19-.19.51-.19.71 0l2.12 2.12 4.95-4.95c.19-.19.51-.19.71 0l.71.71c.19.19.19.51 0 .71l-6.36 6.36c-.2.2-.52.2-.71.01z" fill="#0066FF"/>
    </svg>
);

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const [useInstallment, setUseInstallment] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0); // 0: initial, 1: processing, 2: show details

  const initialImage = useMemo(() => listing?.images?.[0] || '', [listing]);
  const [activeImage, setActiveImage] = useState(initialImage);

  React.useEffect(() => {
    if (listing?.images?.[0]) {
      setActiveImage(listing.images[0]);
    }
  }, [listing]);


  if (!listing) return null;

  const handlePayment = () => {
    setPaymentStep(1);
    setTimeout(() => {
        setPaymentStep(2);
    }, 2000);
  };

  const resetAndClose = () => {
    setPaymentStep(0);
    setUseInstallment(false);
    onClose();
  };

  const installmentPrice = (listing.price * 1.1) / 3;
  const finalPrice = useInstallment ? installmentPrice : listing.price;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" 
      onClick={resetAndClose}
    >
      <div 
        className="bg-brand-light rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-brand-dark">
          <img src={activeImage} alt={listing.title} className="w-full h-64 object-contain" />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent flex justify-center space-x-2">
            {listing.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(img)} className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-secondary scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={img} alt={`${listing.title} thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                </button>
            ))}
          </div>
          <button 
            onClick={resetAndClose} 
            className="absolute top-4 right-4 bg-white/70 rounded-full p-2 text-brand-dark hover:bg-white transition-transform duration-200 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <p className="text-sm font-bold text-brand-primary uppercase">{listing.category} &bull; {listing.barangay}</p>
                    <h2 className="text-3xl font-bold text-brand-dark mt-1">{listing.title}</h2>
                    <div className="flex items-center mt-2">
                        <StarRating rating={listing.rating} />
                        <span className="text-gray-600 ml-2 text-sm">{listing.rating.toFixed(1)} ({listing.reviewCount} reviews)</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Seller Information</h3>
                    <div className="flex items-center">
                        <img src={listing.seller.avatarUrl} alt={listing.seller.name} className="w-12 h-12 rounded-full" />
                        <div className="ml-4">
                            <p className="font-semibold text-brand-dark">{listing.seller.name}</p>
                            <a href={`https://m.me/${listing.seller.id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Contact via Messenger</a>
                        </div>
                    </div>
                     <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Reviews</h3>
                    <div className="space-y-4">
                        {listing.reviews.length > 0 ? listing.reviews.map((review, index) => (
                            <div key={index} className="flex items-start">
                                <img src={review.user.avatarUrl} alt={review.user.name} className="w-10 h-10 rounded-full" />
                                <div className="ml-4">
                                    <p className="font-semibold text-brand-dark">{review.user.name}</p>
                                    <StarRating rating={review.rating} />
                                    <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 italic">No reviews yet.</p>}
                    </div>

                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                      {paymentStep === 0 && (
                          <>
                            <p className="text-2xl font-extrabold text-brand-dark">
                                ₱{listing.price.toLocaleString()}
                                {listing.priceUnit && <span className="text-base font-medium text-gray-500"> /{listing.priceUnit}</span>}
                            </p>

                            {listing.category === Category.PRODUCT && (
                                <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-primary rounded" checked={useInstallment} onChange={(e) => setUseInstallment(e.target.checked)} />
                                        <span className="ml-3 text-sm text-brand-dark">Pay in 3 installments</span>
                                    </label>
                                    {useInstallment && (
                                        <p className="text-xs text-gray-600 mt-2">
                                            Pay <span className="font-bold">₱{installmentPrice.toFixed(2)}</span> for 3 months.
                                        </p>
                                    )}
                                </div>
                            )}

                            <button 
                              onClick={handlePayment}
                              className="mt-6 w-full bg-[#0066FF] text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                                <GCashIcon /> Pay with GCash
                            </button>
                          </>
                      )}
                      {paymentStep === 1 && (
                          <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
                              <p className="mt-4 font-semibold text-brand-dark">Processing Payment...</p>
                          </div>
                      )}
                      {paymentStep === 2 && (
                          <div className="text-left py-4">
                              <h3 className="text-xl font-bold text-brand-dark text-center mb-4">Complete Your Payment</h3>
                              
                              {listing.seller.gcash ? (
                                <>
                                  <p className="text-gray-600 text-sm text-center mb-6">Please send the exact amount to the seller's GCash details below.</p>
                                  <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                      <div className="flex justify-between items-center">
                                          <span className="font-semibold text-gray-700 text-sm">GCash Number:</span>
                                          <span className="font-bold text-brand-dark text-base">{listing.seller.gcash}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <span className="font-semibold text-gray-700 text-sm">GCash Name:</span>
                                          <span className="font-bold text-brand-dark text-base">{listing.seller.name}</span>
                                      </div>
                                      <div className="flex justify-between items-center border-t pt-3 mt-3 border-blue-200">
                                          <span className="font-semibold text-gray-700">Amount to Pay:</span>
                                          <span className="font-extrabold text-blue-600 text-xl">
                                              ₱{finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </span>
                                      </div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-4 text-center">Once payment is sent, the seller will confirm your transaction. Please save a screenshot of your receipt.</p>
                                </>
                              ) : (
                                <div className="text-center py-4 px-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <h3 className="font-bold text-brand-dark">Contact Seller for Payment</h3>
                                  <p className="text-sm text-gray-600 mt-2">This seller has not provided GCash details. Please contact them directly using the Messenger button to arrange payment.</p>
                                </div>
                              )}
                              
                              <button onClick={resetAndClose} className="mt-6 w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition">Done</button>
                          </div>
                      )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailModal;