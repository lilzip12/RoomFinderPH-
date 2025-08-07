import React, { useState } from 'react';
import Icon from './Icon';
import type { User } from '../types';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
    currentUser: User | null;
    onLogin: () => void;
    onLogout: () => void;
}

const BahayKuboIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 9.5V22h20V9.5L12 2zm-1 18H5v-7h6v7zm2 0V13h6v7h-6zm6-9h-2.5l-3.5-2.5-3.5 2.5H4L12 4l8 5.5z"/>
    </svg>
);

const Header: React.FC<HeaderProps> = ({ currentUser, onLogin, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-brand-light/80 backdrop-blur-sm sticky top-0 z-40 w-full shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BahayKuboIcon />
            <span className="text-2xl font-bold text-brand-dark tracking-tight">RoomFinderPH</span>
          </div>
          <div className="flex items-center">
            {currentUser ? (
               <div className="relative">
                 <button 
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                    className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                 >
                    <Icon className="w-9 h-9 text-brand-dark">
                        <img src={currentUser.avatarUrl} alt="User Profile" className="rounded-full" />
                    </Icon>
                 </button>
                 <ProfileDropdown 
                    isOpen={isDropdownOpen}
                    user={currentUser}
                    onLogout={() => {
                        onLogout();
                        setIsDropdownOpen(false);
                    }}
                    onClose={() => setIsDropdownOpen(false)}
                 />
               </div>
            ) : (
                <button
                    onClick={onLogin}
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Login
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;