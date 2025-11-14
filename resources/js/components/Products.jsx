import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-dt";
import Sidebar from "./Sidebar";
import axios from "axios";
import { Link } from '@inertiajs/react';

const Products = () => {
    const [products, setProducts] = useState([]);

    // Fetch products from API
    useEffect(() => {
        axios.get("/api/products")
            .then(response => {
                console.log("Fetched products:", response.data);
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Initialize DataTable after data is loaded
    useEffect(() => {
        if (products.length === 0) return;

        const timeout = setTimeout(() => {
            const table = $("#productTable");
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().destroy();
            }
            table.DataTable({
                destroy: true,
                responsive: true,
                autoWidth: false,
                columns: [null, null, null, null, null, null, null]
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [products]);

    return (
        <Sidebar>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">All Products</h1>
                </div>

                {/* Button Group */}
                <div className="flex space-x-2 mb-6">
                    <button className="bg-red-600 text-white px-4 py-2 rounded">
                        <i className="fa fa-list mr-2"></i> Product List
                    </button>

                    <Link href="/products/createProductsPage">
                        <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
                            <i className="fa fa-plus mr-2"></i> Add Product
                        </button>
                    </Link>
                </div>

                {/* DataTable */}
                <table id="productTable" className="display w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Store</th>
                            <th>Category</th>
                            <th>Published</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(products) && products.length > 0 ? (
                            products.map((product, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={product.image || "https://via.placeholder.com/48?text=No+Image"}
                                            alt="product"
                                            className="w-12 h-12 rounded object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/48?text=No+Image";
                                            }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.store}</td>
                                    <td>{product.category}</td>
                                    <td>{product.is_published}</td>
                                    <td>
                                        <Link href={`/product/edit/${product.id}`}>
                                            <button className="px-2 py-1 bg-blue-500 text-white rounded">
                                                Edit
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">
                                    No products found or still loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Sidebar>
    );
};

export default Products;
