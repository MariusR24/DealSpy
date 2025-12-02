
import React, { useState } from 'react';
import { Search } from './icons';

interface HeaderProps {
  onSearch: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };
  
  return (
    <header className="bg-black/80 backdrop-blur-lg sticky top-0 z-50 border-b border-red-900/30 shadow-lg shadow-red-900/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <div className="flex items-center space-x-3 flex-shrink-0 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="relative">
             <div className="absolute inset-0 bg-red-600 blur opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
             <img 
               src="/logo.png" 
               alt="DealSpy Logo" 
               className="w-10 h-10 object-contain relative z-10 transition-transform group-hover:scale-110 duration-300"
               onError={(e) => {
                 // Fallback simplu dacă imaginea nu există
                 e.currentTarget.style.display = 'none';
               }}
             />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 tracking-wider hidden sm:block font-mono">
            DealSpy
          </h1>
        </div>

        {/* bară de căutare - ocupă spațiu flexibil */}
        <div className="flex-1 min-w-0 max-w-xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="Caută jocul preferat..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition shadow-inner group-hover:border-red-900/50"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
        
        {/* substituent pentru echilibru layout */}
        <div className="w-10 sm:w-auto"></div>
      </div>
    </header>
  );
};
