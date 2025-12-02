
import React from 'react';
import { GameDeal } from '../types';
import { Steam, EpicGames, GOG, Heart, Star, Tag } from './icons';

interface GameCardProps {
  deal: GameDeal;
  onSelectGame: (deal: GameDeal) => void;
  isInWishlist: boolean;
  onToggleWishlist: (gameId: number) => void;
}

const platformIcons: { [key: string]: React.ReactElement } = {
  'Steam': <Steam className="w-8 h-8" />,
  'Epic Games': <EpicGames className="w-7 h-7" />,
  'GOG': <GOG className="w-7 h-7" />,
  'Humble Store': <Tag className="w-7 h-7" />,
};

export const GameCard: React.FC<GameCardProps> = ({ deal, onSelectGame, isInWishlist, onToggleWishlist }) => {
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(deal.id);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    // revenire la thumbnail original dacă imaginea steam hi-res eșuează
    if (deal.thumb && target.src !== deal.thumb) {
        target.src = deal.thumb;
    }
  };
  
  return (
    <div 
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/20 transition-all duration-300 transform hover:scale-[1.02] hover:border-red-900/50 cursor-pointer group flex flex-col backdrop-blur-sm"
      onClick={() => onSelectGame(deal)}
    >
      <div className="relative">
        <img 
            src={deal.coverImage} 
            alt={deal.title} 
            onError={handleImageError}
            className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent"></div>
        
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md border border-red-500">
          -{Math.round(deal.savings)}%
        </div>
        
        <button 
          onClick={handleWishlistClick}
          className={`absolute top-2 left-2 p-2 rounded-full transition-all duration-200 backdrop-blur-md ${isInWishlist ? 'bg-red-600/90 text-white' : 'bg-black/40 text-zinc-400 hover:bg-red-600 hover:text-white'}`}
          aria-label={isInWishlist ? "Șterge din wishlist" : "Adaugă în wishlist"}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5">
                <Star className="w-3 h-3 text-red-500" />
                <span className="text-zinc-200 font-bold text-xs">{deal.metacriticScore > 0 ? deal.metacriticScore : 'N/A'}</span>
            </div>
            <div className="text-zinc-300 bg-black/60 p-1.5 rounded backdrop-blur-md border border-white/5">
                {React.cloneElement(platformIcons[deal.platform] || <Tag className="w-7 h-7" />, { key: deal.platform, className: "w-4 h-4" })}
            </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-zinc-900/0 to-black/20">
        <h3 className="font-bold text-zinc-100 truncate group-hover:text-red-500 transition-colors text-sm sm:text-base">{deal.title}</h3>
        
        <div className="mt-auto pt-4 flex items-baseline justify-end space-x-2">
            <span className="text-zinc-600 line-through text-xs">€{deal.normalPrice.toFixed(2)}</span>
            <span className="text-xl font-bold text-red-500">€{deal.salePrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg animate-pulse flex flex-col">
      <div className="bg-zinc-800 w-full h-48"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-5 bg-zinc-800 rounded w-3/4 mb-4"></div>
        <div className="mt-auto pt-4 flex justify-end">
            <div className="h-8 bg-zinc-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
