
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameDeal, GameDetails, SortOption, FilterOptions, Genre } from './types';
import { getDeals, getGameDetails, getGenres } from './services/gameService';
import { Header } from './components/Header';
import { GameGrid } from './components/GameGrid';
import { Filters } from './components/Filters';
import { GameDetailModal } from './components/GameDetailModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Pagination } from './components/Pagination';
import LiquidEther from './components/LiquidEther';

const DEALS_PER_PAGE = 25;
const CACHE_KEY = 'dealspy_data_cache_v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 de ore în milisecunde

const App: React.FC = () => {
  const [deals, setDeals] = useState<GameDeal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [wishlist, setWishlist] = useLocalStorage<number[]>('dealspy-wishlist', []);

  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    maxPrice: 100,
    minRating: 0,
    platforms: [],
    genres: [],
  });
  const [sortOption, setSortOption] = useState<SortOption>('deal_rating'); // de fapt implicit la logica recomandată de mai jos

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // verificăm dacă avem date în cache
        const cachedData = localStorage.getItem(CACHE_KEY);
        let shouldUseCache = false;

        if (cachedData) {
          try {
            const parsedCache = JSON.parse(cachedData);
            const now = Date.now();
            // verificăm dacă cache-ul este valid (mai nou de 24 ore)
            if (now - parsedCache.timestamp < CACHE_DURATION) {
              console.log("se folosesc datele din cache local");
              setDeals(parsedCache.deals);
              setAvailableGenres(parsedCache.genres);
              shouldUseCache = true;
            }
          } catch (e) {
            console.error("eroare la parsarea cache-ului", e);
          }
        }

        // dacă nu folosim cache-ul (expirat sau lipsă), luăm date noi
        if (!shouldUseCache) {
          console.log("cache expirat sau lipsă, se preiau date noi din api");
          const [fetchedDeals, fetchedGenres] = await Promise.all([
            getDeals(),
            getGenres()
          ]);
          
          setDeals(fetchedDeals);
          setAvailableGenres(fetchedGenres);

          // salvăm noile date în localstorage cu timestamp-ul curent
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              deals: fetchedDeals,
              genres: fetchedGenres
            }));
          } catch (e) {
            console.error("nu s-a putut salva în cache (posibil limită stocare)", e);
          }
        }

      } catch (error) {
        console.error("eșec la preluarea datelor inițiale:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectGame = useCallback(async (deal: GameDeal) => {
    try {
      const details = await getGameDetails(deal);
      setSelectedGame(details);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    } catch (error)
      {
      console.error("eșec la preluarea detaliilor jocului:", error);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedGame(null);
    document.body.style.overflow = 'auto';
  }, []);

  const toggleWishlist = useCallback((gameId: number) => {
    setWishlist(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId) 
        : [...prev, gameId]
    );
  }, [setWishlist]);
  
  const handleFilterChange = useCallback((newFilters: FilterOptions | ((prev: FilterOptions) => FilterOptions)) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setCurrentPage(1);
    setSortOption(newSort);
  }, []);
  
  const handleSearch = useCallback((term: string) => {
    setCurrentPage(1);
    setFilters(f => ({ ...f, searchTerm: term }));
  }, []);

  const filteredAndSortedDeals = useMemo(() => {
    return deals
      .filter(deal => {
        const searchTermMatch = deal.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const priceMatch = deal.salePrice <= filters.maxPrice;
        const ratingMatch = deal.metacriticScore >= filters.minRating;
        const platformMatch = filters.platforms.length === 0 || filters.platforms.includes(deal.platform);
        // notă: filtrarea după gen pe lista principală este momentan dezactivată pentru performanță deoarece nu mai preluăm genurile per element
        // păstrăm logica pentru scalabilitate viitoare dacă adăugăm preluare în masă a genurilor
        const genreMatch = true; 
                           
        return searchTermMatch && priceMatch && ratingMatch && platformMatch && genreMatch;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price_asc':
            return a.salePrice - b.salePrice;
          case 'price_desc':
            return b.salePrice - a.salePrice;
          case 'savings':
            return b.savings - a.savings;
          case 'rating':
            return b.metacriticScore - b.metacriticScore;
          case 'title':
            return a.title.localeCompare(b.title);
          case 'deal_rating':
          default:
            // algoritm personalizat "recomandate/aaa"
            // 1. este un joc "full price" (aprox > 30 eur preț normal)? acordă bonus uriaș.
            const aIsAAA = a.normalPrice > 30 ? 1000 : 0;
            const bIsAAA = b.normalPrice > 30 ? 1000 : 0;
            
            // 2. pondere scor metacritic
            const aScore = aIsAAA + (a.metacriticScore * 2);
            const bScore = bIsAAA + (b.metacriticScore * 2);

            // 3. rezervă la rating ofertă/economii
            return bScore - aScore || parseFloat(b.dealRating) - parseFloat(a.dealRating);
        }
      });
  }, [deals, filters, sortOption]);

  const uniquePlatforms = useMemo(() => {
    const platformSet = new Set(deals.map(deal => deal.platform));
    return Array.from(platformSet);
  }, [deals]);

  const totalPages = Math.ceil(filteredAndSortedDeals.length / DEALS_PER_PAGE);
  
  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * DEALS_PER_PAGE;
    return filteredAndSortedDeals.slice(startIndex, startIndex + DEALS_PER_PAGE);
  }, [filteredAndSortedDeals, currentPage]);


  return (
    <div className="min-h-screen bg-black font-sans text-zinc-100">
      <LiquidEther
        colors={['#2A0404', '#450a0a', '#000000']}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      />
      
      <div className="relative z-10">
        <Header onSearch={handleSearch} />
        
        <main className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 text-white tracking-tight drop-shadow-2xl">
              Găsește-ți Următorul <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Joc Favorit</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
              Urmărește instantaneu oferte din sute de magazine digitale.
            </p>
          </div>

          <Filters 
            sortOption={sortOption}
            onSortChange={handleSortChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            availablePlatforms={uniquePlatforms}
            availableGenres={availableGenres}
          />
          
          <GameGrid 
            deals={paginatedDeals}
            isLoading={isLoading}
            onSelectGame={handleSelectGame}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />

          {!isLoading && totalPages > 1 && (
             <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
             />
          )}
        </main>
      </div>

      {isModalOpen && selectedGame && (
        <GameDetailModal 
          game={selectedGame}
          onClose={handleCloseModal}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
      )}
    </div>
  );
};

export default App;
