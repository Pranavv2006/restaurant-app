import axiosInstance from "../api/axiosConfig";

// Helper function to check if user is authenticated customer
const isAuthenticatedCustomer = (): boolean => {
  try {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      return false;
    }
    
    const user = JSON.parse(userStr);
    return user.roleType === 'Customer';
  } catch (error) {
    console.error("Error checking customer authentication:", error);
    return false;
  }
};

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

// Customer Address Interfaces
export interface Address {
  id: number;
  customerId: number;
  label?: string;
  addressLine: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface Customer {
  id: number;
  userId: number;
  phone?: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CheckCustomerAddressResponse {
  success: boolean;
  hasAddress: boolean;
  data?: {
    customer: Customer;
    defaultAddress?: Address;
    totalAddresses: number;
  };
  message?: string;
}

export interface CreateCustomerAddressData {
  userId: number;
  label?: string;
  addressLine: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface CreateCustomerAddressResponse {
  success: boolean;
  data?: {
    customer: Customer & { addresses: Address[] };
    newAddress: Address;
    totalAddresses: number;
  };
  message?: string;
}

export interface GetAllAddressesResponse {
  success: boolean;
  data?: {
    customer: Customer;
    addresses: Address[];
    defaultAddress?: Address;
    totalAddresses: number;
  };
  message?: string;
}

export interface SetDefaultAddressData {
  userId: number;
  addressId: number;
}

export interface SetDefaultAddressResponse {
  success: boolean;
  data?: {
    customer: Customer & { addresses: Address[] };
    updatedAddress: Address;
    defaultAddress: Address;
    totalAddresses: number;
  };
  message?: string;
}

export interface DeleteAddressResponse {
  success: boolean;
  data?: {
    customer: Customer & { addresses: Address[] };
    remainingAddresses: number;
    deletedAddressId: number;
  };
  message?: string;
}

export interface EditCustomerAddressData {
  customerId: number;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface EditCustomerAddressResponse {
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
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to add items to cart.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.post<AddToCartResponse>(
      "/Customer/cart/add",
      payload
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
    // This endpoint should be public since viewing restaurant menus doesn't require customer authentication
    const url = `/home/select-restaurant/${payload.restaurantId}`;

    const response = await axiosInstance.get<SelectRestaurantResponse>(url);

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
    // Restaurant search should be public - anyone can search for restaurants
    const response = await axiosInstance.get<SearchRestaurantResponse>(
      "/home/search-restaurants",
      {
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
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to view cart.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.get<RetrieveCartResponse>(
      `/Customer/cart/${customerId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling retrieveCart API:", error);
    
    // Handle 404 - cart doesn't exist yet (normal case)
    if (error.response?.status === 404) {
      return {
        success: true,
        data: {
          id: null,
          customerId: customerId,
          cartItems: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        message: "Cart is empty - no items added yet.",
      };
    }
    
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
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to update cart items.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.put<UpdateCartItemResponse>(
      "/Customer/cart/update",
      payload
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
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to remove cart items.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.delete<RemoveCartItemResponse>(
      `/Customer/cart/remove/${cartItemId}`
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

export const checkCustomerAddress = async (
  userId: number
): Promise<CheckCustomerAddressResponse> => {
  try {
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        hasAddress: false,
        message: "Please log in as a customer to access address features.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        hasAddress: false,
        message: "Not authenticated - please login to access address features.",
      };
    }

    const response = await axiosInstance.get<CheckCustomerAddressResponse>(
      `/Customer/address/check/${userId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling checkCustomerAddress API:", error);
    return {
      success: false,
      hasAddress: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const createCustomerAddress = async (
  payload: CreateCustomerAddressData
): Promise<CreateCustomerAddressResponse> => {
  try {
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to create addresses.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.post<CreateCustomerAddressResponse>(
      "/Customer/address/create",
      payload
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling createCustomerAddress API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const editCustomerAddress = async (
  payload: EditCustomerAddressData
): Promise<EditCustomerAddressResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.put<EditCustomerAddressResponse>(
      "/Customer/address/edit",
      payload
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling editCustomerAddress API:", error);
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
    // Finding nearby restaurants should be public - anyone can search for nearby restaurants
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
      payload
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
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      console.log("User not authenticated as customer. Address features unavailable.");
      return null;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No authentication token - user not logged in. Address features unavailable.");
      return null;
    }

    const response = await axiosInstance.get<{
      success: boolean;
      data: CustomerAddressResponse | null;
      message?: string;
    }>(`/Customer/address/${customerId}`);

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

// Legacy function - Use getDefaultAddress() for new implementations
export const retrieveDefaultCustomerAddress = async (
  userId: number
): Promise<Address | null> => {
  try {
    const defaultAddress = await getDefaultAddress(userId);
    return defaultAddress;
  } catch (error) {
    console.error("Error retrieving default customer address:", error);
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
    }>(`/Customer/orders/${userId}`);

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

export const getProximityRestaurants = async (
  payload: ProximitySearchData
): Promise<ProximitySearchResponse> => {
  try {
    // Proximity search should be public - anyone can search for restaurants by location
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
    console.error("Error calling getProximityRestaurants API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// ===== MULTIPLE ADDRESS MANAGEMENT FUNCTIONS =====

export const getAllCustomerAddresses = async (
  userId: number
): Promise<GetAllAddressesResponse> => {
  try {
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to view addresses.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.get<GetAllAddressesResponse>(
      `/Customer/addresses/${userId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling getAllCustomerAddresses API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const setDefaultAddress = async (
  payload: SetDefaultAddressData
): Promise<SetDefaultAddressResponse> => {
  try {
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to manage addresses.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.put<SetDefaultAddressResponse>(
      "/Customer/address/setDefault",
      payload
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling setDefaultAddress API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const deleteCustomerAddress = async (
  userId: number,
  addressId: number
): Promise<DeleteAddressResponse> => {
  try {
    // Check if user is authenticated customer
    if (!isAuthenticatedCustomer()) {
      return {
        success: false,
        message: "Please log in as a customer to delete addresses.",
      };
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please login again.",
      };
    }

    const response = await axiosInstance.delete<DeleteAddressResponse>(
      `/Customer/address/${userId}/${addressId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error calling deleteCustomerAddress API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// ===== UTILITY FUNCTIONS FOR ADDRESS MANAGEMENT =====

export const getDefaultAddress = async (userId: number): Promise<Address | null> => {
  try {
    const response = await getAllCustomerAddresses(userId);
    
    if (response.success && response.data?.defaultAddress) {
      return response.data.defaultAddress;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting default address:", error);
    return null;
  }
};

export const hasMultipleAddresses = async (userId: number): Promise<boolean> => {
  try {
    const response = await getAllCustomerAddresses(userId);
    
    if (response.success && response.data) {
      return response.data.totalAddresses > 1;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking multiple addresses:", error);
    return false;
  }
};

export const findAddressById = async (userId: number, addressId: number): Promise<Address | null> => {
  try {
    const response = await getAllCustomerAddresses(userId);
    
    if (response.success && response.data?.addresses) {
      const address = response.data.addresses.find(addr => addr.id === addressId);
      return address || null;
    }
    
    return null;
  } catch (error) {
    console.error("Error finding address by ID:", error);
    return null;
  }
};
