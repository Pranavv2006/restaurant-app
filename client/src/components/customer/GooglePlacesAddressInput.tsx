import React, { useRef, useEffect, useState } from "react";

interface GooglePlacesAddressInputProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

const GooglePlacesAddressInput: React.FC<GooglePlacesAddressInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your address",
  className = "",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const lastSelectionRef = useRef<string>("");
  const debounceTimeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  useEffect(() => {
    // Add custom styles for Google Places autocomplete dropdown
    const addCustomStyles = () => {
      if (document.getElementById('google-places-custom-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'google-places-custom-styles';
      style.innerHTML = `
        .pac-container {
          background-color: white;
          border: 2px solid #10b981 !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          margin-top: 8px !important;
          font-family: inherit;
          overflow: hidden;
        }
        
        .pac-container:after {
          display: none;
        }
        
        .pac-item {
          padding: 12px 16px !important;
          border-top: 1px solid #e5e7eb !important;
          cursor: pointer !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          transition: all 0.2s ease !important;
        }
        
        .pac-item:first-child {
          border-top: none !important;
        }
        
        .pac-item:hover {
          background-color: #f0fdf4 !important;
          transform: translateX(4px);
        }
        
        .pac-item-selected,
        .pac-item-selected:hover {
          background-color: #dcfce7 !important;
        }
        
        .pac-icon {
          background-image: none !important;
          width: 20px !important;
          height: 20px !important;
          margin-right: 12px !important;
          margin-top: 2px !important;
        }
        
        .pac-icon:before {
          content: "📍";
          font-size: 16px;
          display: block;
        }
        
        .pac-item-query {
          color: #1f2937 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        
        .pac-matched {
          color: #10b981 !important;
          font-weight: 700 !important;
        }
        
        .pac-logo:after {
          display: none !important;
        }
        
        @media (prefers-color-scheme: dark) {
          .pac-container {
            background-color: #262626;
            border-color: #10b981 !important;
          }
          
          .pac-item {
            color: #e5e5e5 !important;
            border-top-color: #404040 !important;
          }
          
          .pac-item:hover {
            background-color: #14532d !important;
          }
          
          .pac-item-selected,
          .pac-item-selected:hover {
            background-color: #166534 !important;
          }
          
          .pac-item-query {
            color: #e5e5e5 !important;
          }
        }
      `;
      document.head.appendChild(style);
    };
    
    addCustomStyles();
    
    const initializeGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleLoaded(true);
        initAutocomplete();
      } else {
        loadGooglePlacesScript();
      }
    };

    const loadGooglePlacesScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkGoogle);
            setIsGoogleLoaded(true);
            initAutocomplete();
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY
      }&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      script.defer = true;

      // Global callback function
      window.initGooglePlaces = () => {
        setIsGoogleLoaded(true);
        initAutocomplete();
      };

      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      // Clear any existing autocomplete instance
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }

      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
          }
        );

        // Prevent autocomplete from interfering with form submission
        autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
      } catch (error) {
        console.error("Failed to initialize autocomplete:", error);
      }
    };

    const handlePlaceSelect = () => {
      // Prevent place selection during form submission or when disabled
      if (isFormSubmitting || disabled) {
        return;
      }

      try {
        const place = autocompleteRef.current?.getPlace();

        // Only trigger onChange if we have a valid place with geometry
        if (
          place &&
          place.geometry &&
          place.geometry.location &&
          place.formatted_address
        ) {
          const address = place.formatted_address;
          
          // Prevent duplicate selections
          if (lastSelectionRef.current === address) {
            return;
          }
          
          lastSelectionRef.current = address;
          
          setIsLoading(true);
          
          // Immediate callback for better responsiveness
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          onChange(address, lat, lng);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Google Places error:", error);
        setIsLoading(false);
      }
    };

    initializeGooglePlaces();

    // Cleanup function
    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [onChange, disabled, isFormSubmitting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset last selection when user types manually
    lastSelectionRef.current = "";
    onChange(e.target.value);
  };

  // Detect form submission
  useEffect(() => {
    const detectFormSubmission = (e: Event) => {
      const target = e.target as HTMLElement;
      const isSubmitButton =
        target.tagName === "BUTTON" &&
        (target as HTMLButtonElement).type === "submit";
      if (target.closest("form") && (e.type === "submit" || isSubmitButton)) {
        setIsFormSubmitting(true);
        setTimeout(() => setIsFormSubmitting(false), 1000);
      }
    };

    document.addEventListener("click", detectFormSubmission, true);
    document.addEventListener("submit", detectFormSubmission, true);

    return () => {
      document.removeEventListener("click", detectFormSubmission, true);
      document.removeEventListener("submit", detectFormSubmission, true);
      
      // Clean up debounce timeout on unmount
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="flex-1 relative" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        id="google-places-address-input"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full h-full px-3 border-transparent bg-transparent focus:outline-none dark:text-neutral-200 dark:placeholder-neutral-400 transition-all duration-300 text-base ${className}`}
        disabled={!isGoogleLoaded || disabled}
        autoComplete="new-password"
        style={{ position: 'relative', zIndex: 1 }}
      />
      {isLoading && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8" style={{ zIndex: 2 }}>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-200 border-t-green-600"></div>
        </div>
      )}
      {!isGoogleLoaded && (
        <div className="absolute left-0 -bottom-6 text-xs text-gray-500" style={{ zIndex: 2 }}>
          Loading Google Places...
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAddressInput;