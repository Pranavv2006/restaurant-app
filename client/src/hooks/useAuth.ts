import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getUser();
        
        setAuthState({
          isAuthenticated,
          user,
          loading: false,
        });
      } catch (error) {
        console.error('Error checking authentication state:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return authState;
};

export default useAuth;