import React, { useEffect } from 'react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const baseClasses = "fixed bottom-5 right-5 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center gap-4 transition-all duration-300 animate-fade-in-up";
  const successClasses = "bg-green-500 text-white";
  const errorClasses = "bg-red-500 text-white";

  const typeClasses = toast.type === 'success' ? successClasses : errorClasses;

  const SuccessIcon = () => (
    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  );

  const ErrorIcon = () => (
    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  );

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {toast.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
      <span className="font-semibold">{toast.message}</span>
      <button onClick={onClose} className="ml-4 text-2xl font-light hover:opacity-80 leading-none" aria-label="Close">&times;</button>
    </div>
  );
};

export default Toast;
