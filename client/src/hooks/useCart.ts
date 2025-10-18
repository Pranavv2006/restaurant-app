import { useState, useEffect, useCallback } from 'react';
import { retrieveCart, getAllCustomerAddresses } from '../services/CustomerService';
import useAuth from './useAuth';

interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  menu: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    restaurant: {
      id: number;
      name: string;
    };
  };
}

interface UseCartReturn {
  cartItems: CartItem[];
  cartItemCount: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  error: string | null;
}

// Global cart update event system
const cartUpdateListeners = new Set<() => void>();

export const triggerCartUpdate = () => {
  cartUpdateListeners.forEach(listener => listener());
};

export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Helper function to check if user is authenticated customer
  const isCustomer = () => {
    return isAuthenticated && user?.roleType === 'Customer';
  };

  // Get customer ID from user profile
  useEffect(() => {
    const getCustomerId = async () => {
      if (!isCustomer() || !user?.id) {
        setCustomerId(null);
        return;
      }

      try {
        const result = await getAllCustomerAddresses(user.id);
        if (result.success && result.data && result.data.customer) {
          setCustomerId(result.data.customer.id);
        } else {
          setCustomerId(null);
        }
      } catch (error) {
        console.error('Error getting customer ID:', error);
        setCustomerId(null);
      }
    };

    getCustomerId();
  }, [user?.id, isAuthenticated]);

  const refreshCart = useCallback(async () => {
    if (!customerId || !isCustomer()) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await retrieveCart(customerId);
      if (result.success && result.data?.cartItems) {
        setCartItems(result.data.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error refreshing cart:', err);
      setError('Failed to load cart');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [customerId, isAuthenticated, user]);

  // Calculate cart item count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Initial load
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Listen for global cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCart();
    };

    cartUpdateListeners.add(handleCartUpdate);
    
    return () => {
      cartUpdateListeners.delete(handleCartUpdate);
    };
  }, [refreshCart]);

  return {
    cartItems,
    cartItemCount,
    loading,
    refreshCart,
    error,
  };
};

export default useCart;