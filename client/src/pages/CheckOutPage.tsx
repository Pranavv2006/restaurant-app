import React, { useState, useEffect } from 'react';
import { getAllCustomerAddresses, createCustomerAddress, retrieveCart, placeMultipleOrders, type Address } from '../services/CustomerService';
import useAuth from '../hooks/useAuth';
import CustomerNav from '../components/customer/CustomerNav';
import GooglePlacesAddressInput from '../components/customer/GooglePlacesAddressInput';
import AddressErrorToast from '../components/customer/AddressErrorToast';
import ManageCustomerAddressModal from '../components/customer/ManageCustomerAddressModal';
import { useNavigate } from 'react-router-dom';
import { triggerCartUpdate } from '../hooks/useCart';

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  label: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, currentStep, label }) => {
  const isCompleted = step < currentStep;
  const isCurrent = step === currentStep;

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            isCompleted
              ? 'bg-gray-300 dark:bg-neutral-600 text-gray-600 dark:text-gray-300'
              : isCurrent
              ? 'bg-violet-600 text-white'
              : 'bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-gray-500'
          }`}
        >
          {isCompleted ? '✓' : step}
        </div>
        <span
          className={`text-sm mt-2 ${
            isCurrent ? 'text-violet-600 font-semibold' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  menu: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    restaurant: {
      id: number;
      name: string;
    };
  };
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  deliveryFee: number;
  tax: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, deliveryFee, tax }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-lg border border-violet-100 dark:border-violet-800">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Order Summary</h3>
      
      {items.map((item) => (
        <div key={item.id} className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
          <span>{item.name} (x{item.quantity}):</span>
          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      
      <div className="flex justify-between mb-2 pt-2 border-t border-violet-200 dark:border-violet-700 text-gray-700 dark:text-gray-300">
        <span>Subtotal:</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
        <span>Delivery Fee:</span>
        <span>₹{deliveryFee.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between mb-4 text-gray-700 dark:text-gray-300">
        <span>Tax:</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-violet-300 dark:border-violet-600 text-gray-800 dark:text-white">
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

interface ContactFormData {
  email: string;
  phone: string;
  selectedAddressId?: number;
  newAddress: {
    label: string;
    addressLine: string;
    latitude?: number;
    longitude?: number;
    isDefault: boolean;
  };
  instructions: string;
  useExistingAddress: boolean;
}

const CheckoutPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showAddressErrorToast, setShowAddressErrorToast] = useState(false);
  const [showManageAddressModal, setShowManageAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // @ts-ignore
  const [orderIds, setOrderIds] = useState<number[]>([]);

  const [finalOrderItems, setFinalOrderItems] = useState<OrderItem[]>([]);

  // Helper function to check if user is authenticated customer
  const isCustomer = () => {
    return isAuthenticated && user?.roleType === 'Customer';
  };
  
  const [formData, setFormData] = useState<ContactFormData>({
    email: user?.email || '',
    phone: '',
    selectedAddressId: undefined,
    newAddress: {
      label: '',
      addressLine: '',
      latitude: undefined,
      longitude: undefined,
      isDefault: false,
    },
    instructions: '',
    useExistingAddress: true,
  });

  const orderItems: OrderItem[] = cartItems.map(item => ({
    id: item.menu.id,
    name: item.menu.name,
    price: parseFloat(item.unitPrice.toString()),
    quantity: item.quantity,
  }));

  // Use preserved order items for display when cart is cleared after order placement
  const displayOrderItems = currentStep === 4 && finalOrderItems.length > 0 ? finalOrderItems : orderItems;

  useEffect(() => {
    if (isCustomer() && user?.id) {
      loadCustomerData();
    }
  }, [isAuthenticated, user]);

  const loadCustomerData = async () => {
    if (!user?.id) return;
    
    try {
      const addressResult = await getAllCustomerAddresses(user.id);
      if (addressResult.success && addressResult.data && addressResult.data.customer) {
        const customerProfileId = addressResult.data.customer.id;
        setCustomerId(customerProfileId);
        setAddresses(addressResult.data.addresses);
        
        // Auto-select default address
        const defaultAddress = addressResult.data.defaultAddress;
        if (defaultAddress) {
          setFormData(prev => ({
            ...prev,
            selectedAddressId: defaultAddress.id,
            useExistingAddress: true,
          }));
        } else if (addressResult.data.addresses.length === 0) {
          setShowAddressErrorToast(true);
          setFormData(prev => ({
            ...prev,
            useExistingAddress: false,
          }));
        }

        // Load cart items
        await loadCartItems(customerProfileId);
      }
    } catch (error) {
      console.error('Failed to load customer data:', error);
      setShowAddressErrorToast(true);
      setFormData(prev => ({
        ...prev,
        useExistingAddress: false,
      }));
    }
  };

  const loadCartItems = async (customerProfileId: number) => {
    setLoadingCart(true);
    try {
      const result = await retrieveCart(customerProfileId);
      if (result.success && result.data?.cartItems) {
        setCartItems(result.data.cartItems);
      } else {
        setCartItems([]);
        // If cart is empty, redirect to home
        if (!result.data?.cartItems || result.data.cartItems.length === 0) {
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  // Step navigation functions
  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1: // Cart step
        return cartItems.length > 0;
      case 2: // Details step
        const hasRequiredFields = !!formData.phone.trim();
        const hasAddress = formData.useExistingAddress 
          ? !!formData.selectedAddressId 
          : !!formData.newAddress.addressLine.trim();
        return hasRequiredFields && hasAddress;
      case 3: // Payment step
        return paymentMethod !== '';
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4 && canProceedFromStep(currentStep)) {
      if (currentStep === 3) {
        // Place order before going to confirmation
        handlePlaceOrder();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!customerId || cartItems.length === 0) return;

    setPlacingOrder(true);
    try {
      const currentOrderItems: OrderItem[] = cartItems.map(item => ({
        id: item.menu.id,
        name: item.menu.name,
        price: parseFloat(item.unitPrice.toString()),
        quantity: item.quantity,
      }));
      setFinalOrderItems(currentOrderItems);

      // Transform cart items for order placement
      const orderItemsForAPI = cartItems.map(item => ({
        id: item.menu.id,
        quantity: item.quantity,
        menu: {
          id: item.menu.id,
          name: item.menu.name,
          price: parseFloat(item.unitPrice.toString()),
        },
        restaurant: {
          id: item.menu.restaurant.id,
          name: item.menu.restaurant.name,
        },
      }));
    
      const userStr = localStorage.getItem("user");
      let customerEmail = "";
      if (userStr) {
      try {
          const user = JSON.parse(userStr);
          customerEmail = user.email; 
        } catch (e) {
          console.error("Could not parse user object for email.");
        }
      }
      const result = await placeMultipleOrders(customerId, orderItemsForAPI, customerEmail);
      
      if (result.totalSuccessful > 0) {
        setOrderIds(result.successfulOrders);
        setOrderPlaced(true);
        setCurrentStep(4); 
        setCartItems([]);
        triggerCartUpdate();
      } else {
        // Handle failed orders
        console.error('Failed to place orders:', result.failedOrders);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCreateNewAddress = async () => {
    if (!user?.id || !formData.newAddress.addressLine) return;
    
    setCreatingAddress(true);
    try {
      const result = await createCustomerAddress({
        userId: user.id,
        label: formData.newAddress.label || undefined,
        addressLine: formData.newAddress.addressLine,
        phone: formData.phone || undefined,
        latitude: formData.newAddress.latitude,
        longitude: formData.newAddress.longitude,
        isDefault: formData.newAddress.isDefault,
      });
      
      if (result.success) {
        // Reload addresses and select the new one
        await loadCustomerData();
        setFormData(prev => ({
          ...prev,
          selectedAddressId: result.data?.newAddress.id,
          useExistingAddress: true,
          newAddress: {
            label: '',
            addressLine: '',
            latitude: undefined,
            longitude: undefined,
            isDefault: false,
          },
        }));
      }
    } catch (error) {
      console.error('Failed to create address:', error);
    } finally {
      setCreatingAddress(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('newAddress.')) {
      const fieldName = name.replace('newAddress.', '');
      setFormData(prev => ({
        ...prev,
        newAddress: {
          ...prev.newAddress,
          [fieldName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <CustomerNav />
      <div className="max-w-5xl my-4 mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <button onClick={() => setCurrentStep(1)} disabled={currentStep === 1}>
              <StepIndicator step={1} currentStep={currentStep} label="Cart" />
            </button>
            <div className="flex-1 h-0.5 bg-gray-300 dark:bg-neutral-600 mx-2"></div>
            <button onClick={() => setCurrentStep(2)} disabled={currentStep < 2 && !canProceedFromStep(1)}>
              <StepIndicator step={2} currentStep={currentStep} label="Details" />
            </button>
            <div className="flex-1 h-0.5 bg-gray-300 dark:bg-neutral-600 mx-2"></div>
            <button onClick={() => setCurrentStep(3)} disabled={currentStep < 3 && !canProceedFromStep(2)}>
              <StepIndicator step={3} currentStep={currentStep} label="Payment" />
            </button>
            <div className="flex-1 h-0.5 bg-gray-300 dark:bg-neutral-600 mx-2"></div>
            <button onClick={() => setCurrentStep(4)} disabled={currentStep < 4}>
              <StepIndicator step={4} currentStep={currentStep} label="Confirmation" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div
          className="relative h-48 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
            {currentStep === 1 && (
              <>
                <h1 className="text-4xl font-bold mb-2">1. Review Your Cart</h1>
                <p className="text-lg">Check your items before proceeding to checkout</p>
              </>
            )}
            {currentStep === 2 && (
              <>
                <h1 className="text-4xl font-bold mb-2">2. Your Details</h1>
                <p className="text-lg">Please tell us where to send your delicious food!</p>
              </>
            )}
            {currentStep === 3 && (
              <>
                <h1 className="text-4xl font-bold mb-2">3. Payment Method</h1>
                <p className="text-lg">Choose how you'd like to pay for your order</p>
              </>
            )}
            {currentStep === 4 && (
              <>
                <h1 className="text-4xl font-bold mb-2">4. Order Confirmation</h1>
                <p className="text-lg">Your order has been placed successfully!</p>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Step Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Cart Review */}
              {currentStep === 1 && (
                <div>
                  {loadingCart ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your cart...</p>
                    </div>
                  ) : cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Cart is Empty</h2>
                      <p className="text-gray-600 mb-4">Add some items to your cart before proceeding to checkout.</p>
                      <button
                        onClick={() => navigate('/')}
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Review Your Items</h2>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-700 rounded-xl">
                            <img
                              src={item.menu.imageUrl}
                              alt={item.menu.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1495195134817-aeb325a55b65";
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 dark:text-white">{item.menu.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.menu.restaurant.name}</p>
                              <p className="text-sm font-medium text-violet-600">₹{parseFloat(item.unitPrice.toString()).toFixed(2)} each</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              <p className="font-bold text-gray-800 dark:text-white">
                                ₹{(item.quantity * parseFloat(item.unitPrice.toString())).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Details Form */}
              {currentStep === 2 && (
                <div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Contact Information</h2>
                    <div className="space-y-4">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Delivery Address</h2>
                    
                    {/* Address Selection Toggle */}
                    {addresses.length > 0 && (
                      <div className="mb-4">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="useExistingAddress"
                              checked={formData.useExistingAddress}
                              onChange={() => setFormData(prev => ({ ...prev, useExistingAddress: true }))}
                              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Use existing address</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="useExistingAddress"
                              checked={!formData.useExistingAddress}
                              onChange={() => setFormData(prev => ({ ...prev, useExistingAddress: false }))}
                              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Add new address</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Existing Address Selection */}
                    {formData.useExistingAddress && addresses.length > 0 && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {addresses.map((address) => (
                            <label
                              key={address.id}
                              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                formData.selectedAddressId === address.id
                                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                  : "border-gray-200 dark:border-neutral-600 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="selectedAddressId"
                                value={address.id}
                                checked={formData.selectedAddressId === address.id}
                                onChange={(e) => setFormData(prev => ({ ...prev, selectedAddressId: Number(e.target.value) }))}
                                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 mt-1"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center gap-2">
                                  {address.label && (
                                    <span className="text-sm font-medium text-violet-600">{address.label}</span>
                                  )}
                                  {address.isDefault && (
                                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">Default</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{address.addressLine}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Address Form */}
                    {!formData.useExistingAddress && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address Label (optional)
                          </label>
                          <input
                            type="text"
                            name="newAddress.label"
                            value={formData.newAddress.label}
                            onChange={handleInputChange}
                            placeholder="Home, Work, etc."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-neutral-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address *
                          </label>
                          <GooglePlacesAddressInput
                            value={formData.newAddress.addressLine}
                            onChange={(address, lat, lng) => {
                              setFormData(prev => ({
                                ...prev,
                                newAddress: {
                                  ...prev.newAddress,
                                  addressLine: address,
                                  latitude: lat,
                                  longitude: lng,
                                },
                              }));
                            }}
                            placeholder="Enter your delivery address"
                            disabled={creatingAddress}
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="newAddress.isDefault"
                            id="setAsDefault"
                            checked={formData.newAddress.isDefault}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                          />
                          <label htmlFor="setAsDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Set as default address
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={handleCreateNewAddress}
                          disabled={creatingAddress || !formData.newAddress.addressLine}
                          className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {creatingAddress ? "Adding Address..." : "Add Address"}
                        </button>
                      </div>
                    )}

                    {/* Delivery Instructions */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Any special delivery instructions..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Payment Method</h2>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800 dark:text-white">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pay when your order arrives</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div>
                  {placingOrder ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-600">Placing your order...</p>
                    </div>
                  ) : orderPlaced ? (
                    <div className="py-8">
                      {/* Success Header */}
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Order Placed Successfully!</h2>
                        <p className="text-gray-600 mb-6">Your order has been confirmed and is being prepared.</p>
                      </div>

                      {/* Order Details */}
                      <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 mb-6 border border-gray-200 dark:border-neutral-600">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Order Details</h3>
                        
                        {/* Order Items */}
                        <div className="space-y-4 mb-6">
                          {finalOrderItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-600 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 dark:text-white">{item.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Quantity: {item.quantity}
                                  </span>
                                  <span className="text-sm font-medium text-violet-600">
                                    ₹{item.price.toFixed(2)} each
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-800 dark:text-white">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Information */}
                        <div className="border-t border-gray-200 dark:border-neutral-600 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Delivery Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    Preparing
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                  <span className="text-gray-800 dark:text-white">{formData.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Address:</span>
                                  <span className="text-gray-800 dark:text-white text-right ml-2">
                                    {formData.useExistingAddress 
                                      ? addresses.find(addr => addr.id === formData.selectedAddressId)?.addressLine
                                      : formData.newAddress.addressLine
                                    }
                                  </span>
                                </div>
                                {formData.instructions && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Instructions:</span>
                                    <span className="text-gray-800 dark:text-white text-right ml-2">{formData.instructions}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Payment Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                                  <span className="text-gray-800 dark:text-white">
                                    {paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Order Time:</span>
                                  <span className="text-gray-800 dark:text-white">
                                    {new Date().toLocaleString()}
                                  </span>
                                </div>
                                {orderIds.length > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                                    <span className="text-gray-800 dark:text-white font-mono">
                                      #{orderIds[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price Summary */}
                        <div className="border-t border-gray-200 dark:border-neutral-600 mt-4 pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                              <span className="text-gray-800 dark:text-white">
                                ₹{finalOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Delivery Fee:</span>
                              <span className="text-gray-800 dark:text-white">₹3.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                              <span className="text-gray-800 dark:text-white">₹2.15</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t border-gray-200 dark:border-neutral-600 pt-2">
                              <span className="text-gray-800 dark:text-white">Total Paid:</span>
                              <span className="text-violet-600">
                                ₹{(finalOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 3.00 + 2.15).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => navigate('/')}
                          className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium"
                        >
                          Continue Browsing
                        </button>
                        <button
                          onClick={() => {
                            // Navigate to order tracking if implemented
                            console.log('Track order clicked');
                          }}
                          className="border border-violet-600 text-violet-600 px-6 py-3 rounded-lg hover:bg-violet-50 transition-colors font-medium"
                        >
                          Track Your Order
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Something went wrong</h2>
                      <p className="text-gray-600 mb-6">Unable to place your order. Please try again.</p>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceedFromStep(currentStep) || placingOrder}
                    className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === 3 ? (placingOrder ? 'Placing Order...' : 'Place Order') : 'Continue →'}
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {currentStep < 4 && (
                <OrderSummary
                  items={displayOrderItems}
                  deliveryFee={3.00}
                  tax={2.15}
                />
              )}
            </div>
        </div>
        </div>
      </div>
      
      {/* Address Error Toast */}
      {showAddressErrorToast && (
        <AddressErrorToast
          message="Please add a delivery address to continue with checkout."
          onClose={() => setShowAddressErrorToast(false)}
          onCreateProfile={() => {
            setShowAddressErrorToast(false);
            setShowManageAddressModal(true);
          }}
        />
      )}

      {/* Manage Address Modal */}
      {showManageAddressModal && (
        <ManageCustomerAddressModal
          isOpen={showManageAddressModal}
          onClose={() => setShowManageAddressModal(false)}
          userId={user?.id || 0}
          onSuccess={() => {
            loadCustomerData();
          }}
        />
      )}
    </div>
  );
};

export default CheckoutPage;