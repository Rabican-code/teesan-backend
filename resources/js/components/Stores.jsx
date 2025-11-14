import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-dt";
import Sidebar from "./Sidebar";
import axios from "axios";
import { Link } from "@inertiajs/react";

const Stores = () => {
    const [stores, setStores] = useState([]);

    // Fetch stores from API
    useEffect(() => {
        axios
            .get("/api/stores")
            .then((response) => {
                console.log("Fetched stores:", response.data);
                setStores(response.data);
            })
            .catch((error) => {
                console.error("Error fetching stores:", error);
            });
    }, []);

    // Initialize DataTable after data is loaded
    useEffect(() => {
        if (stores.length === 0) return;

        const timeout = setTimeout(() => {
            const table = $("#storeTable");
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().destroy();
            }
            table.DataTable({
                destroy: true,
                responsive: true,
                autoWidth: false,
                columns: [null, null, null, null, null, null, null, null],
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [stores]);

    return (
        <Sidebar>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">All Stores</h1>
                </div>

                {/* Button Group */}
                <div className="flex space-x-2 mb-6">
                    <button className="bg-red-600 text-white px-4 py-2 rounded">
                        <i className="fa fa-list mr-2"></i> Store List
                    </button>

                    <Link href="/create-store-page">
                        <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
                            <i className="fa fa-plus mr-2"></i> Add Store
                        </button>
                    </Link>
                </div>

                {/* DataTable */}
                <table id="storeTable" className="display w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Wallet History</th>
                            <th>Products</th>
                            <th>Orders</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(stores) && stores.length > 0 ? (
                            stores.map((store, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={store.image || "https://via.placeholder.com/48?text=No+Image"}
                                            alt="store"
                                            className="w-12 h-12 rounded object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/48?text=No+Image";
                                            }}
                                        />
                                    </td>
                                    <td>{store.name}</td>
                                    <td>{store.phone || "N/A"}</td>
                                    <td>{store.created_at}</td>
                                    <td>{store.wallet_history ?? "—"}</td>
                                    <td>{store.products}</td>
                                    <td>{store.orders}</td>
                                    <td>
                                        <Link href={`/store/edit/${store.id}`}>
                                            <button className="px-2 py-1 bg-blue-500 text-white rounded">
                                                Edit
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No stores found or still loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Sidebar>
    );
};

export default Stores;
