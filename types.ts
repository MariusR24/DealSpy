
export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface GameDeal {
  id: number;
  title: string;
  coverImage: string;
  thumb: string; // thumbnail original din api ca rezervă
  normalPrice: number;
  salePrice: number;
  savings: number;
  metacriticScore: number;
  steamRatingPercent: number;
  platform: string;
  dealRating: string;
  expiry: number; // timestamp
  steamAppID: string | null;
  genres: Genre[];
}

export interface PriceHistoryPoint {
  date: number; // timestamp
  price: number;
  platform: string;
}

export interface GamePlatform {
  id: number;
  name: string;
  slug: string;
}

export interface GameEdition {
  name: string;
  deals: {
    platform: string;
    normalPrice: number;
    salePrice: number;
    dealUrl: string;
  }[];
}


export interface GameDetails {
  id: number;
  title: string;
  coverImage: string;
  description: string;
  screenshots: string[];
  trailerUrl?: string;
  genres: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  metacriticScore: number;
  steamRatingPercent: number;
  priceHistory: PriceHistoryPoint[];
  editions: GameEdition[];
  platforms: GamePlatform[];
  rawgRating: number;
  rawgRatingCount: number;
}

export type SortOption = 'deal_rating' | 'savings' | 'price_asc' | 'price_desc' | 'rating' | 'title';

export interface FilterOptions {
  searchTerm: string;
  maxPrice: number;
  minRating: number;
  platforms: string[];
  genres: string[];
}
