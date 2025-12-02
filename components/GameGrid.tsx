
import React from 'react';
import { GameDeal } from '../types';
import { GameCard, GameCardSkeleton } from './GameCard';

interface GameGridProps {
  deals: GameDeal[];
  isLoading: boolean;
  onSelectGame: (deal: GameDeal) => void;
  wishlist: number[];
  onToggleWishlist: (gameId: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ deals, isLoading, onSelectGame, wishlist, onToggleWishlist }) => {
  // definim stilurile de animație direct în componentă
  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(15px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
  `;

  if (isLoading) {
    return (
      <>
        <style>{animationStyles}</style>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              className="animate-fade-in-up"
              style={{ 
                opacity: 0, 
                animationDelay: `${index * 60}ms` 
              }}
            >
              <GameCardSkeleton />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (deals.length === 0) {
    return (
      <>
        <style>{animationStyles}</style>
        <div className="text-center py-20 bg-red-950/40 rounded-lg animate-fade-in-up backdrop-blur-sm border border-white/0">
          <h2 className="text-2xl font-semibold text-white">Nicio Ofertă Găsită</h2>
          <p className="text-red-400 mt-2">Încearcă să ajustezi filtrele sau termenul de căutare.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {deals.map((deal, index) => (
          <div 
            key={`${deal.id}-${deal.title}`} 
            className="animate-fade-in-up"
            style={{ 
              opacity: 0, // începem invizibil
              animationDelay: `${index * 60}ms` // efect de cascadă
            }}
          >
            <GameCard 
              deal={deal} 
              onSelectGame={onSelectGame}
              isInWishlist={wishlist.includes(deal.id)}
              onToggleWishlist={onToggleWishlist}
            />
          </div>
        ))}
      </div>
    </>
  );
};
