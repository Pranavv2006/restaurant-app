import { useEffect, useState } from "react";
import { getCustomerOrders, cancelOrder, type OrdersData } from "../../services/CustomerService";
import Modal from "./Modal";

interface Props {
    userId: number;
}

const OrderSection = ({ userId }: Props) => {
    const [orders, setOrders] = useState<OrdersData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterDuration, setFilterDuration] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrdersData | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setError(null);
                const response = await getCustomerOrders(userId);
                setOrders(response);
            } catch (error: any) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again.");
            } 
        };

        if (userId) {
            fetchOrders();
        }

        const intervalId = setInterval(fetchOrders, 5000);

        return () => clearInterval(intervalId);
    }, [userId]);

    // Helper functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return `₹${price.toFixed(2)}`;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'on_the_way':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'delivered':
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'preparing':
                return (
                    <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                    </svg>
                );
            case 'on_the_way':
                return (
                    <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                    </svg>
                );
            case 'delivered':
                return (
                    <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                    </svg>
                );
            case 'cancelled':
                return (
                    <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const canCancelOrder = (status: string) => {
        return ['pending', 'preparing'].includes(status.toLowerCase());
    };

    const canReorder = (status: string) => {
        return ['delivered', 'cancelled'].includes(status.toLowerCase());
    };

    const handleCancelOrder = (order: OrdersData) => {
        setSelectedOrder(order);
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        if (!selectedOrder) return;
        
        setCancellingOrderId(selectedOrder.id);
        setShowCancelModal(false);
        
        try {
            const result = await cancelOrder(selectedOrder.id);
            
            if (result.success) {
                // Update the local orders state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === selectedOrder.id 
                            ? { ...order, status: 'Cancelled' }
                            : order
                    )
                );
                
                alert('Order cancelled successfully!');
            } else {
                alert(result.message || 'Failed to cancel order. Please try again.');
            }
        } catch (error: any) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        } finally {
            setCancellingOrderId(null);
            setSelectedOrder(null);
        }
    };

    const handleReorder = async (order: OrdersData) => {
        console.log('Reorder:', order);
        alert('Reorder functionality will be implemented soon');
    };

    const handleViewDetails = (order: OrdersData) => {
        console.log('Order data received:', order);
        console.log('Order items:', order.orderItems);
        if (order.orderItems && order.orderItems.length > 0) {
            console.log('First item:', order.orderItems[0]);
            console.log('First item menu:', order.orderItems[0].menu);
        }
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const filteredOrders = orders.filter(order => {
        if (filterStatus !== 'all' && !order.status.toLowerCase().includes(filterStatus)) {
            return false;
        }
        
        if (filterDuration !== 'all') {
            const orderDate = new Date(order.orderDate);
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
            
            switch (filterDuration) {
                case 'week':
                    return daysDiff <= 7;
                case 'month':
                    return daysDiff <= 30;
                case '3months':
                    return daysDiff <= 90;
                case '6months':
                    return daysDiff <= 180;
                case 'year':
                    return daysDiff <= 365;
                default:
                    return true;
            }
        }
        
        return true;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);


    if (error) {
        return (
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center py-12">
                            <div className="text-red-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Orders</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-5xl">
                    <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            My orders ({filteredOrders.length})
                        </h2>

                        <div className="mt-6 gap-6 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                            <div>
                                <select 
                                    id="order-type" 
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                >
                                    <option value="all">All orders</option>
                                    <option value="pending">Pending</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <span className="inline-block text-gray-500 dark:text-gray-400 mx-3"> from </span>

                            <div>
                                <select 
                                    id="duration"
                                    value={filterDuration}
                                    onChange={(e) => setFilterDuration(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                >
                                    <option value="all">All time</option>
                                    <option value="week">This week</option>
                                    <option value="month">This month</option>
                                    <option value="3months">Last 3 months</option>
                                    <option value="6months">Last 6 months</option>
                                    <option value="year">This year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flow-root sm:mt-8">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Orders Found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {filterStatus !== 'all' || filterDuration !== 'all' 
                                        ? 'No orders match your current filters.' 
                                        : "You haven't placed any orders yet."
                                    }
                                </p>
                                <button 
                                    onClick={() => {
                                        setFilterStatus('all');
                                        setFilterDuration('all');
                                    }}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    {filterStatus !== 'all' || filterDuration !== 'all' ? 'Clear Filters' : 'Start Shopping'}
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-5 text-sm font-semibold text-gray-500 dark:text-gray-400 py-3 border-b border-gray-200 dark:border-gray-700 mt-6">
                                    <span>Date</span>
                                    <span>Restaurant</span>
                                    <span>Price</span>
                                    <span>Status</span>
                                    <span className="text-right">Actions</span>
                                </div>
                                {currentOrders.map((order) => (
                                    <div key={order.id} className="sm:grid sm:grid-cols-4 lg:grid-cols-5 items-center py-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="text-gray-900 dark:text-white">
                                            {formatDate(order.orderDate)}
                                        </div>
                                        <div className="text-gray-900 dark:text-white">
                                            {order.restaurant.name}
                                        </div>
                                        <div className="text-gray-900 dark:text-white">
                                            {formatPrice(order.total)}
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => handleViewDetails(order)}
                                                className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                                            >
                                                View
                                            </button>

                                            {canCancelOrder(order.status) ? (
                                                <button
                                                    onClick={() => handleCancelOrder(order)}
                                                    disabled={cancellingOrderId === order.id}
                                                    className="rounded-lg border border-red-600 px-2 py-1 text-sm text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            ) : canReorder(order.status) ? (
                                                <button
                                                    onClick={() => handleReorder(order)}
                                                    className="rounded-lg bg-primary-700 px-2 py-1 text-sm text-white hover:bg-primary-800"
                                                >
                                                    Reorder
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {filteredOrders.length > itemsPerPage && (
                        <nav className="mt-6 flex items-center justify-center sm:mt-8" aria-label="Page navigation">
                            <ul className="flex h-8 items-center -space-x-px text-sm">
                                <li>
                                    <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                    </svg>
                                    </button>
                                </li>

                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index}>
                                    <button 
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`flex h-8 items-center justify-center border px-3 leading-tight ${
                                        currentPage === index + 1
                                            ? 'z-10 border-primary-300 bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                    </li>
                                ))}

                                <li>
                                    <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                    </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>

            {/* Cancel Order Confirmation Modal */}
            <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Cancel Order
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Are you sure you want to cancel this order from {selectedOrder?.restaurant.name}? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={confirmCancelOrder}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Cancel Order
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Order Details Modal */}
            <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
                {selectedOrder && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Order Details
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order ID:</span>
                                <span className="text-sm text-gray-900 dark:text-white">#{selectedOrder.id}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant:</span>
                                <span className="text-sm text-gray-900 dark:text-white">{selectedOrder.restaurant.name}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</span>
                                <span className="text-sm text-gray-900 dark:text-white">{formatDate(selectedOrder.orderDate)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                                <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Address:</span>
                                <span className="text-sm text-gray-900 dark:text-white break-words max-w-xs">{selectedOrder.deliveryAddress}</span>
                            </div>
                            
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Order Items:</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                                        selectedOrder.orderItems.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {item.menu?.name || 'Unknown Item'} x{item.quantity}
                                                </span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {formatPrice(item.unitPrice * item.quantity)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            No items found for this order.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                                    <span className="text-gray-900 dark:text-white">{formatPrice(selectedOrder.total - (selectedOrder.deliveryFee || 0))}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 dark:text-gray-300">Delivery Fee:</span>
                                    <span className="text-gray-900 dark:text-white">{formatPrice(selectedOrder.deliveryFee || 0)}</span>
                                </div>
                                <div className="flex justify-between text-base font-medium border-t pt-2">
                                    <span className="text-gray-900 dark:text-white">Total:</span>
                                    <span className="text-gray-900 dark:text-white">{formatPrice(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default OrderSection;