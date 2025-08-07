import React from 'react';
import type { User } from '../types';

interface ProfileDropdownProps {
  isOpen: boolean;
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, user, onLogout, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
        {/* Backdrop to close dropdown on outside click */}
        <div className="fixed inset-0 z-40" onClick={onClose} />

        <div 
            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
        >
            <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-700">Signed in as</p>
                <p className="text-sm font-medium text-brand-dark truncate">{user.name}</p>
            </div>
            <div className="py-1">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onLogout();
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Logout
                </a>
            </div>
        </div>
    </>
  );
};

export default ProfileDropdown;
