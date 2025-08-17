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
    status: 'success' | 'fail';
    message: string;
    welcomeMessage?: string;
    data?: {
        accessToken: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            roleType: string;
        };
    };
    statusCode?: number;
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
            if (error.response) {
                const errorData = error.response.data;
                throw new Error(errorData.message || "Failed to register user");
            } else if (error.request) {
                throw new Error("No response received from server. Please check if the backend is running.");
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },

    login: async (loginData: LoginData): Promise<LoginResponse> => {
        try {
            console.log('Sending login data:', loginData);

            const response = await axiosInstance.post<LoginResponse>('/login', loginData);

            console.log('Login response:', response.data);
      
            if (response.data.status === 'success' && response.data.data?.accessToken) {
                localStorage.setItem('authToken', response.data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
            }
            
            return response.data;
        } catch (error: any) {
            console.error("Error logging in:", error);
            if (error.response) {
                const errorData = error.response.data;
                throw new Error(errorData.message || "Failed to log in");
            } else if (error.request) {
                throw new Error("No response received from server. Please check if the backend is running.");
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    }
};