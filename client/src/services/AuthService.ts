import axiosInstance from "../api/axiosConfig";

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleType: 'Customer' | 'Merchant' | 'SuperAdmin';
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
    error?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    welcomeMessage?: string;
    data?: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            roleType: string;
        };
    };
}

export const authService = {
    register: async (userData: RegisterData): Promise<RegisterResponse> => {
        try {
            const requestData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                role: userData.roleType
            };

            console.log("Registering user:", requestData);

            const response = await axiosInstance.post<RegisterResponse>("/register", requestData);

            return response.data;
        } catch (error: any) {
            console.error("Error registering user:", error);

            if (error?.response?.data){
                return error.response.data as RegisterResponse;
            }

            if (error.request){
                throw new Error("No response received from server. Please check if the backend is running.");
            }

            throw new Error("An unknown error occurred");
        }
    },

    login: async (loginData: LoginData): Promise<LoginResponse> => {
        try {
            console.log('Sending login data:', loginData);

            const response = await axiosInstance.post<LoginResponse>('/login', loginData);

            console.log('Login response:', response.data);

            if (response.data.success === true && response.data.data?.accessToken) {
                localStorage.setItem('authToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
            }
            
            return response.data;
        } catch (error: any) {
            console.error("Error logging in:", error);

            if (error?.response?.data) {
                return error.response.data as LoginResponse;
            }

            if (error.request) {
                throw new Error("No response received from server. Please check if the backend is running.");
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                await axiosInstance.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    },

    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    }
};