
import React, { useEffect, useState, useMemo } from 'react';
import { GameDetails, GameEdition } from '../types';
import { X, Heart, ExternalLink, Steam, EpicGames, GOG, Tag } from './icons';
import { PriceHistoryChart } from './PriceHistoryChart';

interface GameDetailModalProps {
  game: GameDetails;
  onClose: () => void;
  wishlist: number[];
  onToggleWishlist: (gameId: number) => void;
}

const platformIcons: { [key: string]: React.ReactNode } = {
    'Steam': <Steam className="w-5 h-5" />,
    'Epic Games': <EpicGames className="w-5 h-5" />,
    'GOG': <GOG className="w-5 h-5" />,
    'Humble Store': <Tag className="w-5 h-5" />,
};


export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose, wishlist, onToggleWishlist }) => {
  const [selectedEdition, setSelectedEdition] = useState<GameEdition | null>(null);

  useEffect(() => {
    if (game.editions && game.editions.length > 0) {
      // prioritizează "standard" sau prima ediție disponibilă
      const standardEdition = game.editions.find(e => e.name.toLowerCase().includes('standard')) || game.editions[0];
      setSelectedEdition(standardEdition);
    }
  }, [game.editions]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const isInWishlist = wishlist.includes(game.id);

  const handleEditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const editionName = e.target.value;
    const newEdition = game.editions.find(ed => ed.name === editionName) || null;
    setSelectedEdition(newEdition);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition z-20 bg-black/50 rounded-full p-2 border border-white/10 hover:border-red-500 hover:bg-red-600">
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 md:h-96">
          <img src={game.screenshots[0]} alt={`${game.title} screenshot`} className="w-full h-full object-cover rounded-t-xl opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full bg-gradient-to-r from-black/80 to-transparent">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">{game.title}</h2>
            <p className="text-red-400 font-medium mt-1">{game.developer}{game.publisher ? ` | ${game.publisher}` : ''}</p>
          </div>
        </div>
        
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                    Despre Joc
                </h3>
                <p className="text-zinc-400 leading-relaxed text-base whitespace-pre-wrap">{game.description}</p>
            </div>
            
            {game.trailerUrl && (
              <div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                    Trailer
                </h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800">
                  <video
                    className="w-full h-full"
                    controls
                    poster={game.screenshots[0]}
                  >
                    <source src={game.trailerUrl.replace(/^http:/, 'https:')} type="video/mp4" />
                    Browser-ul tău nu suportă tag-ul video.
                  </video>
                </div>
              </div>
            )}

            <div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                    Istoric Prețuri
                </h3>
                <div className="h-64 bg-black/30 border border-zinc-800 p-4 rounded-lg">
                  <PriceHistoryChart data={game.priceHistory} />
                </div>
            </div>

            {game.screenshots.length > 1 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                    Galerie
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {game.screenshots.slice(1, 5).map((ss, index) => (
                    <img key={index} src={ss} alt={`Screenshot ${index+1}`} className="rounded border border-zinc-800 w-full h-auto object-cover hover:opacity-100 opacity-80 transition-opacity" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-black/40 border border-zinc-800 rounded-xl p-5 lg:sticky lg:top-4 backdrop-blur-sm">
                <button 
                  onClick={() => onToggleWishlist(game.id)}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-bold text-lg transition-all duration-200 border ${isInWishlist ? 'bg-zinc-900 border-red-900 text-red-500' : 'bg-red-600 border-red-500 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'}`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isInWishlist ? 'În Wishlist' : 'Adaugă în Wishlist'}
                </button>
                
                <div className="mt-6 border-t border-zinc-800 pt-4 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-zinc-500 uppercase tracking-wider text-xs">Data Lansării</span>
                        <span className="font-medium text-zinc-300">{new Date(game.releaseDate).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {game.metacriticScore > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-zinc-500 uppercase tracking-wider text-xs">Metascore</span>
                            <span className={`font-bold px-2 py-0.5 rounded text-black ${game.metacriticScore >= 80 ? 'bg-green-500' : game.metacriticScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>{game.metacriticScore}</span>
                        </div>
                    )}
                    
                    {game.platforms.length > 0 && (
                        <div>
                            <span className="font-medium text-zinc-500 uppercase tracking-wider text-xs mb-2 block">Platforme</span>
                            <div className="flex flex-wrap gap-2">
                                {game.platforms.map(p => (
                                    <span key={p.id} className="bg-zinc-800 text-zinc-300 text-xs font-semibold px-2 py-1 rounded border border-zinc-700">{p.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <h4 className="text-lg font-bold text-white mt-8 mb-4 border-t border-zinc-800 pt-4">Oferte Active</h4>
                
                {game.editions.length > 1 && (
                  <div className="mb-4">
                    <select
                      value={selectedEdition?.name || ''}
                      onChange={handleEditionChange}
                      className="w-full bg-black border border-zinc-700 rounded py-2 px-3 text-white focus:outline-none focus:border-red-600 text-sm"
                    >
                      {game.editions.map(edition => (
                        <option key={edition.name} value={edition.name}>{edition.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedEdition?.deals.map(deal => (
                     <a href={deal.dealUrl} target="_blank" rel="noopener noreferrer" key={deal.platform} className="block bg-zinc-900 hover:bg-zinc-800 p-3 rounded-lg transition-all border border-zinc-800 hover:border-red-500 group">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {platformIcons[deal.platform] || <Tag className="w-4 h-4 text-zinc-400"/>}
                            <span className="font-semibold text-zinc-200 group-hover:text-white">{deal.platform}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-red-500" />
                        </div>
                        <div className="text-right mt-1 flex items-baseline justify-end gap-2">
                          <span className="text-zinc-600 line-through text-xs">€{deal.normalPrice.toFixed(2)}</span>
                          <span className="text-lg font-bold text-red-500">€{deal.salePrice.toFixed(2)}</span>
                        </div>
                     </a>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
