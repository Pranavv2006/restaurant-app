import axiosInstance from "../api/axiosConfig";

// ==================== INTERFACES ====================

// Basic Data Models
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

// Add to Cart
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

// Search Restaurants
export interface SearchRestaurantData {
  query: string;
}

export interface SearchRestaurantResponse {
  success: boolean;
  data?: any[];
  message?: string;
  error?: string;
}

// Select Restaurant
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

// Remove Cart Item
export interface RemoveCartItemResponse {
  success: boolean;
  message?: string;
}

// Customer Profile
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

// Nearby Restaurants
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

// Place Order
export interface PlaceOrderItem {
  id: number;
  quantity: number;
}

export interface PlaceOrderData {
  customerId: number;
  restaurantId: number;
  items: PlaceOrderItem[];
}

export interface PlaceOrderResponse {
  success: boolean;
  data?: {
    orderId: number;
    total: number;
    deliveryFee: number;
    status: string;
    orderDate: string;
    address: string;
  };
  message?: string;
}

// Multiple Orders Support
export interface MultipleOrdersResult {
  successfulOrders: number[];
  failedOrders: { restaurantName: string; error: string }[];
  totalSuccessful: number;
  totalFailed: number;
}

export interface CustomerAddressResponse {
  address: string;
  latitude?: number;
  longitude?: number;
}

// Orders Data
export interface OrdersData {
  id: number;
  total: number;
  deliveryFee: number;
  status: string;
  orderDate: string;
  address: string;
  restaurant: {
    id: number;
    name: string;
    address: string;
  };
  orderItems: {
    id: number;
    quantity: number;
    price: number;
    menu: {
      id: number;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
    };
  }[];
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

export const getNearbyRestaurants = async (
  payload: NearbyRestaurantsData
): Promise<NearbyRestaurantsResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const { latitude, longitude, radiusKm } = payload;
    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    if (radiusKm) {
      queryParams.append("radiusKm", radiusKm.toString());
    }

    const response = await axiosInstance.get<NearbyRestaurantsResponse>(
      `/Customer/restaurants/nearby?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling getNearbyRestaurants API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const placeOrder = async (
  payload: PlaceOrderData
): Promise<PlaceOrderResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.post<PlaceOrderResponse>(
      "/Customer/orders",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ placeOrder API Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// Helper function to place multiple orders (one per restaurant)
export const placeMultipleOrders = async (
  customerId: number,
  cartItems: Array<{
    id: number;
    quantity: number;
    menu: { id: number; name: string; price: number };
    restaurant: { id: number; name: string };
  }>
): Promise<MultipleOrdersResult> => {
  // Group items by restaurant
  const itemsByRestaurant = cartItems.reduce((acc, item) => {
    const restaurantId = item.restaurant.id;
    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        restaurantId,
        restaurantName: item.restaurant.name,
        items: [],
      };
    }
    acc[restaurantId].items.push({
      id: item.menu.id,
      quantity: item.quantity,
    });
    return acc;
  }, {} as Record<number, { restaurantId: number; restaurantName: string; items: PlaceOrderItem[] }>);

  // Create orders for each restaurant
  const orderPromises = Object.values(itemsByRestaurant).map(
    async (restaurantOrder) => {
      const orderData: PlaceOrderData = {
        customerId,
        restaurantId: restaurantOrder.restaurantId,
        items: restaurantOrder.items,
      };

      try {
        const result = await placeOrder(orderData);
        return {
          restaurantName: restaurantOrder.restaurantName,
          result,
        };
      } catch (error) {
        return {
          restaurantName: restaurantOrder.restaurantName,
          result: {
            success: false,
            message: "Network error",
          } as PlaceOrderResponse,
        };
      }
    }
  );

  // Wait for all orders to complete
  const results = await Promise.allSettled(orderPromises);

  // Process results
  const successfulOrders: number[] = [];
  const failedOrders: { restaurantName: string; error: string }[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      const { restaurantName, result: orderResult } = result.value;

      if (orderResult.success && orderResult.data) {
        successfulOrders.push(orderResult.data.orderId);
      } else {
        failedOrders.push({
          restaurantName,
          error: orderResult.message || "Unknown error",
        });
      }
    } else {
      failedOrders.push({
        restaurantName: "Unknown",
        error: "Network error",
      });
    }
  });

  return {
    successfulOrders,
    failedOrders,
    totalSuccessful: successfulOrders.length,
    totalFailed: failedOrders.length,
  };
};

export const retrieveCustomerAddress = async (
  customerId: number
): Promise<CustomerAddressResponse | null> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found. Please login again.");
      return null;
    }

    const response = await axiosInstance.get<{
      success: boolean;
      data: CustomerAddressResponse | null;
      message?: string;
    }>(`/Customer/address/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      console.warn("Customer address not found:", response.data.message);
      return null;
    }
  } catch (error: any) {
    console.error("Error retrieving customer address:", error);
    return null;
  }
};

// Get Customer Orders
export const getCustomerOrders = async (
  userId: number
): Promise<OrdersData[]> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found. Please login again.");
      return [];
    }

    const response = await axiosInstance.get<{
      success: boolean;
      data: OrdersData[];
      message?: string;
    }>(`/Customer/orders/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.warn("Failed to fetch orders:", response.data.message);
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
};
