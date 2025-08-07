import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Barangay, Category, User, NewListingData } from '../types';
import { BARANGAYS } from '../constants';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAddListing: (data: NewListingData) => void;
}

const initialFormData = {
    title: '',
    category: Category.RENTAL,
    barangay: Barangay.SANTO_NINO,
    price: 0,
    priceUnit: 'month' as 'month' | 'piece',
    description: '',
};

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


const NewListingModal: React.FC<NewListingModalProps> = ({ isOpen, onClose, onAddListing, currentUser }) => {
  const [paymentStep, setPaymentStep] = useState(0); // 0: form, 1: service fee payment
  const [formData, setFormData] = useState(initialFormData);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleClose = () => {
      setFormData(initialFormData);
      setImageData(null);
      setImagePreview(null);
      setPaymentStep(0);
      setError('');
      setGenerationError('');
      onClose();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (generationError) {
        setGenerationError('');
    }

    if (name === 'category') {
      const newCategory = value as Category;
      setFormData(prev => ({
        ...prev,
        category: newCategory,
        priceUnit: newCategory === Category.RENTAL ? 'month' : 'piece',
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            setError('File is too large. Please select an image under 2MB.');
            return;
        }
        setError('');
        setImagePreview(URL.createObjectURL(file));
        const base64 = await toBase64(file);
        setImageData(base64);
    }
  }

  const handleGenerateDescription = async () => {
    if (!formData.title || formData.price <= 0) {
      setGenerationError('Please enter a title and a valid price first.');
      return;
    }
    setIsGenerating(true);
    setGenerationError('');
    setFormData(prev => ({ ...prev, description: '' })); // Clear previous description

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a helpful assistant for a local marketplace app in Pagadian City, Philippines called RoomFinderPH. Your task is to write a compelling, friendly, and concise description for a user's listing. Be warm and inviting. Do not use markdown formatting.

        Generate a 2-3 sentence description for the following listing:
        - Title: ${formData.title}
        - Category: ${formData.category}
        - Location: ${formData.barangay}, Pagadian City
        - Price: ₱${formData.price} / ${formData.priceUnit}`;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        setFormData(prev => ({ ...prev, description: prev.description + chunk.text }));
      }

    } catch (err) {
      console.error("AI description generation failed", err);
      setGenerationError('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !imageData || formData.price <= 0) {
      setError('Please fill out all fields and upload an image. Price must be greater than zero.');
      return;
    }
    setError('');
    setPaymentStep(1);
  };
  
  const handleFinalSubmit = () => {
    if (!imageData) {
        setError('Image data is missing. Please re-upload the image.');
        return;
    }
    onAddListing({ ...formData, imageData });
    handleClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={handleClose}>
      <div className="bg-brand-light rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-yellow-200">
          <h2 className="text-2xl font-bold text-brand-dark">
            {paymentStep === 0 ? 'Create a New Listing' : 'Pay Service Fee'}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-brand-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {paymentStep === 0 && (
          <form onSubmit={handleProceedToPayment} className="flex-grow overflow-y-auto p-6 space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-brand-dark">You are posting as:</p>
                <div className="flex items-center mt-2">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-3">
                        <p className="font-bold text-brand-dark">{currentUser.name}</p>
                        <p className="text-xs text-gray-600">GCash for payouts: {currentUser.gcash}</p>
                    </div>
                </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-brand-dark">Listing Title</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" placeholder="e.g., Cozy 1BR Apartment" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark">Category</label>
              <div className="mt-2 flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="category" value={Category.RENTAL} checked={formData.category === Category.RENTAL} onChange={handleChange} className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">{Category.RENTAL}</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="category" value={Category.PRODUCT} checked={formData.category === Category.PRODUCT} onChange={handleChange} className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">{Category.PRODUCT}</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-brand-dark">Main Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover" />
                            ) : (
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                                <span>Upload a file</span>
                                <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB</p>
                        </div>
                    </div>
                </div>
                 <div>
                    <label htmlFor="barangay" className="block text-sm font-medium text-brand-dark">Barangay</label>
                    <select name="barangay" id="barangay" value={formData.barangay} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" required>
                        {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <label htmlFor="price" className="block text-sm font-medium text-brand-dark mt-4">Price (in PHP)</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="block w-full rounded-md border-gray-300 pr-16 focus:border-brand-primary focus:ring-brand-primary sm:text-sm" placeholder="0.00" required />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                /{formData.priceUnit}
                            </span>
                        </div>
                    </div>
                 </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-brand-dark">Description</label>
                <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !formData.title || formData.price <= 0}
                    className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={!formData.title ? "Please enter a title first" : formData.price <= 0 ? "Please enter a valid price first" : "Generate description with AI"}
                >
                  {isGenerating ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : '✨'}
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" placeholder="Tell us more about your listing..." required></textarea>
              {generationError && <p className="text-xs text-red-600 mt-1">{generationError}</p>}
            </div>


            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

            <div className="pt-4 border-t border-yellow-200">
              <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                Proceed to Payment
              </button>
            </div>
          </form>
        )}
        
        {paymentStep === 1 && (
            <div className="flex-grow overflow-y-auto p-8 text-center flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold text-brand-dark">One Last Step!</h3>
                <p className="text-gray-600 mt-2 mb-6 max-w-md">To publish your listing, please send the <span className="font-bold">₱50.00</span> service fee to the GCash account below.</p>
                
                <div className="space-y-3 bg-blue-50 p-6 rounded-lg border border-blue-200 w-full max-w-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">GCash Number:</span>
                        <span className="font-bold text-brand-dark text-lg">0975 148 2164</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">GCash Name:</span>
                        <span className="font-bold text-brand-dark text-lg">R. Finder P.</span>
                    </div>
                     <div className="flex justify-between items-center border-t pt-3 mt-3 border-blue-200">
                        <span className="font-semibold text-gray-700">Amount to Pay:</span>
                        <span className="font-extrabold text-blue-600 text-2xl">₱50.00</span>
                    </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 max-w-md">Once payment is sent, we'll review and publish your listing within 24 hours. Please keep a screenshot of your receipt.</p>

                <button 
                  onClick={handleFinalSubmit} 
                  className="mt-8 w-full max-w-sm bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    I've Sent the Payment, Post My Listing
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default NewListingModal;
