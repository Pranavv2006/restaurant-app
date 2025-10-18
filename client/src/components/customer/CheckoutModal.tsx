import React, { useState, useEffect } from "react";
import {
  placeMultipleOrders,
  retrieveCustomerAddress,
  checkCustomerAddress,
  editCustomerAddress,
} from "../../services/CustomerService";

interface CartItem {
  id: number;
  quantity: number;
  menu: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
  restaurant: {
    id: number;
    name: string;
  };
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (orderId: number) => void;
}

interface DeliveryAddress {
  address: string;
  latitude?: number;
  longitude?: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const deliveryFee = 2.99;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menu.price * item.quantity,
    0
  );

  useEffect(() => {
    if (isOpen) {
      loadCustomerData();
      // Group items by restaurant
      if (cartItems.length > 0) {
        const restaurantIds = [
          ...new Set(cartItems.map((item) => item.restaurant.id)),
        ];
        console.log("🏪 Restaurants in cart:", restaurantIds);
        console.log(
          "🛒 Items per restaurant:",
          restaurantIds.map((id) => ({
            restaurantId: id,
            restaurantName: cartItems.find((item) => item.restaurant.id === id)
              ?.restaurant.name,
            itemCount: cartItems.filter((item) => item.restaurant.id === id)
              .length,
          }))
        );
      }
    }
  }, [isOpen, cartItems]);

  const loadCustomerData = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      const userId = user.id;

      // Set customerId to userId (PlaceOrderService expects user ID, not customer profile ID)
      setCustomerId(userId);

      // Check customer address data
      const addressResponse = await checkCustomerAddress(userId);

      if (
        addressResponse.success &&
        addressResponse.hasAddress &&
        addressResponse.data
      ) {
        // Get customer address
        const addressData = await retrieveCustomerAddress(
          addressResponse.data.id
        );
        if (addressData) {
          setDeliveryAddress(addressData);
        }
      }
    } catch (error) {
      console.error("Error loading customer data:", error);
    }
  };

  const handleAddressEdit = async () => {
    if (!customerId) return;

    try {
      setIsLoading(true);
      const result = await editCustomerAddress({
        customerId,
        address: deliveryAddress.address,
        latitude: deliveryAddress.latitude,
        longitude: deliveryAddress.longitude,
      });

      if (result.success) {
        setIsEditingAddress(false);
      }
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!customerId) {
      alert("Missing customer information");
      return;
    }

    try {
      setIsLoading(true);

      console.log("🍽️ Placing orders for multiple restaurants...");

      // Use the helper function to place multiple orders
      const result = await placeMultipleOrders(customerId, cartItems);

      // Handle results
      if (result.totalSuccessful > 0 && result.totalFailed === 0) {
        // All orders successful
        alert(
          `🎉 All ${
            result.totalSuccessful
          } orders placed successfully! Order IDs: ${result.successfulOrders.join(
            ", "
          )}`
        );
        onOrderSuccess(result.successfulOrders[0]);
        onClose();
        setCurrentStep(1);
      } else if (result.totalSuccessful > 0 && result.totalFailed > 0) {
        // Partial success
        const failedMessages = result.failedOrders
          .map((f) => `${f.restaurantName}: ${f.error}`)
          .join("\n");
        alert(
          `⚠️ ${
            result.totalSuccessful
          } orders placed successfully (IDs: ${result.successfulOrders.join(
            ", "
          )}).\n\n${result.totalFailed} orders failed:\n${failedMessages}`
        );
        onOrderSuccess(result.successfulOrders[0]);
        onClose();
        setCurrentStep(1);
      } else {
        // All failed
        const failedMessages = result.failedOrders
          .map((f) => `${f.restaurantName}: ${f.error}`)
          .join("\n");
        alert(`❌ All orders failed:\n${failedMessages}`);
      }
    } catch (error) {
      console.error("Error placing orders:", error);
      alert("Failed to place orders");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "inactive";
  };

  const renderStepIndicator = (step: number, label: string) => {
    const status = getStepStatus(step);

    return (
      <li className="flex items-center gap-x-2 shrink basis-0 flex-1 group">
        <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
          <span
            className={`size-7 flex justify-center items-center shrink-0 font-medium rounded-full ${
              status === "completed"
                ? "bg-teal-500 text-white"
                : status === "active"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white"
            }`}
          >
            {status === "completed" ? (
              <svg
                className="shrink-0 size-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              step
            )}
          </span>
          <span className="ms-2 text-sm font-medium text-gray-800 dark:text-neutral-200">
            {label}
          </span>
        </span>
        <div
          className={`w-full h-px flex-1 group-last:hidden ${
            status === "completed"
              ? "bg-teal-600"
              : status === "active"
              ? "bg-violet-600"
              : "bg-gray-200 dark:bg-neutral-700"
          }`}
        ></div>
      </li>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Checkout
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Stepper */}
          <div>
            {/* Stepper Nav */}
            <ul className="relative flex flex-row gap-x-2 mb-6">
              {renderStepIndicator(1, "Address")}
              {renderStepIndicator(2, "Review")}
              {renderStepIndicator(3, "Payment")}
            </ul>

            {/* Stepper Content */}
            <div className="mt-5 sm:mt-8">
              {/* Step 1: Address */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delivery Address
                  </h3>

                  <div className="p-4 border border-gray-200 rounded-lg dark:border-neutral-700">
                    {isEditingAddress ? (
                      <div className="space-y-4">
                        <textarea
                          value={deliveryAddress.address}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              address: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                          rows={3}
                          placeholder="Enter your delivery address"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddressEdit}
                            disabled={isLoading}
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                          >
                            {isLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setIsEditingAddress(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900 dark:text-white">
                            {deliveryAddress.address || "No address saved"}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsEditingAddress(true)}
                          className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Review Order */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Review Your Order
                  </h3>

                  {/* Group items by restaurant */}
                  {Object.entries(
                    cartItems.reduce((acc, item) => {
                      const restaurantId = item.restaurant.id;
                      if (!acc[restaurantId]) {
                        acc[restaurantId] = {
                          restaurantName: item.restaurant.name,
                          items: [],
                        };
                      }
                      acc[restaurantId].items.push(item);
                      return acc;
                    }, {} as Record<number, { restaurantName: string; items: typeof cartItems }>)
                  ).map(([restaurantId, restaurantData]) => (
                    <div key={restaurantId} className="space-y-3">
                      {/* Restaurant Header */}
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-neutral-700">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-violet-600 font-semibold text-sm">
                            🍽️
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {restaurantData.restaurantName}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                          ({restaurantData.items.length} items)
                        </span>
                      </div>

                      {/* Items for this restaurant */}
                      <div className="space-y-2 ml-4">
                        {restaurantData.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.menu.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-neutral-400">
                                Qty: {item.quantity} × ₹{item.menu.price}
                              </p>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              ₹{(item.quantity * item.menu.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 dark:border-neutral-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-neutral-400">
                        Food Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    {(() => {
                      const restaurantCount = new Set(
                        cartItems.map((item) => item.restaurant.id)
                      ).size;
                      const totalDeliveryFee = deliveryFee * restaurantCount;
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-neutral-400">
                              Delivery Fee ({restaurantCount} restaurant
                              {restaurantCount > 1 ? "s" : ""})
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              ₹{totalDeliveryFee.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 dark:border-neutral-700">
                            <span className="text-gray-900 dark:text-white">
                              Total
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              ₹{(subtotal + totalDeliveryFee).toFixed(2)}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Method
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">
                          Pay when your order arrives
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-violet-800">
                    <p className="text-sm text-violet-800 dark:text-blue-200">
                      Your orders will be delivered to:{" "}
                      {deliveryAddress.address}
                    </p>
                    {(() => {
                      const restaurantCount = new Set(
                        cartItems.map((item) => item.restaurant.id)
                      ).size;
                      const totalDeliveryFee = deliveryFee * restaurantCount;
                      const finalTotal = subtotal + totalDeliveryFee;
                      return (
                        <>
                          <p className="text-sm text-violet-700 dark:text-blue-300 mt-1">
                            {restaurantCount} separate order
                            {restaurantCount > 1 ? "s" : ""} from{" "}
                            {restaurantCount} restaurant
                            {restaurantCount > 1 ? "s" : ""}
                          </p>
                          <p className="text-lg font-semibold text-violet-900 dark:text-blue-100 mt-1">
                            Total: ₹{finalTotal.toFixed(2)}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Button Group */}
              <div className="mt-6 flex justify-between items-center gap-x-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="py-2 px-4 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                  Back
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === 1 && !deliveryAddress.address}
                    className="py-2 px-4 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Next
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isLoading || !deliveryAddress.address}
                    className="py-2 px-4 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isLoading ? "Placing Order..." : "Place Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
