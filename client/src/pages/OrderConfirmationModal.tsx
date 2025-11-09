import { useEffect } from "react";
import { FaMoneyBill, FaShoppingCart, FaTimes } from "react-icons/fa";

interface FinalOrderItems {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetails {
  items: FinalOrderItems[];
  phone: string;
  address: string;
  instructions?: string;
  paymentMethod: string;
  orderIds: number[];
  deliveryFee?: number;
  tax?: number;
}

type Props = {
  open: boolean;
  orderData: OrderDetails | null;
  onClose: () => void;
  onContinueBrowsing?: () => void;
};

const OrderConfirmationModal = ({
  open,
  orderData,
  onClose,
  onContinueBrowsing,
}: Props) => {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !orderData) return null;

  const calculateSubtotal = () =>
    orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateTotal = () => calculateSubtotal() + (orderData.deliveryFee ?? 3.0) + (orderData.tax ?? 2.15);

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal panel */}
      <div className="relative z-10 max-w-3xl w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Confirmation
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Order placed successfully!</p>
              {orderData.orderIds.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-300 font-mono mt-1">
                  Order ID: #{orderData.orderIds[0]}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 dark:text-gray-200 text-right">
                <div>Order Time</div>
                <div className="font-medium">{new Date().toLocaleString()}</div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close order modal"
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Status / alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4 rounded-md">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-yellow-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Order Status: Preparing</h3>
                <p className="text-sm text-yellow-700 mt-1">Your order is being prepared and will be delivered soon.</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img
                    src={item.image ?? "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-100">₹{item.price.toFixed(2)} each</div>
                        <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Quantity: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
                <div>
                  <div className="text-xs uppercase text-gray-500 dark:text-gray-300">Contact</div>
                  <div className="mt-1">{orderData.phone}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-gray-500 dark:text-gray-300">Address</div>
                  <div className="mt-1">{orderData.address}</div>
                </div>
                {orderData.instructions && (
                  <div className="md:col-span-2">
                    <div className="text-xs uppercase text-gray-500 dark:text-gray-300">Special Instructions</div>
                    <div className="mt-1">{orderData.instructions}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{(orderData.deliveryFee ?? 3.0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{(orderData.tax ?? 2.15).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total Paid</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Payment</h3>
              <div className="flex items-center gap-3">
                <FaMoneyBill className="h-5 w-5 text-gray-400 dark:text-gray-100" />
                <div>
                  <div className="font-medium">{orderData.paymentMethod === "cash" ? "Cash on Delivery" : orderData.paymentMethod}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Payment will be collected upon delivery</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-300">Thank you for ordering!</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onContinueBrowsing?.();
                  onClose();
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaShoppingCart className="mr-2 h-4 w-4" />
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;