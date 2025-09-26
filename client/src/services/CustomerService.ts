import axiosInstance from "../api/axiosConfig";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface RestaurantDetails {
  restaurantName: string;
  menu: MenuItem[];
}

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

export interface SelectRestaurantResponse {
  success: boolean;
  data?: RestaurantDetails;
  message?: string;
  error?: string;
}

export const selectRestaurants = async (
  payload: SelectRestaurantData
): Promise<SelectRestaurantResponse> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return {
        success: false,
        error: "No authentication token found. Please login again",
      };
    }

    const url = `/Customer/select-restaurant/${payload.restaurantId}`;

    const response = await axiosInstance.get<SelectRestaurantResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error calling selectRestaurants API:", error);
    return {
      success: false,
      data: undefined,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const searchRestaurants = async (
  payload: SearchRestaurantData
): Promise<SearchRestaurantResponse> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return {
        success: false,
        error: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.get<SearchRestaurantResponse>(
      "/Customer/search-restaurants",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { q: payload.query },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling searchRestaurants API:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};
