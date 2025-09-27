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

export interface AddToCartData {
  customerId: number;
  menuId: number;
  quantity: number;
}

export interface AddToCartResponse {
  success: boolean;
  data?: any;
  message?: string;
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

// Retrieve Cart
export interface RetrieveCartResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const addToCart = async (
  payload: AddToCartData
): Promise<AddToCartResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.post<AddToCartResponse>(
      "/Customer/cart/add",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling addToCart API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

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

export const retrieveCart = async (
  customerId: number
): Promise<RetrieveCartResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.get<RetrieveCartResponse>(
      `/Customer/cart/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling retrieveCart API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// Update Cart Item
export interface UpdateCartItemData {
  cartItemId: number;
  quantity: number;
}

export interface UpdateCartItemResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const updateCartItem = async (
  payload: UpdateCartItemData
): Promise<UpdateCartItemResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.put<UpdateCartItemResponse>(
      "/Customer/cart/update",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling updateCartItem API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// Remove Cart Item
export interface RemoveCartItemResponse {
  success: boolean;
  message?: string;
}

export const removeCartItem = async (
  cartItemId: number
): Promise<RemoveCartItemResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.delete<RemoveCartItemResponse>(
      `/Customer/cart/remove/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling removeCartItem API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// Customer Profile Services
export interface CheckCustomerProfileResponse {
  success: boolean;
  hasProfile: boolean;
  data?: any;
  message?: string;
}

export interface CreateCustomerProfileData {
  userId: number;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateCustomerProfileResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface EditCustomerProfileData {
  customerId: number;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface EditCustomerProfileResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const checkCustomerProfile = async (
  userId: number
): Promise<CheckCustomerProfileResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        hasProfile: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.get<CheckCustomerProfileResponse>(
      `/Customer/profile/check/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling checkCustomerProfile API:", error);
    return {
      success: false,
      hasProfile: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const createCustomerProfile = async (
  payload: CreateCustomerProfileData
): Promise<CreateCustomerProfileResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.post<CreateCustomerProfileResponse>(
      "/Customer/profile/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling createCustomerProfile API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const editCustomerProfile = async (
  payload: EditCustomerProfileData
): Promise<EditCustomerProfileResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.put<EditCustomerProfileResponse>(
      "/Customer/profile/edit",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling editCustomerProfile API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};
