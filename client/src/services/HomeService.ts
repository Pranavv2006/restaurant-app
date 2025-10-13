import axiosInstance from "../api/axiosConfig";

// Interfaces for Home/Public services
export interface SearchRestaurantData {
  query: string;
}

export interface SearchRestaurantResponse {
  success: boolean;
  data?: any[];
  message?: string;
  error?: string;
}

export interface SelectRestaurantData {
  restaurantId: number;
}

export interface RestaurantDetails {
  restaurantName: string;
  menu: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface SelectRestaurantResponse {
  success: boolean;
  data?: RestaurantDetails;
  message?: string;
  error?: string;
}

export interface ProximitySearchData {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export interface ProximityRestaurant {
  id: number;
  name: string;
  location?: string;
  cuisine?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  distanceKm: number;
}

export interface ProximitySearchResponse {
  success: boolean;
  data?: ProximityRestaurant[];
  message?: string;
}

export interface NearbyRestaurantsData {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export interface NearbyRestaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  imageUrl: string;
  distanceKm: number;
}

export interface NearbyRestaurantsResponse {
  success: boolean;
  data?: NearbyRestaurant[];
  message?: string;
}

// FIX: Functions must be defined and exported using 'export const functionName = async (...'
export const searchRestaurants = async (
    payload: SearchRestaurantData
  ): Promise<SearchRestaurantResponse> => {
    try {
      const response = await axiosInstance.get<SearchRestaurantResponse>(
        "/home/search-restaurants",
        {
          params: { q: payload.query },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error calling home searchRestaurants API:", error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  }; // FIX: Added closing curly brace and semicolon here

// Get restaurant details and menu
export const selectRestaurant = async ( // FIX: Added 'export const'
    payload: SelectRestaurantData
  ): Promise<SelectRestaurantResponse> => {
    try {
      const response = await axiosInstance.get<SelectRestaurantResponse>(
        `/home/select-restaurant/${payload.restaurantId}`
      );

      return response.data;
    } catch (error: any) {
      console.error("Error calling home selectRestaurant API:", error);
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  }; // FIX: Added closing curly brace and semicolon here

// Search restaurants by proximity/location
export const getProximityRestaurants = async ( // FIX: Added 'export const'
    payload: ProximitySearchData
  ): Promise<ProximitySearchResponse> => {
    try {
      const { latitude, longitude, radiusKm } = payload;
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });

      if (radiusKm) {
        queryParams.append("radiusKm", radiusKm.toString());
      }

      const response = await axiosInstance.get<ProximitySearchResponse>(
        // It's cleaner to pass queryParams as an object to axios's `params` key
        // but the current implementation with URLSearchParams works if you pass the string directly.
        // I'll stick to the original structure but note the cleaner alternative.
        `/home/proximity-search?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error("Error calling home getProximityRestaurants API:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  }; // FIX: Added closing curly brace and semicolon here

  // Get nearby restaurants by location
// FIX: The original had 'export const' at the beginning of this function definition, which was outside the previous function block and caused a general syntax error. It should be defined as a standalone exported function.
export const getNearbyRestaurants = async (
    payload: NearbyRestaurantsData
  ): Promise<NearbyRestaurantsResponse> => {
    try {
      const { latitude, longitude, radiusKm } = payload;
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });

      if (radiusKm) {
        queryParams.append("radiusKm", radiusKm.toString());
      }

      const response = await axiosInstance.get<NearbyRestaurantsResponse>(
        `/home/restaurants/nearby?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error("Error calling home getNearbyRestaurants API:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  };