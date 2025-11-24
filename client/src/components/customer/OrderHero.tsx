import React, { useState, useEffect, useCallback, useRef } from "react";
import { searchRestaurants } from "../../services/HomeService";
import SearchBoard from "./SearchBoard";
import MenuBoard from "./MenuBoard";
import GooglePlacesAddressInput from "./GooglePlacesAddressInput";

const OrderHero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [displayedRestaurants, setDisplayedRestaurants] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const immediateSearchRef = useRef(false);
  
  const cuisines = [
    { name: "Indian", emoji: "🍛" },
    { name: "Italian", emoji: "🍕" },
    { name: "Korean", emoji: "🍜" },
    { name: "Chinese", emoji: "🥡" },
    { name: "Mexican", emoji: "🌮" },
    { name: "Japanese", emoji: "🍱" },
  ];
  
  const loadDefaultRestaurants = useCallback(async () => {
    setSearching(true);
    const res = await searchRestaurants({ query: "restaurant" }); 

    setSearching(false);
    if (res.success) {
      setResults(res.data ?? []);
    } else {
      setResults([]);
      console.log("Error loading default restaurants:", res.message);
    }
  }, []);
  
  useEffect(() => {
  if (!hasSearched) {
    loadDefaultRestaurants();
  }
}, [hasSearched, loadDefaultRestaurants]);

  const handleAddressChange = (address: string, lat?: number, lng?: number) => {
    setAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    
    if (lat !== undefined && lng !== undefined) {
      immediateSearchRef.current = true;
      performSearch(query, lat, lng);
      setTimeout(() => {
        immediateSearchRef.current = false;
      }, 200);
    }
  };

  const performSearch = useCallback(async (searchQuery: string, lat?: number, lng?: number) => {
    setSearching(true);
    
    const payload: {
      query?: string;
      latitude?: number;
      longitude?: number;
      radiusKm?: number;
    } = {};

    const isQuerySet = searchQuery.trim().length > 0;
    const isLocationSet = lat !== undefined && lng !== undefined;

    if (isQuerySet) {
      payload.query = searchQuery.trim();
    }
    if (isLocationSet) {
      payload.latitude = lat;
      payload.longitude = lng;
      payload.radiusKm = 15; 
    }

    if (!isQuerySet && !isLocationSet) {
      loadDefaultRestaurants();
      return;
    }

    try {
      const res = await searchRestaurants(payload);
      
      if (res.success) {
        setResults(res.data ?? []);
        setHasSearched(true);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [loadDefaultRestaurants]);

  useEffect(() => {
    const isLocationSet = latitude !== undefined && longitude !== undefined;
    const isQuerySet = query.trim().length > 0;
    
    if (!isQuerySet && !isLocationSet) {
      loadDefaultRestaurants();
      return;
    }
    
    if (immediateSearchRef.current) {
      return;
    }
    
    const timeout = setTimeout(() => {
      performSearch(query, latitude, longitude);
    }, isQuerySet ? 400 : 0);

    return () => clearTimeout(timeout);
  }, [query, performSearch, latitude, longitude, loadDefaultRestaurants]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRestaurantsUpdate = (restaurants: any[]) => {
    setDisplayedRestaurants(restaurants);
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/Images/restaurant-placeholder.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:3000/${
      imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
    }`;
  };

  const filteredRestaurants = displayedRestaurants.filter((restaurant) => 
    !selectedCuisine || restaurant.cuisine === selectedCuisine || restaurant.cuisineType === selectedCuisine
  );

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
        <div className="text-center">
          <h1
            className={`text-4xl sm:text-6xl font-bold text-gray-800 dark:text-neutral-200 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            From Restaurant to Home
          </h1>

          <h2
            className={`text-3xl mt-3 text-gray-800 dark:text-neutral-200 transition-all duration-1000 delay-300 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0 animate-pulse"
                : "opacity-0 translate-y-8"
            }`}
          >
            Faster than Fast
          </h2>

          <div
            className={`mt-7 sm:mt-12 mx-auto max-w-4xl relative transition-all duration-1000 delay-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="w-full lg:w-[30%] flex flex-col">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 text-left tracking-wide">
                    <span className="inline-flex items-center gap-2">
                    </span>
                  </label>
                  <div className="relative bg-white border-2 border-gray-200 rounded-xl shadow-md dark:bg-neutral-900 dark:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:border-green-400 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100 dark:focus-within:ring-green-900/30 flex-1 group">
                    <div className="flex items-center h-[56px] px-4">
                      <div className="flex items-center justify-center w-8 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <GooglePlacesAddressInput
                        value={address}
                        onChange={handleAddressChange}
                        placeholder="Location"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[70%] flex flex-col">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 text-left tracking-wide">
                    <span className="inline-flex items-center gap-2">
                    </span>
                  </label>
                  <div
                    className={`relative bg-white border-2 border-gray-200 rounded-xl shadow-md dark:bg-neutral-900 dark:border-neutral-700 transition-all duration-300 flex-1 ${
                      searchFocused
                        ? "shadow-lg border-violet-500 ring-4 ring-violet-100 dark:ring-violet-900/30"
                        : "hover:shadow-lg hover:border-violet-400"
                    }`}
                  >
                    <div className="flex items-center h-[56px] px-4">
                      <div className="flex items-center justify-center w-8 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="restaurant-search"
                        id="restaurant-search"
                        className="flex-1 h-full px-3 border-transparent bg-transparent rounded-xl focus:outline-none dark:text-neutral-200 dark:placeholder-neutral-400 transition-all duration-300 text-base"
                        placeholder="Search for restaurants, dishes, or cuisines..."
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      {searching && (
                        <div className="flex items-center justify-center w-8">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-200 border-t-violet-600"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {query && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 transition-all duration-300">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Searching for "{query}"
                  </span>
                )}
              </div>
            </div>

            <div
              className={`hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 rotate-0" : "opacity-0 rotate-12"
              }`}
            >
              <svg
                className="w-16 h-auto text-yellow-500 animate-bounce"
                width="121"
                height="135"
                viewBox="0 0 121 135"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              className={`hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32 transition-all duration-1000 delay-900 ${
                isVisible ? "opacity-100 -rotate-3" : "opacity-0 rotate-6"
              }`}
            >
              <svg
                className="w-40 h-auto text-green-500 hover:scale-110 transition-transform duration-500"
                width="347"
                height="188"
                viewBox="0 0 347 188"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>

          {displayedRestaurants.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <div className="flex flex-wrap justify-center gap-3">
                  {cuisines.map((cuisine) => (
                    <button
                      key={cuisine.name}
                      onClick={() => setSelectedCuisine(selectedCuisine === cuisine.name ? null : cuisine.name)}
                      className={`px-4 py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedCuisine === cuisine.name
                          ? "bg-red-500 text-white border-red-500 shadow-lg"
                          : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-600 hover:border-red-300 dark:hover:border-red-400"
                      }`}
                    >
                      <span className="mr-2">{cuisine.emoji}</span>
                      {cuisine.name}
                    </button>
                  ))}
                </div>
                {selectedCuisine && (
                  <div className="text-center mt-3">
                    <button
                      onClick={() => setSelectedCuisine(null)}
                      className="text-sm text-red-500 hover:text-red-700 underline transition-colors duration-200"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {filteredRestaurants.length > 0 && (
            <div>
              <MenuBoard
                restaurantIds={filteredRestaurants.map((restaurant) => restaurant.id)}
                onAddToCart={(item, quantity) => {
                  console.log("Added to cart:", item, "Quantity:", quantity);
                }}
              />
            </div>
          )}

          <SearchBoard
            results={results}
            getImageUrl={getImageUrl}
            searching={searching}
            query={query}
            hasSearched={hasSearched}
            googlePlacesCoords={
              latitude !== undefined && longitude !== undefined
                ? { latitude, longitude }
                : undefined
            }
            onRestaurantsUpdate={handleRestaurantsUpdate}
          />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-violet-400 rounded-full animate-bounce opacity-50"></div>
        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export default OrderHero;
