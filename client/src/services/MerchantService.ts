import axiosInstance from "../api/axiosConfig";

export interface EditMenuItemData {
  menuItemId: number;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

export interface EditMenuItemResponse {
  success: boolean;
  data?: {
    menuItemId: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
  error?: string;
}

export interface AddMenuItemData {
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface RemoveMenuItemData {
  menuItemId: number;
}

export interface RemoveMenuItemResponse {
  success: boolean;
  message?: string;
  data?: {
    deletedMenu: {
      id: number;
      name: string;
      restaurantId: number;
    };
  };
  error?: string;
}

export interface AddMenuItemResponse {
  success: boolean;
  message?: string;
  data?: {
    menuItem: {
      id: number;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
    };
  };
  error?: string;
}
export interface MenuItemData {
  restaurantId: number;
}

export interface MenuItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface RetrieveMenuResponse {
  success: boolean;
  data?: MenuItemResponse[];
  error?: string;
}

export interface CheckRestaurantData {
  merchantId: number;
}

export interface CheckRestaurantResponse {
  success: boolean;
  hasRestaurant?: boolean;
  data?: {
    id: number;
    name: string;
    location: string;
    phone: string;
    cuisine: string;
    merchant?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  } | null;
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
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          error: "No authentication token found. Please login again.",
        };
      }

      const response = await axiosInstance.post<CheckRestaurantResponse>(
        "/Merchant/check-restaurant",
        checkRestaurantData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("checkRestaurant error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as CheckRestaurantResponse;
      }

      return { success: false, error: error?.message || "Network error" };
    }
  },

  createRestaurant: async (
    restaurantData: CreateRestaurantData
  ): Promise<CreateRestaurantResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          message: "No authentication token found. Please login again.",
          error: "Authentication required",
        };
      }

      const response = await axiosInstance.post<CreateRestaurantResponse>(
        "/Merchant/create-restaurant",
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("createRestaurant error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          message: "Authentication expired. Please login again.",
          error: "Authentication expired",
        };
      }

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

      if (!token) {
        return {
          success: false,
          message: "No authentication token found. Please login again.",
          error: "Authentication required",
        };
      }

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

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          message: "Authentication expired. Please login again.",
          error: "Authentication expired",
        };
      }

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

  retrieveMenu: async (
    retrieveMenuData: MenuItemData
  ): Promise<RetrieveMenuResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          error: "No authentication token found. Please login again.",
        };
      }

      const response = await axiosInstance.get<RetrieveMenuResponse>(
        `/Merchant/retrieve-menu?restaurantId=${retrieveMenuData.restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("retrieveMenu error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as RetrieveMenuResponse;
      }

      return {
        success: false,
        error: error?.message || "Network error",
      };
    }
  },

  addMenuItem: async (
    addMenuItemData: AddMenuItemData
  ): Promise<AddMenuItemResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          error: "No authentication token found. Please login again.",
        };
      }

      console.log("Adding menu item:", addMenuItemData);

      const response = await axiosInstance.post<AddMenuItemResponse>(
        "/Merchant/add-menu-item",
        addMenuItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("addMenuItem error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as AddMenuItemResponse;
      }

      return {
        success: false,
        error: error?.message || "Network error",
      };
    }
  },

  removeMenuItem: async (
    removeMenuItemData: RemoveMenuItemData
  ): Promise<RemoveMenuItemResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          error: "No authentication token found. Please login again.",
        };
      }

      const response = await axiosInstance.delete<RemoveMenuItemResponse>(
        `/Merchant/remove-menu-item/${removeMenuItemData.menuItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("removeMenuItem error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as RemoveMenuItemResponse;
      }

      return {
        success: false,
        error: error?.message || "Network error",
      };
    }
  },

  editMenuItem: async (
    editMenuItemData: EditMenuItemData
  ): Promise<EditMenuItemResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          error: "No authentication token found. Please login again.",
        };
      }

      const response = await axiosInstance.put<EditMenuItemResponse>(
        `/Merchant/edit-menu-item/${editMenuItemData.menuItemId}`,
        editMenuItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("editMenuItem error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as EditMenuItemResponse;
      }

      return {
        success: false,
        error: error?.message || "Network error",
      };
    }
  },
};

export default merchantService;
