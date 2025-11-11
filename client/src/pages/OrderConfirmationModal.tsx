import { useEffect, useRef} from "react";
import { FaMoneyBill, FaShoppingCart, FaTimes, FaDownload } from "react-icons/fa";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet} from "@react-pdf/renderer";

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

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #333',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: '1px solid #eee',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  itemQuantity: {
    fontSize: 10,
    color: '#666',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 11,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 11,
  },
  summaryValue: {
    fontSize: 11,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 5,
    borderTop: '2px solid #333',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alert: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    marginBottom: 15,
    borderLeft: '4px solid #F59E0B',
  },
  alertText: {
    fontSize: 10,
    color: '#92400E',
  },
});

const OrderPDF = ({ orderData }: { orderData: OrderDetails }) => {
  const calculateSubtotal = () =>
    orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateTotal = () => 
    calculateSubtotal() + (orderData.deliveryFee ?? 3.0) + (orderData.tax ?? 2.15);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Order Confirmation</Text>
          <Text style={styles.subtitle}>Order placed successfully!</Text>
          {orderData.orderIds.length > 0 && (
            <Text style={styles.subtitle}>Order ID: #{orderData.orderIds[0]}</Text>
          )}
          <Text style={styles.subtitle}>Order Time: {new Date().toLocaleString()}</Text>
        </View>

        {/* Alert */}
        <View style={styles.alert}>
          <Text style={styles.alertText}>Order Status: Preparing</Text>
          <Text style={styles.alertText}>Your order is being prepared and will be delivered soon.</Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {orderData.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              </View>
              <View>
                <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                <Text style={styles.itemQuantity}>₹{item.price.toFixed(2)} each</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{orderData.phone}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{orderData.address}</Text>
            </View>
          </View>
          {orderData.instructions && (
            <View>
              <Text style={styles.infoLabel}>Special Instructions</Text>
              <Text style={styles.infoValue}>{orderData.instructions}</Text>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{calculateSubtotal().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹{(orderData.deliveryFee ?? 3.0).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>₹{(orderData.tax ?? 2.15).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{calculateTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Text style={styles.infoValue}>
            {orderData.paymentMethod === "cash" ? "Cash on Delivery" : orderData.paymentMethod}
          </Text>
          <Text style={styles.itemQuantity}>Payment will be collected upon delivery</Text>
        </View>
      </Page>
    </Document>
  );
};

const OrderConfirmationModal = ({
  open,
  orderData,
  onClose,
  onContinueBrowsing,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
          <div ref={modalRef} className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-700">
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
              <PDFDownloadLink
                document={<OrderPDF orderData={orderData} />}
                fileName={`order-${orderData.orderIds[0] || 'confirmation'}.pdf`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {({ loading }) => (
                  <>
                    <FaDownload className="mr-2 h-4 w-4" />
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
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