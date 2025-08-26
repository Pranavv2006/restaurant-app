import axiosInstance from "../api/axiosConfig";

export interface CheckRestaurantData {
  merchantId: number;
}

export interface CheckRestaurantResponse {
  success: boolean;
  hasRestaurant?: boolean;
  data?: CheckRestaurantData | null;
  error?: string;
}

export interface RestaurantData {
  id: number;
  name: string;
  location: string;
  phone: string;
  cuisine: string;
}

export interface CreateRestaurantData {
  merchantId: number;
  name: string;
  location: string;
  phone: string;
  cuisine: string;
}

export interface CreateRestaurantResponse {
  success: boolean;
  message: string;
  data?: {
    restaurant: RestaurantData;
  };
  error?: string;
}

export interface MerchantProfileData {
  merchantId: number;
}

export interface MerchantProfileResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    restaurants: RestaurantData[];
  };
  error?: string;
}

const merchantService = {
  checkRestaurant: async (
    checkRestaurantData: CheckRestaurantData
  ): Promise<CheckRestaurantResponse> => {
    try {
      const response = await axiosInstance.post<CheckRestaurantResponse>(
        "/Merchant/check-restaurant",
        checkRestaurantData
      );
      return response.data;
    } catch (error: any) {
      console.error("checkRestaurant error:", error);
      if (error?.response?.data)
        return error.response.data as CheckRestaurantResponse;
      return { success: false, error: error?.message || "Network error" };
    }
  },

  createRestaurant: async (
    restaurantData: CreateRestaurantData
  ): Promise<CreateRestaurantResponse> => {
    try {
      const response = await axiosInstance.post<CreateRestaurantResponse>(
        "/Merchant/create-restaurant",
        restaurantData
      );
      return response.data;
    } catch (error: any) {
      console.error("createRestaurant error:", error);
      if (error?.response?.data) {
        return error.response.data as CreateRestaurantResponse;
      }
      return {
        success: false,
        message: "Failed to create restaurant",
        error: error?.message || "Network error",
      };
    }
  },

  getMerchantProfile: async (
    merchantId: MerchantProfileData
  ): Promise<MerchantProfileResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.get<MerchantProfileResponse>(
        `/Merchant/merchant-profile/${merchantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("getMerchantProfile error:", error);
      if (error?.response?.data) {
        return error.response.data as MerchantProfileResponse;
      }
      return {
        success: false,
        message: "Failed to get profile",
        error: error?.message || "Network error",
      };
    }
  },
};

export default merchantService;
