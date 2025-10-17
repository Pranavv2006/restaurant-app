import axiosInstance from "../api/axiosConfig";

export interface RetrieveRestaurantsData {
  merchantId: number;
}

export interface RetrieveRestaurantsResponse {
  success: boolean;
  message?: string;
  data?: RestaurantData[];
  error?: string;
}
export interface WeeklyOrdersData {
  restaurantId: number;
}

export interface WeeklyOrdersItem {
  date: string;
  count: number;
}

export interface WeeklyOrdersResponse {
  success: boolean;
  data?: WeeklyOrdersItem[];
  message?: string;
  error?: string;
}

export interface PendingOrderItem {
  itemId: number;
  menuId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PendingOrderCustomer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  defaultAddress?: string;
}

export interface PendingOrderRestaurant {
  id: number;
  name: string;
  location: string;
}

export interface PendingOrder {
  orderId: number;
  status: string;
  total: number;
  deliveryFee: number;
  orderDate: string;
  deliveryAddress: string;
  customer: PendingOrderCustomer;
  restaurant: PendingOrderRestaurant;
  items: PendingOrderItem[];
}

export interface PendingOrdersResponse {
  success: boolean;
  data?: PendingOrder[];
  message?: string;
  error?: string;
}

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
    id: number;
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
  imageFile: File;
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
  category: string;
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
  imageFile?: File; // Add this field
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
    restaurants: {
      id: number;
      name: string;
      location: string;
      phone: string;
      cuisine: string;
      imageUrl: string; // Ensure imageUrl is included
    }[];
  };
  error?: string;
}

export interface RemoveRestaurantData {
  restaurantId: number;
}

export interface RemoveRestaurantResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    name: string;
    location: string;
    phone: string;
    cuisine: string;
    imageUrl?: string;
    merchantId: number;
  };
  error?: string;
}

export interface EditRestaurantData {
  restaurantId: number;
  name?: string;
  location?: string;
  phone?: string;
  cuisine?: string;
  imageUrl?: string;
}

export interface EditRestaurantResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    name: string;
    location: string;
    phone: string;
    cuisine: string;
    imageUrl?: string;
    merchantId: number;
  } | null;
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
    formData: FormData
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
        formData, // Pass FormData directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure correct content type
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

      const formData = new FormData();
      formData.append("restaurantId", addMenuItemData.restaurantId.toString());
      formData.append("name", addMenuItemData.name);
      formData.append("description", addMenuItemData.description);
      formData.append("price", addMenuItemData.price.toString());
      formData.append("image", addMenuItemData.imageFile);

      console.log("Adding menu item with FormData");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axiosInstance.post<AddMenuItemResponse>(
        `/Merchant/add-menu-item`,
        formData,
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

      const { menuItemId, ...bodyData } = editMenuItemData;

      const response = await axiosInstance.put<EditMenuItemResponse>(
        `/Merchant/edit-menu-item/${menuItemId}`,
        bodyData,
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

  WeeklyOrders: async (
    weeklyOrdersData: WeeklyOrdersData
  ): Promise<WeeklyOrdersResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          error: "No authentication token found. Please login again.",
        };
      }

      const { restaurantId } = weeklyOrdersData;

      const response = await axiosInstance.get<WeeklyOrdersResponse>(
        `/Merchant/weekly-orders/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("WeeklyOrders error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as WeeklyOrdersResponse;
      }

      return {
        success: false,
        error: error?.message || "Network error",
      };
    }
  },

  getMerchantRestaurants: async (
    merchantId: number
  ): Promise<RetrieveRestaurantsResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          error: "No authentication token found. Please login again.",
        };
      }

      const response = await axiosInstance.get<RetrieveRestaurantsResponse>(
        `/Merchant/retrieve-restaurant/${merchantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("getMerchantRestaurants error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as RetrieveRestaurantsResponse;
      }

      return {
        success: false,
        error: error?.message || "Network error",
      };
    }
  },

  removeRestaurant: async (
    removeRestaurantData: RemoveRestaurantData
  ): Promise<RemoveRestaurantResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          message: "No authentication token found. Please login again.",
          error: "No authentication token found. Please login again.",
        };
      }

      const response = await axiosInstance.delete<RemoveRestaurantResponse>(
        `/Merchant/remove-restaurant/${removeRestaurantData.restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("removeRestaurant error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return {
          success: false,
          error: "Authentication expired. Please login again.",
        };
      }

      if (error?.response?.data) {
        return error.response.data as RemoveRestaurantResponse;
      }

      return {
        success: false,
        error: error?.message || "Network error",
      };
    }
  },

  editRestaurant: async (
    editRestaurantData: EditRestaurantData
  ): Promise<EditRestaurantResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          message: "No authentication token found. Please login again.",
          error: "Authentication required",
        };
      }

      const response = await axiosInstance.put<EditRestaurantResponse>(
        "/Merchant/edit-restaurant",
        editRestaurantData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("editRestaurant error:", error);

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
        return error.response.data as EditRestaurantResponse;
      }

      return {
        success: false,
        message: "Failed to edit restaurant",
        error: error?.message || "Network error",
      };
    }
  },

  // Get Pending Orders for Restaurant
  getPendingOrders: async (
    restaurantId: number
  ): Promise<PendingOrdersResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          message: "Authentication token not found. Please login again.",
          error: "No authentication token",
        };
      }

      const response = await axiosInstance.get<PendingOrdersResponse>(
        `/Merchant/restaurants/${restaurantId}/pending-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("getPendingOrders error:", error);

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
        return error.response.data as PendingOrdersResponse;
      }

      return {
        success: false,
        message: "Failed to retrieve pending orders",
        error: error?.message || "Network error",
      };
    }
  },
};

export default merchantService;
