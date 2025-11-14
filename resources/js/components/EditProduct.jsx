import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { usePage } from "@inertiajs/react";
const EditProduct = () => {
    const { props } = usePage();
    const stores = props.stores || [];
    const categories = props.categories || [];
    const product = props.product;
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        discount_price: "",
        store_id: "",
        category_id: "",
        quantity: "",
        description: "",
        calories: "",
        grams: "",
        fats: "",
        proteins: "",
        publish: false,
        nonVeg: false,
        takeaway: false,
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                payload.append(key, value);
            }
        });

        if (formData.store_id) {
            payload.append("store_ids[]", formData.store_id);
        }

        axios
            .post(`/product/update/${product.id}`, payload)
            .then((res) => {
                alert("Product updated successfully!");
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Error updating product:", err);
                alert("Failed to update product.");
            });
    };


    return (
        <Sidebar>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Create Product</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Details */}
                    <div>
                        <label className="block font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Insert Name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Insert Price"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Discount Price</label>
                            <input
                                type="number"
                                name="discount_price"
                                value={formData.discount_price}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Insert Discount Price"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Store</label>
                            <select
                                name="store_id"
                                value={formData.store_id}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select Store</option>
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium">Item Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="For unlimited use: -1"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            rows={4}
                            placeholder="Enter product description"
                        />
                    </div>

                    {/* Options */}
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="publish"
                                checked={formData.publish}
                                onChange={handleChange}
                            />
                            <span>Publish</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="nonVeg"
                                checked={formData.nonVeg}
                                onChange={handleChange}
                            />
                            <span>Non-veg</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="takeaway"
                                checked={formData.takeaway}
                                onChange={handleChange}
                            />
                            <span>Takeaway Option</span>
                        </label>
                    </div>

                    {/* Ingredients */}
                    <div>
                        <h2 className="font-semibold mb-2">Ingredients</h2>
                        <div className="grid grid-cols-4 gap-4">
                            <input
                                type="text"
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
                                placeholder="Calories"
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                name="grams"
                                value={formData.grams}
                                onChange={handleChange}
                                placeholder="Grams"
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                name="fats"
                                value={formData.fats}
                                onChange={handleChange}
                                placeholder="Fats"
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                name="proteins"
                                value={formData.proteins}
                                onChange={handleChange}
                                placeholder="Proteins"
                                className="border px-3 py-2 rounded"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block font-medium mb-1">Product Image</label>
                        <div className="flex items-center space-x-4">
                            {formData.image && (
                                <img
                                    src={URL.createObjectURL(formData.image)}
                                    alt="Preview"
                                    className="w-20 h-20 rounded object-cover border"
                                />
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-600 file:text-white
                  hover:file:bg-red-700"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-6 py-2 rounded"
                        >
                            Save Product
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-6 py-2 rounded"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </Sidebar>
    );
};

export default EditProduct;
