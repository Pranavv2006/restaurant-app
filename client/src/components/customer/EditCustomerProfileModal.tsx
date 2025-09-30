import React, { useState, useEffect } from "react";
import { FaTimes, FaPhone, FaEdit } from "react-icons/fa";
import { editCustomerProfile } from "../../services/CustomerService";
import GooglePlacesAddressInput from "./GooglePlacesAddressInput";

interface EditCustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    id: number;
    address?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  } | null;
  onSuccess?: (data: any) => void;
}

const EditCustomerProfileModal: React.FC<EditCustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customerData,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerData && isOpen) {
      setFormData({
        address: customerData.address || "",
        phone: customerData.phone || "",
        latitude: customerData.latitude || undefined,
        longitude: customerData.longitude || undefined,
      });
    }
  }, [customerData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData) return;

    setLoading(true);
    setError(null);

    try {
      const result = await editCustomerProfile({
        customerId: customerData.id,
        address: formData.address || undefined,
        phone: formData.phone || undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      if (result.success) {
        onSuccess?.(result.data);
        onClose();
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen || !customerData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform animate-modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <FaEdit className="text-2xl text-violet-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transform hover:rotate-90 transition-transform duration-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* User Info (Read-only) */}
          <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {customerData.user.firstName} {customerData.user.lastName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {customerData.user.email}
            </p>
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <GooglePlacesAddressInput
              value={formData.address}
              onChange={(address, lat, lng) => {
                setFormData({
                  ...formData,
                  address,
                  latitude: lat,
                  longitude: lng,
                });
              }}
              placeholder="Enter your address"
              disabled={loading}
            />
          </div>

          {/* Phone Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaPhone className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="edit-customer-phone-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-neutral-700 dark:text-white"
              autoComplete="tel"
              onFocus={(e) => e.stopPropagation()}
              onBlur={(e) => e.stopPropagation()}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-enter {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditCustomerProfileModal;
