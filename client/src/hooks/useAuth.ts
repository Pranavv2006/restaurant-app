import { useState, useEffect } from 'react';

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
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setAuthState({
            isAuthenticated: true,
            user: user,
            loading: false,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
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

    // Listen for auth changes (e.g., login/logout from other tabs)
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