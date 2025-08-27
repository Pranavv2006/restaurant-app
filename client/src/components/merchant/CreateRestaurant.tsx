import React, { useState, useEffect, useRef } from "react";
import merchantService from "../../services/MerchantService";

interface FormData {
  name: string;
  location: string;
  phone: string;
  cuisine: string;
}

interface CreateRestaurantProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRestaurant = ({ onClose, onSuccess }: CreateRestaurantProps) => {
  const [form, setForm] = useState<FormData>({
    name: "",
    location: "",
    phone: "",
    cuisine: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const totalSteps = 3;

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log("Google Maps API already loaded");
        return;
      }

      const apiKey = import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY;

      console.log("Environment variables:", {
        apiKey: apiKey,
        allEnvVars: import.meta.env, // Log all environment variables
      });

      if (!apiKey) {
        console.error(
          "Google Places API key not found in environment variables"
        );
        setError("Google Places API key not configured");
        return;
      }

      console.log(
        "Loading Google Maps API with key:",
        apiKey.substring(0, 10) + "..."
      );

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps API loaded successfully");
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        setError("Failed to load Google Maps API");
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  useEffect(() => {
    if (
      currentStep === 2 &&
      inputRef.current &&
      window.google &&
      window.google.maps &&
      window.google.maps.places
    ) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["establishment", "geocode"],
            componentRestrictions: { country: "us" }, // Restrict to US, change as needed
            fields: ["formatted_address", "name", "place_id", "geometry"],
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            setForm((prev) => ({
              ...prev,
              location: place.formatted_address as string,
            }));
          }
        });
      } catch (error) {
        console.error("Error initializing Google Places:", error);
      }
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [currentStep]);

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("user");
      console.log("Raw user data from localStorage:", userDataString);

      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log("Parsed user data:", userData);

        if (userData && userData.id) {
          const id =
            typeof userData.id === "string"
              ? parseInt(userData.id)
              : userData.id;
          console.log("Setting merchant ID:", id);
          setMerchantId(id);
        } else {
          console.error("No user ID found in data:", userData);
          setError("User ID not found. Please login again.");
        }
      } else {
        console.error("No user data in localStorage");
        setError("No user data found. Please login again.");
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("Invalid user data. Please login again.");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantId) {
      setError("Merchant ID not found. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    const userId = user?.id ?? null;

    try {
      const requestData = {
        merchantId: userId,
        name: form.name.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        cuisine: form.cuisine.trim(),
      };

      console.log("Creating restaurant with data:", requestData);

      const result = await merchantService.createRestaurant(requestData);
      console.log("Create restaurant result:", result);

      if (result.success) {
        setSuccess(result.message || "Restaurant created successfully!");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(
          result.error || result.message || "Failed to create restaurant"
        );
      }
    } catch (error: any) {
      console.error("Create restaurant error:", error);
      setError(error?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return form.name.trim() !== "";
      case 2:
        return form.location.trim() !== "";
      case 3:
        return form.phone.trim() !== "" && form.cuisine.trim() !== "";
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Restaurant Name";
      case 2:
        return "Location";
      case 3:
        return "Contact & Cuisine";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "What's the name of your restaurant?";
      case 2:
        return "Where is your restaurant located?";
      case 3:
        return "Contact details and cuisine type";
      default:
        return "";
    }
  };

  if (merchantId === null && !error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-violet-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {getStepTitle()}
          </h1>
          <p className="text-gray-600">{getStepDescription()}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
            <strong>Success:</strong> {success}
            <p className="mt-1">Closing modal...</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Restaurant Name */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700 font-medium">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Enter your restaurant name"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Location with Google Places Autocomplete */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700 font-medium">
                  Location
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="py-3 px-4 pr-10 block w-full border-gray-200 rounded-lg text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Search for restaurant location..."
                    autoComplete="off"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Start typing to search for your restaurant's address
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Phone & Cuisine */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700 font-medium">
                  Cuisine Type
                </label>
                <textarea
                  name="cuisine"
                  value={form.cuisine}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={3}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Describe your cuisine type (e.g., Italian, Chinese, etc.)"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="px-6 py-3 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid() || loading || !merchantId}
                className="px-6 py-3 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Restaurant"
                )}
              </button>
            )}
          </div>
        </form>

        <button
          onClick={onClose}
          disabled={loading}
          className="w-full mt-4 py-2 px-4 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateRestaurant;
