
import { GameDeal, GameDetails, GamePlatform, Genre, GameEdition } from '../types';

// cache pentru promisiunea hărții magazinelor
let storeMapPromise: Promise<Map<string, string>> | null = null;

const CHEAPSHARK_API_BASE = 'https://www.cheapshark.com/api/1.0';
const RAWG_API_KEY = 'b2e159fbe5d840be92f3256fa6e2779b';
const RAWG_API_BASE = 'https://api.rawg.io/api';

// configurare pentru context european
const EXCHANGE_RATE = 0.92; // conversie aproximativă din usd în eur
// id-uri de magazine cunoscute a fi fizice-sua sau blocate regional
const EXCLUDED_STORE_IDS = ['4', '6', '12', '17', '18']; 

const getStoreMap = (): Promise<Map<string, string>> => {
  if (!storeMapPromise) {
    storeMapPromise = fetch(`${CHEAPSHARK_API_BASE}/stores`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch stores from CheapShark');
        }
        return res.json();
      })
      .then(storesData => {
        const map = new Map<string, string>();
        if (Array.isArray(storesData)) {
          for (const store of storesData) {
            if (store.isActive) {
              map.set(store.storeID, store.storeName);
            }
          }
        }
        return map;
      })
      .catch(error => {
        console.error("Error fetching stores, falling back to a basic map:", error);
        return new Map([
          ['1', 'Steam'],
          ['7', 'GOG'],
          ['11', 'Humble Store'],
          ['25', 'Epic Games'],
        ]);
      });
  }
  return storeMapPromise;
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(`${RAWG_API_BASE}/genres?key=${RAWG_API_KEY}`);
    if (!response.ok) {
      // nu aruncăm eroare critică pentru genuri, returnăm gol
      console.warn('RAWG genres fetch failed, continuing without genres');
      return [];
    }
    const data = await response.json();
    return data.results.map((genre: any) => ({
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
    }));
  } catch (error) {
    console.error("Error in getGenres (RAWG might be blocked or quota exceeded):", error);
    return [];
  }
};

