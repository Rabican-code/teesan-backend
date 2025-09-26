import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-dt";
import SidebarLayout from "./Sidebar";

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch orders from backend
        fetch("/api/orders")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Orders:", data);
                setOrders(data);

                setTimeout(() => {
                    if (!$.fn.DataTable.isDataTable("#ordersTable")) {
                        $("#ordersTable").DataTable();
                    }
                }, 300);
            })
            .catch((err) => console.error("Error fetching orders:", err));
    }, []);


    return (
        <SidebarLayout>
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Orders</h1>
                <input
                    type="date"
                    className="border rounded px-3 py-2"
                    defaultValue={new Date().toISOString().split("T")[0]}
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <SummaryCard title="Orders received" value={orders.length} />
                <SummaryCard title="Orders completed" value={0} />
                <SummaryCard title="Orders rejected" value={0} />
                <SummaryCard title="Other orders" value={0} />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">
                        ✓ Auto-refresh after 1 minute
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded px-3 py-1"
                    />
                </div>

                <table id="ordersTable" className="display w-full">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Store</th>
                            <th>Status</th>
                            <th>Patner</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td>
                                    <a href={`/orders/edit/${order.order_id}`} className="text-blue-500 underline">
                                        #{order.order_id ?? "N/A"}
                                    </a>
                                </td>
                                <td>{order.store}</td>
                                <td>{order.status}</td>
                                <td>{order.partner || "No Partner"}</td>
                                <td>{order.client}</td>
                                <td>{order.date}</td>
                                <td className="text-green-600 font-semibold">₹{order.amount}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </SidebarLayout>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-xl font-bold">{value}</p>
            <p className="text-gray-600">{title}</p>
        </div>
    );
}
