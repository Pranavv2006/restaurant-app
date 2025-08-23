import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import merchantService from "../services/MerchantService";

interface FormData {
    name: string;
    location: string;
    phone: string;
    cuisine: string;
}

const CreateRestaurant: React.FC = () => {
    const [form, setForm] = useState<FormData>({
        name: "",
        location: "",
        phone: "",
        cuisine: ""
    });
    const [merchantId, setMerchantId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userDataString = localStorage.getItem('user');
            console.log('Raw user data from localStorage:', userDataString);
            
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                console.log('Parsed user data:', userData);
                
                if (userData && userData.id) {
                    const id = typeof userData.id === 'string' ? parseInt(userData.id) : userData.id;
                    console.log('Setting merchant ID:', id);
                    setMerchantId(id);
                } else {
                    console.error('No user ID found in data:', userData);
                    setError('User ID not found. Please login again.');
                }
            } else {
                console.error('No user data in localStorage');
                setError('No user data found. Please login again.');
                navigate('/');
            }
        } catch (err) {
            console.error('Error parsing user data:', err);
            setError('Invalid user data. Please login again.');
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!merchantId) {
            setError('Merchant ID not found. Please login again.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const raw = localStorage.getItem('user');
        const user = raw ? JSON.parse(raw) : null;
        const userId = user?.id ?? null;

        try {
            const requestData = {
                merchantId: userId,
                name: form.name.trim(),
                location: form.location.trim(),
                phone: form.phone.trim(),
                cuisine: form.cuisine.trim()
            };

            console.log('Creating restaurant with data:', requestData);
            
            const result = await merchantService.createRestaurant(requestData);
            console.log('Create restaurant result:', result);

            if (result.success) {
                setSuccess(result.message || 'Restaurant created successfully!');
                setTimeout(() => {
                    navigate('/merchant');
                }, 1500);
            } else {
                setError(result.error || result.message || 'Failed to create restaurant');
            }
        } catch (error: any) {
            console.error('Create restaurant error:', error);
            setError(error?.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (merchantId === null && !error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="max-w-xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-gray-800">
                        Create Restaurant
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-600">
                        Fill in the details for your Restaurant
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                        <strong>Success:</strong> {success}
                        <p className="mt-1">Redirecting to dashboard...</p>
                    </div>
                )}

                <div className="mt-12">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 lg:gap-6">
                            <div>
                                <label className="block mb-2 text-sm text-gray-700 font-medium">
                                    Restaurant Name *
                                </label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={form.name} 
                                    onChange={handleChange} 
                                    required
                                    disabled={loading}
                                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none" 
                                    placeholder="Enter restaurant name"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700 font-medium">
                                        Location *
                                    </label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={form.location} 
                                        onChange={handleChange} 
                                        required
                                        disabled={loading}
                                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none" 
                                        placeholder="Enter location"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-700 font-medium">
                                        Phone *
                                    </label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={form.phone} 
                                        onChange={handleChange} 
                                        required
                                        disabled={loading}
                                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none" 
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-gray-700 font-medium">
                                    Cuisine *
                                </label>
                                <textarea 
                                    name="cuisine" 
                                    value={form.cuisine} 
                                    onChange={handleChange} 
                                    required
                                    disabled={loading}
                                    rows={3}
                                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none"
                                    placeholder="Describe your cuisine type (e.g., Italian, Chinese, etc.)"
                                />
                            </div>
                        </div>

                        <div className="mt-6 grid">
                            <button 
                                type="submit" 
                                disabled={loading || !merchantId}
                                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Restaurant...
                                    </>
                                ) : (
                                    'Create Restaurant'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRestaurant;