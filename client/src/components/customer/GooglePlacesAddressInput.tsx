import React, { useRef, useEffect, useState } from "react";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

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
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  useEffect(() => {
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

      // Prevent the autocomplete from interfering with other inputs
      inputRef.current.addEventListener("focus", () => {
        autocompleteRef.current.setBounds(null);
      });
    };

    const handlePlaceSelect = () => {
      // Prevent place selection during form submission or when disabled
      if (isFormSubmitting || disabled) {
        return;
      }

      try {
        setIsLoading(true);
        const place = autocompleteRef.current?.getPlace();

        // Only trigger onChange if we have a valid place with geometry
        if (
          place &&
          place.geometry &&
          place.geometry.location &&
          place.formatted_address
        ) {
          const address = place.formatted_address;
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          // Use setTimeout to ensure this doesn't interfere with form submission
          setTimeout(() => {
            if (!isFormSubmitting && !disabled) {
              onChange(address, lat, lng);
            }
          }, 10);
        }
      } catch (error) {
        console.error("Google Places error:", error);
      } finally {
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
    };
  }, []); // Remove onChange from dependencies to prevent re-initialization

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only update if this is specifically the address input and not disabled
    if (e.target === inputRef.current && !disabled && !isFormSubmitting) {
      onChange(e.target.value);
    }
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
    };
  }, []);

  return (
    <div
      className="relative"
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      onKeyPress={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          id="google-places-address-input"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-neutral-700 dark:text-white ${className}`}
          disabled={!isGoogleLoaded || disabled}
          autoComplete="off"
          onFocus={(e) => e.stopPropagation()}
          onBlur={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          onKeyPress={(e) => e.stopPropagation()}
        />
        {isLoading && (
          <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-violet-500 animate-spin" />
        )}
      </div>
      {!isGoogleLoaded && (
        <p className="text-xs text-gray-500 mt-1">Loading Google Places...</p>
      )}
    </div>
  );
};

export default GooglePlacesAddressInput;
