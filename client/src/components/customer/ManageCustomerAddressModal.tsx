import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaPhone, FaMapMarkerAlt, FaPlus, FaTrash, FaStar } from "react-icons/fa";
import { 
  createCustomerAddress, 
  getAllCustomerAddresses, 
  setDefaultAddress, 
  deleteCustomerAddress,
  type Address 
} from "../../services/CustomerService";
import GooglePlacesAddressInput from "./GooglePlacesAddressInput";

interface ManageCustomerAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: (data: any) => void;
}

const ManageCustomerAddressModal: React.FC<ManageCustomerAddressModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}) => {
  // State for existing addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  // State for creating new address
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    addressLine: "",
    phone: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    isDefault: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load addresses when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen, userId]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    setError(null);
    try {
      const result = await getAllCustomerAddresses(userId);
      if (result.success && result.data) {
        setAddresses(result.data.addresses);
        // Set selected address to default one
        if (result.data.defaultAddress) {
          setSelectedAddressId(result.data.defaultAddress.id);
        }
      } else {
        setAddresses([]);
        setShowCreateForm(true); // Show create form if no addresses exist
      }
    } catch (err) {
      setError("Failed to load addresses");
      setAddresses([]);
      setShowCreateForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      const result = await setDefaultAddress({
        userId,
        addressId,
      });
      
      if (result.success) {
        setSelectedAddressId(addressId);
        // Reload addresses to get updated default status
        await loadAddresses();
      } else {
        setError(result.message || "Failed to set default address");
      }
    } catch (err) {
      setError("An error occurred while setting default address");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (addresses.length <= 1) {
      setError("Cannot delete the only address");
      return;
    }

    try {
      const result = await deleteCustomerAddress(userId, addressId);
      
      if (result.success) {
        // Reload addresses after deletion
        await loadAddresses();
        // If deleted address was selected, reset selection
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      } else {
        setError(result.message || "Failed to delete address");
      }
    } catch (err) {
      setError("An error occurred while deleting address");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createCustomerAddress({
        userId,
        label: formData.label || undefined,
        addressLine: formData.addressLine,
        phone: formData.phone || undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
        isDefault: formData.isDefault,
      });

      if (result.success) {
        onSuccess?.(result.data);
        // Reload addresses and hide create form
        await loadAddresses();
        setShowCreateForm(false);
        setFormData({
          label: "",
          addressLine: "",
          phone: "",
          latitude: undefined,
          longitude: undefined,
          isDefault: false,
        });
      } else {
        setError(result.message || "Failed to create address");
      }
    } catch (err) {
      setError("An error occurred while creating address");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      phone: e.target.value,
    }));
  };

  const handleAddressChange = useCallback((address: string, lat?: number, lng?: number) => {
    // Only update if address is actually different
    setFormData(prev => {
      if (prev.addressLine === address && prev.latitude === lat && prev.longitude === lng) {
        return prev; // No change, return same object to prevent re-render
      }
      return {
        ...prev,
        addressLine: address,
        latitude: lat,
        longitude: lng,
      };
    });
  }, []);

  const handleClose = () => {
    setShowCreateForm(false);
    setFormData({
      label: "",
      addressLine: "",
      phone: "",
      latitude: undefined,
      longitude: undefined,
      isDefault: false,
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl transform animate-modal-enter max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-2xl text-violet-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Manage Addresses
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transform hover:rotate-90 transition-transform duration-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loadingAddresses ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading addresses...</p>
            </div>
          ) : (
            <>
              {/* Existing Addresses */}
              {addresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Your Addresses
                  </h3>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg transition-all duration-200 ${
                          address.isDefault
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                            : "border-gray-200 dark:border-neutral-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {address.label && (
                                <span className="text-sm font-medium text-violet-600">
                                  {address.label}
                                </span>
                              )}
                              {address.isDefault && (
                                <div className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                                  <FaStar className="text-xs" />
                                  Default
                                </div>
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {address.addressLine}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefault(address.id)}
                                className="text-sm text-violet-600 hover:text-violet-700 underline"
                              >
                                Set Default
                              </button>
                            )}
                            {addresses.length > 1 && (
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete address"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Button */}
              {!showCreateForm && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
                  >
                    <FaPlus />
                    Add New Address
                  </button>
                </div>
              )}

              {/* Create New Address Form */}
              {showCreateForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Add New Address
                  </h3>

                  {/* Label Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Label (optional)
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleChange}
                      placeholder="Home, Work, etc."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-neutral-700 dark:text-white"
                    />
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <GooglePlacesAddressInput
                      value={formData.addressLine}
                      onChange={handleAddressChange}
                      placeholder="Enter your address"
                      disabled={loading}
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onFocus={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-neutral-700 dark:text-white"
                    />
                  </div>

                  {/* Default Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Set as default address
                    </label>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.addressLine}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Adding..." : "Add Address"}
                    </button>
                  </div>
                </form>
              )}

              {/* Done Button */}
              {!showCreateForm && addresses.length > 0 && (
                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    Done
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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

export default ManageCustomerAddressModal;