export const getDeals = async (): Promise<GameDeal[]> => {
  try {
    const storeMap = await getStoreMap();
    const getStoreName = (storeID: string) => storeMap.get(storeID) || 'Unknown Store';

    // AM REDUS numărul de pagini la 12 pentru stabilitate. 
    // 25 pagini simultan declanșează "Rate Limit" sau erori de rețea.
    const pageCount = 12; 
    const pagePromises = [];
    
    for (let i = 0; i < pageCount; i++) {
      // Adăugăm fetch-ul în listă. Dacă unul eșuează, Promise.allSettled îl va prinde.
      pagePromises.push(
        fetch(`${CHEAPSHARK_API_BASE}/deals?pageNumber=${i}&pageSize=60&onSale=1`)
      );
    }

    // Folosim allSettled în loc de all. Astfel, dacă o pagină dă eroare (Failed to fetch), 
    // celelalte pagini sunt procesate și nu crapă toată aplicația.
    const results = await Promise.allSettled(pagePromises);
    
    const validResponses = results
      .filter((r): r is PromiseFulfilledResult<Response> => r.status === 'fulfilled' && r.value.ok)
      .map(r => r.value);

    if (validResponses.length === 0) {
        throw new Error("Toate cererile către API au eșuat. Verifică conexiunea sau dezactivează AdBlock.");
    }

    const dealsDataArrays = await Promise.all(validResponses.map(res => res.json()));
    const allDealsData: any[] = dealsDataArrays.flat();

    // cuvinte cheie pentru a filtra dlc-uri și conținut minor
    // 'pass' a fost eliminat pentru a evita filtrarea cuvintelor valide (ex: compass, passing)
    const nonBaseGameKeywords = ['dlc', 'season pass', 'expansion', 'bundle', 'pack', 'soundtrack', 'artbook', 'currency', 'points', 'coin', 'credit'];
    
    // hartă deduplicare
    const bestDealsMap = new Map<string, any>();
    const normalizeTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const deal of allDealsData) {
      // validare de bază
      if (!deal.gameID || parseFloat(deal.savings) <= 0) continue;
      if (EXCLUDED_STORE_IDS.includes(deal.storeID)) continue;

      const titleLower = deal.title.toLowerCase();
      if (nonBaseGameKeywords.some(keyword => titleLower.includes(keyword))) continue;

      // păstrează doar cea mai bună ofertă pentru un titlu specific
      const normalizedTitle = normalizeTitle(deal.title);
      const existingDeal = bestDealsMap.get(normalizedTitle);
      
      // logică: preferă scor metacritic mai mare întâi, apoi rating ofertă mai bun
      if (!existingDeal) {
         bestDealsMap.set(normalizedTitle, deal);
      } else {
         // dacă avem deja acest joc, păstrează-l pe cel cu rating sau preț mai bun
         if (parseFloat(deal.dealRating) > parseFloat(existingDeal.dealRating)) {
            bestDealsMap.set(normalizedTitle, deal);
         }
      }
    }
    
    const uniqueBestDeals = Array.from(bestDealsMap.values());

    // mapare la structura internă fără apeluri api externe per element (optimizare viteză)
    const gameDeals: GameDeal[] = uniqueBestDeals.map((deal) => {
        // logică imagine calitate înaltă:
        // cheapshark oferă thumbnail-uri steam. putem ghici url-ul header steam hi-res.
        let coverImage = deal.thumb;
        if (deal.steamAppID) {
            coverImage = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${deal.steamAppID}/header.jpg`;
        } else {
            // rezervă: încearcă înlocuirea modelelor comune de thumbnail pentru rezoluție mai mare
            coverImage = deal.thumb.replace('capsule_sm_120', 'capsule_616x353'); 
        }

        return {
          id: parseInt(deal.gameID, 10),
          title: deal.title,
          coverImage: coverImage,
          thumb: deal.thumb, // thumbnail original sigur
          normalPrice: parseFloat(deal.normalPrice) * EXCHANGE_RATE,
          salePrice: parseFloat(deal.salePrice) * EXCHANGE_RATE,
          savings: parseFloat(deal.savings),
          metacriticScore: parseInt(deal.metacriticScore, 10) || 0,
          steamRatingPercent: parseInt(deal.steamRatingPercent, 10) || 0,
          platform: getStoreName(deal.storeID),
          dealRating: deal.dealRating,
          expiry: deal.expiry * 1000,
          steamAppID: deal.steamAppID,
          genres: [], // nu prelua genuri aici pentru a salva performanța
        };
      });

    return gameDeals;

  } catch (error) {
    console.error("Error in getDeals:", error);
    // Dacă totul eșuează, aruncăm eroarea mai departe pentru a fi afișată în UI
    throw error;
  }
};

const getEditionName = (title: string, baseTitle: string): string => {
    const titleLower = title.toLowerCase();
    const baseTitleLower = baseTitle.toLowerCase();
    const editionKeywords = ['deluxe edition', 'gold edition', 'ultimate edition', 'complete edition', 'goty', 'game of the year'];

    for (const keyword of editionKeywords) {
        if (titleLower.includes(keyword)) {
            return keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
    }
    if (titleLower.replace(/[^a-z0-9]/gi, '') === baseTitleLower.replace(/[^a-z0-9]/gi, '')) return 'Standard Edition';
    return title.substring(baseTitle.length).replace(/[-:]/, '').trim() || 'Standard Edition';
};

export const getGameDetails = async (deal: GameDeal): Promise<GameDetails> => {
  try {
    const storeMap = await getStoreMap();
    const getStoreName = (storeID: string) => storeMap.get(storeID) || 'Unknown Store';

    // folosește căutarea de oferte cheapshark
    const cheapSharkAllDealsPromise = fetch(`${CHEAPSHARK_API_BASE}/deals?title=${encodeURIComponent(deal.title)}`)
      .then(res => res.ok ? res.json() : []);

    const cheapSharkGameInfoPromise = fetch(`${CHEAPSHARK_API_BASE}/games?id=${deal.id}`)
      .then(res => res.ok ? res.json() : {}) as Promise<any>;

    // preia rawg doar pentru vizualizare detalii (o singură cerere)
    const rawgPromise = fetch(`${RAWG_API_BASE}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(deal.title)}&page_size=1`)
      .then(res => res.ok ? res.json() : {})
      .then(async (searchData: any) => {
        if (searchData.results && searchData.results.length > 0) {
          const gameId = searchData.results[0].id;
          const [details, movies, screenshots] = await Promise.all([
            fetch(`${RAWG_API_BASE}/games/${gameId}?key=${RAWG_API_KEY}`).then(r => r.json()),
            fetch(`${RAWG_API_BASE}/games/${gameId}/movies?key=${RAWG_API_KEY}`).then(r => r.json()).catch(() => ({results:[]})),
            fetch(`${RAWG_API_BASE}/games/${gameId}/screenshots?key=${RAWG_API_KEY}`).then(r => r.json()).catch(() => ({results:[]}))
          ]);
          return { details, movies, screenshots };
        }
        return null;
      });

    const [allDealsData, gameInfoData, rawgData] = await Promise.all([cheapSharkAllDealsPromise, cheapSharkGameInfoPromise, rawgPromise]);
    
    // procesează ediții
    const editionsMap = new Map<string, GameEdition>();
    if (Array.isArray(allDealsData)) {
      for (const d of allDealsData) {
        if (EXCLUDED_STORE_IDS.includes(d.storeID)) continue;
        const editionName = getEditionName(d.title, deal.title);
        if (!editionsMap.has(editionName)) {
          editionsMap.set(editionName, { name: editionName, deals: [] });
        }
        editionsMap.get(editionName)!.deals.push({
          platform: getStoreName(d.storeID),
          normalPrice: parseFloat(d.normalPrice) * EXCHANGE_RATE,
          salePrice: parseFloat(d.salePrice) * EXCHANGE_RATE,
          dealUrl: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`,
        });
      }
    }
    
    // construiește obiect detalii
    let description = "Descriere indisponibilă.";
    let screenshots = deal.coverImage ? [deal.coverImage] : [];
    let trailerUrl: string | undefined;
    let genres: string[] = [];
    let developer = '';
    let publisher = '';
    let releaseDate = new Date().toISOString();
    let platforms: GamePlatform[] = [];
    let rawgRating = 0;
    let rawgRatingCount = 0;

    if (rawgData && rawgData.details) {
       const d = rawgData.details;
       description = d.description_raw || description;
       developer = d.developers?.map((x:any) => x.name).join(', ') || '';
       publisher = d.publishers?.map((x:any) => x.name).join(', ') || '';
       releaseDate = d.released || releaseDate;
       genres = d.genres?.map((x:any) => x.name) || [];
       platforms = d.platforms?.map((x:any) => x.platform) || [];
       rawgRating = d.rating || 0;
       rawgRatingCount = d.ratings_count || 0;
       
       if (rawgData.movies?.results?.[0]) {
           trailerUrl = rawgData.movies.results[0].data?.max || rawgData.movies.results[0].data?.['480'];
       }
       if (d.background_image) screenshots = [d.background_image];
       if (rawgData.screenshots?.results) {
           screenshots.push(...rawgData.screenshots.results.map((s:any) => s.image));
       }
       screenshots = [...new Set(screenshots)];
    }

    // istoric prețuri
    const priceHistory = [];
    if (gameInfoData.cheapestPriceEver) {
        priceHistory.push({
            date: gameInfoData.cheapestPriceEver.date * 1000,
            price: parseFloat(gameInfoData.cheapestPriceEver.price) * EXCHANGE_RATE,
            platform: "Minim Istoric"
        });
    }
    priceHistory.push({ date: Date.now(), price: deal.salePrice, platform: "Curent" });

    return {
      id: deal.id,
      title: gameInfoData.info?.title || deal.title,
      coverImage: deal.coverImage,
      description,
      screenshots,
      trailerUrl,
      genres,
      developer,
      publisher,
      releaseDate,
      platforms,
      rawgRating,
      rawgRatingCount,
      metacriticScore: rawgData?.details?.metacritic || deal.metacriticScore,
      steamRatingPercent: deal.steamRatingPercent,
      priceHistory,
      editions: Array.from(editionsMap.values())
    };

  } catch (error) {
    console.error("Error in getGameDetails:", error);
    throw error;
  }
};
