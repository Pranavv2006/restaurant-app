import React, { useState } from "react";
import { authService, type LoginData } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import merchantService from "../../services/MerchantService";

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

const Login = ({ onClose, onSwitchToRegister }: LoginProps) => {
    const [formData, setFormData] = useState<LoginData>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log('Submitting login form with data:', formData);

            const response = await authService.login(formData);
            console.log('Login response:', response);

            const isSuccess = response?.success === true;
            const backendMessage = response?.message || 'Login failed';

            if (isSuccess) {
                if (response?.data?.user) {
                    const userData = {
                        id: response.data.user.id,
                        email: response.data.user.email,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        roleType: response.data.user.roleType
                    };
                    
                    console.log('Storing user data:', userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }

                setTimeout(async () => {
                    try {
                        const user = response?.data?.user;
                        const userRole = user?.roleType;

                        console.log('User role:', userRole);
                        const raw = localStorage.getItem('user');
                        const userJson = raw ? JSON.parse(raw) : null;
                        const userId = userJson?.id ?? null;

                        if (userRole === 'Merchant') {
                            const checkResult = await merchantService.checkRestaurant({ merchantId: userId });
                            console.log('Restaurant check result:', checkResult);
                            
                            if (checkResult.success && checkResult.hasRestaurant) {
                                navigate('/merchant');
                            } else {
                                navigate('/create-restaurant');
                            }
                        } else {
                            navigate('/');
                        }
                        onClose();
                    } catch (error) {
                        console.error('Post-login navigation error:', error);
                        navigate('/merchant');
                        onClose();
                    }
                }, 100);
                return;
            }

            const isAuthFailure = response?.success === false;

            if (isAuthFailure) {
                setError(backendMessage);
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                setError(backendMessage);
            }

        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error?.message || 'An error occurred during login';

            if (error?.request || /network error/i.test(errorMessage)) {
                setError('No response received from server. Please check if the backend is running.');
            } else if (/password|invalid|incorrect|unauthorized|credentials/i.test(errorMessage)) {
                setError(errorMessage);
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchToRegister = () => {
        if (onSwitchToRegister) {
            onClose();
            onSwitchToRegister();
        }
    };

    return(
        <>
            {/* Login Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-lg w-full m-3 dark:bg-neutral-900 dark:border-neutral-800">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h3 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">Sign in</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                                Don't have an account yet?
                                <button 
                                    onClick={handleSwitchToRegister}
                                    className="text-violet-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-violet-500 ml-1 cursor-pointer"
                                    type="button"
                                >
                                    Sign up here
                                </button>
                            </p>
                        </div>

                        {/* Error Message (for non-authentication errors) */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                                <strong>Success:</strong> {success}
                            </div>
                        )}

                        <div className="mt-5">
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm mb-2 dark:text-white">Email address *</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                            required 
                                            placeholder="Enter your email"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password *</label>
                                            <a className="inline-flex items-center gap-x-1 text-sm text-violet-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-violet-500" href="#">
                                                Forgot password?
                                            </a>
                                        </div>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                            required 
                                            placeholder="Enter your password"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center">
                                        <div className="flex">
                                            <input 
                                                id="remember-me" 
                                                name="remember-me" 
                                                type="checkbox" 
                                                className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-violet-600 focus:ring-violet-500 dark:bg-neutral-800 dark:border-neutral-800 dark:checked:bg-violet-500 dark:checked:border-violet-500 dark:focus:ring-offset-gray-800" 
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="ms-3">
                                            <label htmlFor="remember-me" className="text-sm dark:text-white">Remember me</label>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign in'
                                        )}
                                    </button>
                                </div>
                            </form>
                            
                            <button 
                                onClick={onClose}
                                disabled={loading}
                                className="mt-4 w-full py-2 px-4 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;