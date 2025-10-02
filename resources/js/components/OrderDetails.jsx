import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import Sidebar from "./Sidebar";

// Helper component for detail rows
const DetailRow = ({ label, value, className = "" }) => (
    <div className={`flex justify-between py-2 border-b-2 border-dotted border-gray-300 ${className}`}>
        <span className="font-medium text-gray-600">{label}</span>
        <span className="text-gray-800">{value}</span>
    </div>
);

export default function OrderDetailsPage() {
    const { props } = usePage();
    const { order, user, store, products, drivers, flash, deliveryPartner } = props;

    const [status, setStatus] = useState(order?.order_status || "Order Placed");
    const [partner, setPartner] = useState(order?.delivery_partner?.toString() || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(flash?.success || "");

    useEffect(() => {
        console.log('OrderDetails Props:', {
            order,
            user,
            store,
            products,
            drivers,
            deliveryPartner
        });

        // Log specific fields from order
        if (order) {
            console.log('Order Fields:', {
                order_id: order.order_id,
                order_status: order.order_status,
                accepted_at: order.accepted_at,
                in_transit_at: order.in_transit_at,
                completed_at: order.completed_at,
                payment_method: order.payment_method,
                created_at: order.created_at
            });
        }
    }, [order, user, store, products, drivers, deliveryPartner]);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
        }
    }, [flash]);

    // Sync partner state with order's delivery_partner when order loads
    useEffect(() => {
        if (order?.delivery_partner) {
            setPartner(order.delivery_partner.toString());
        } else {
            setPartner("");
        }
    }, [order]);

    const updateOrderStatus = async () => {
        setLoading(true);
        setMessage("");

        const updateData = {
            order_status: status,
            delivery_partner: partner,
        };

        // Update timestamps based on status
        const now = new Date().toISOString();
        if (status === 'Order Accepted' && !order.accepted_at) {
            updateData.accepted_at = now;
        }
        if (status === 'In Transit' && !order.in_transit_at) {
            updateData.in_transit_at = now;
        }
        if (status === 'Completed' && !order.completed_at) {
            updateData.completed_at = now;
        }

        console.log('Sending update data:', updateData);

        router.post(`/orders/update-status/${order.order_id}`, updateData, {
            preserveScroll: true,
            onSuccess: () => {
                setMessage("Order updated successfully!");
                console.log('Update successful');
                // Refresh the page to show updated data
                window.location.reload();
            },
            onError: (errors) => {
                setMessage(errors.error || "Failed to update order.");
                console.error('Update errors:', errors);
            },
            onFinish: () => setLoading(false),
        });
    };

    const subtotal = products.reduce((acc, product) => acc + parseFloat(product.price) * product.pivot.quantity, 0);
    const discount = 20.00; // Placeholder
    const deliveryCharge = 29.00; // Placeholder
    const tip = 20.00; // Placeholder
    const total = subtotal - discount + deliveryCharge + tip;

    return (
        <Sidebar>
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                    <div className="text-sm text-gray-600">
                        Dashboard / Orders / Edit Order
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                        {/* General Details */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">General Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <DetailRow label="Date Created :" value={new Date(order.created_at).toLocaleString()} />
                                <DetailRow label="Accepted at :" value={order.accepted_at ? new Date(order.accepted_at).toLocaleString() : "--"} />
                                <DetailRow label="In Transit at :" value={order.in_transit_at ? new Date(order.in_transit_at).toLocaleString() : "--"} />
                                <DetailRow label="Completed at :" value={order.completed_at ? new Date(order.completed_at).toLocaleString() : "--"} />
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Payment Method :</span>
                                    <span className="px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-800 rounded-full">{order.payment_method || "CASH ON DELIVERY"}</span>
                                </div>
                                <DetailRow label="Order Type :" value="Order Delivery" />
                                <DetailRow label="Estimated Prepare Time :" value="13 hours 50 minutes" />
                            </div>
                        </div>

                        {/* Status Update */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Order Accepted">Order Accepted</option>
                                    <option value="Order Shipped">Order Shipped</option>
                                    <option value="Order Rejected">Order Rejected</option>
                                    <option value="Driver Rejected">Driver Rejected</option>
                                    <option value="Driver Pending">Driver Pending</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Completed">Order Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery partner</label>
                                <select
                                    value={partner}
                                    onChange={(e) => setPartner(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Select a driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} - {driver.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="self-end">
                                <button onClick={updateOrderStatus} disabled={loading} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-400">
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </div>
                        {message && <div className={`mb-4 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}

                        {/* Items Table */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-dotted border-gray-400">
                                        <th className="py-2">Items</th>
                                        <th className="py-2">Price</th>
                                        <th className="py-2">Qty</th>
                                        <th className="py-2">Extras</th>
                                        <th className="py-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id} className="border-b-2 border-dotted border-gray-200">
                                            <td className="py-4 flex items-center">
                                                <img src={product.product_image || '/placeholder.png'} alt={product.name} className="w-12 h-12 rounded-md mr-4" />
                                                <span>{product.name}</span>
                                            </td>
                                            <td>₹{parseFloat(product.price).toFixed(2)}</td>
                                            <td>x {product.pivot.quantity}</td>
                                            <td>+ ₹0.00</td>
                                            <td className="text-right">₹{(parseFloat(product.price) * product.pivot.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Order Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                            <div></div>
                            <div className="space-y-2">
                                <DetailRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} className="bg-green-50 px-2 rounded-md" />
                                <DetailRow label="Discount" value={`- ₹${discount.toFixed(2)}`} className="text-red-600" />
                                <DetailRow label="Special Offer Discount" value={`- ₹${discount.toFixed(2)}`} className="text-red-600" />
                                <DetailRow label="Delivery Charge" value={`+ ₹${deliveryCharge.toFixed(2)}`} />
                                <DetailRow label="Tip" value={`+ ₹${tip.toFixed(2)}`} />
                                <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-dotted border-gray-400 mt-2">
                                    <span>Total Amount</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <DetailRow label="Admin Commission (10%)" value={`(₹${(total * 0.1).toFixed(2)})`} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Billing Details */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Details</h3>
                            <div className="space-y-2 text-sm">
                                <DetailRow label="Name:" value={user?.name || "--"} />
                                <DetailRow label="Address:" value={user?.address || "--"} />
                                <DetailRow label="Email Address:" value={user?.email || "--"} />
                                <DetailRow label="Phone:" value={user?.phone || "--"} />

                            </div>
                        </div>

                        {/* Driver Detail */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Detail</h3>
                            <div className="space-y-2 text-sm">
                                {(() => {
                                    if (!deliveryPartner) {
                                        return (
                                            <>
                                                <DetailRow label="Name:" value="No driver assigned" />
                                                <DetailRow label="Email Address:" value="--" />
                                                <DetailRow label="Phone:" value="--" />
                                                <DetailRow label="Car Name:" value="--" />
                                                <DetailRow label="Car Number:" value="--" />
                                            </>
                                        );
                                    }
                                    return (
                                        <>
                                            <DetailRow label="Name:" value={deliveryPartner.name || "Unknown"} />
                                            <DetailRow label="Phone:" value={deliveryPartner.phone || "--"} />
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Store */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Store</h3>
                            <div className="flex items-center mb-4">
                                <img src={store.store_image || '/placeholder.png'} alt={store.name} className="w-16 h-16 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-semibold">{store.name}</h4>
                                    <p className="text-sm text-gray-600">Contact Info: {store.phone}</p>
                                    <p className="text-sm text-gray-600">Address: {store.address}</p>
                                </div>
                            </div>
                            <h4 className="font-semibold mb-2">Customer Reviews</h4>
                            <p className="text-sm text-gray-500">No Reviews Found</p>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
