import React, { useEffect, useState } from "react";
import { getCustomerOrders, type OrdersData } from "../../services/CustomerService";

interface Props {
    userId: number;
}

const OrderSection: React.FC<Props> = ({ userId }) => {
    const [orders, setOrders] = useState<OrdersData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterDuration, setFilterDuration] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
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

    const handleCancelOrder = async (orderId: number) => {
        console.log('Cancel order:', orderId);
        alert('Cancel order functionality will be implemented soon');
    };

    const handleReorder = async (order: OrdersData) => {
        console.log('Reorder:', order);
        alert('Reorder functionality will be implemented soon');
    };

    const handleViewDetails = (orderId: number) => {
        console.log('View details for order:', orderId);
        alert('Order details view will be implemented soon');
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
                                {currentOrders.map((order) => (
                                    <div key={order.id} className="flex flex-wrap items-center gap-y-4 py-6">
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Order ID:</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                <button 
                                                    onClick={() => handleViewDetails(order.id)}
                                                    className="hover:underline hover:text-primary-600"
                                                >
                                                    #{order.id.toString().padStart(8, '0')}
                                                </button>
                                            </dd>
                                        </dl>

                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date:</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                {formatDate(order.orderDate)}
                                            </dd>
                                        </dl>

                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Restaurant:</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                {order.restaurant.name}
                                            </dd>
                                        </dl>

                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Price:</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(order.total)}
                                            </dd>
                                        </dl>

                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
                                            <dd className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </dd>
                                        </dl>

                                        <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                                            <button 
                                                onClick={() => handleViewDetails(order.id)}
                                                className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                                            >
                                                View details
                                            </button>
                                            {canCancelOrder(order.status) ? (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                                                >
                                                    Cancel order
                                                </button>
                                            ) : canReorder(order.status) ? (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleReorder(order)}
                                                    className="w-full rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:w-auto"
                                                >
                                                    Order again
                                                </button>
                                            ) : (
                                                <div className="w-full lg:w-auto" /> // Empty space for consistent layout
                                            )}
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
        </section>
    );
};

export default OrderSection;