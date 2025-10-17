import axiosInstance from "../api/axiosConfig";

export interface SearchRestaurantData {
  query?: string; 
  latitude?: number; 
  longitude?: number;
  radiusKm?: number;
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
  data?: any[];   
  message?: string;
  error?: string;
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
): Promise<ProximitySearchResponse> => {
  try {
    const queryParams = new URLSearchParams();

    // 1. Append Text Query if present
    if (payload.query) {
      queryParams.append("query", payload.query);
    }
    
    // 2. Append Location Data if both latitude and longitude are present
    if (payload.latitude !== undefined && payload.longitude !== undefined) {
      queryParams.append("latitude", payload.latitude.toString());
      queryParams.append("longitude", payload.longitude.toString());
      
      // Use provided radius or default to 10km
      const radius = payload.radiusKm !== undefined ? payload.radiusKm : 10;
      queryParams.append("radiusKm", radius.toString());
      
      // Use proximity search endpoint when coordinates are available
      const endpoint = `/home/proximity-search?${queryParams.toString()}`;
      const response = await axiosInstance.get<ProximitySearchResponse>(endpoint);
      return response.data;
    } else if (payload.query) {
      // Use text search endpoint when only query is provided (no coordinates)
      const endpoint = `/home/search-restaurants?q=${encodeURIComponent(payload.query)}`;
      const response = await axiosInstance.get<ProximitySearchResponse>(endpoint);
      return response.data;
    } else {
      // Default case: return all restaurants (for initial load) - use a working endpoint
      const endpoint = `/home/search-restaurants`;
      const response = await axiosInstance.get<ProximitySearchResponse>(endpoint);
      return response.data;
    }
  } catch (error: any) {
    console.error("Error calling home searchRestaurants API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

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

export const selectRestaurant = async (
  payload: SelectRestaurantData
): Promise<SelectRestaurantResponse> => {
  try {
    const { restaurantId } = payload;

    const response = await axiosInstance.get<SelectRestaurantResponse>(
      `/home/restaurants/select-restaurant/${restaurantId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling home selectRestaurant API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};