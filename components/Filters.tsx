
import React, { useState, useRef, useEffect } from 'react';
import { FilterOptions, SortOption, Genre } from '../types';
import { ChevronDown } from './icons';

interface FiltersProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availablePlatforms: string[];
  availableGenres: Genre[];
}

const sortOptions: { value: SortOption, label: string }[] = [
  { value: 'deal_rating', label: 'Cea mai Bună Ofertă' },
  { value: 'savings', label: 'Cele mai Mari Reduceri' },
  { value: 'rating', label: 'Cel mai Mare Rating' },
  { value: 'price_asc', label: 'Preț: Mic la Mare' },
  { value: 'price_desc', label: 'Preț: Mare la Mic' },
  { value: 'title', label: 'Titlu' },
];

interface CustomSelectProps {
  label?: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: any) => void;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(opt => opt.value === value)?.label || options[0]?.label || 'Selectează';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
       {label && <span className="text-zinc-400 font-medium whitespace-nowrap mr-3 hidden sm:inline-block text-sm uppercase tracking-wide">{label}</span>}
       <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto bg-black/60 border border-zinc-800 rounded-md py-2 px-3 text-zinc-100 hover:border-red-900/50 focus:outline-none focus:ring-1 focus:ring-red-600 flex items-center justify-between gap-2 min-w-[160px] transition-all"
       >
         <span className="truncate">{selectedLabel}</span>
         <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
       </button>

       {isOpen && (
         <div className="absolute top-full mt-1 w-full sm:w-[220px] bg-black border border-zinc-800 rounded-md shadow-xl shadow-red-900/10 z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-black">
            {options.map(option => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer transition-colors text-sm border-b border-zinc-900/50 last:border-0
                  ${option.value === value 
                    ? 'bg-red-950/30 text-red-400 font-medium' 
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
              >
                {option.label}
              </div>
            ))}
         </div>
       )}
    </div>
  );
};


export const Filters: React.FC<FiltersProps> = ({ sortOption, onSortChange, filters, onFilterChange, availablePlatforms, availableGenres }) => {
  
  const handlePlatformChange = (value: string) => {
    onFilterChange({ ...filters, platforms: value ? [value] : [] });
  };

  const handleGenreChange = (value: string) => {
    onFilterChange({ ...filters, genres: value ? [value] : [] });
  };

  const platformOptions = [
      { value: '', label: 'Toate Platformele' },
      ...availablePlatforms.map(p => ({ value: p, label: p }))
  ];

  const genreOptions = [
      { value: '', label: 'Toate Categoriile' },
      ...availableGenres.map(g => ({ value: g.slug, label: g.name }))
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md border border-zinc-800/50 rounded-lg p-5 mb-8 lg:sticky lg:top-[72px] z-40 shadow-lg">
      <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-4">
        
        {/* sortează după */}
        <CustomSelect 
          label="Sortează:"
          value={sortOption}
          options={sortOptions}
          onChange={(val) => onSortChange(val as SortOption)}
        />

        {/* categorii */}
        {availableGenres.length > 0 && (
          <CustomSelect 
            label="Categorie:"
            value={filters.genres[0] || ''}
            options={genreOptions}
            onChange={handleGenreChange}
          />
        )}

        {/* platforme */}
        <CustomSelect 
            label="Platformă:"
            value={filters.platforms[0] || ''}
            options={platformOptions}
            onChange={handlePlatformChange}
        />

        {/* preț maxim */}
        <div className="flex items-center gap-3 flex-grow min-w-[200px] sm:min-w-[250px] bg-black/20 p-2 rounded-lg border border-transparent hover:border-zinc-800 transition-colors">
          <label htmlFor="max-price" className="text-zinc-400 font-medium whitespace-nowrap text-sm uppercase tracking-wide">Preț Maxim:</label>
          <div className="flex items-center gap-3 w-full">
            <input
              type="range"
              id="max-price"
              min="0"
              max="100"
              step="1"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <span className="text-red-500 font-bold w-16 text-right font-mono">€{filters.maxPrice.toFixed(0)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
