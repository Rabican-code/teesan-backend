import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { usePage } from "@inertiajs/react";

const EditStore = () => {
    const { props } = usePage();
    const store = props.store; // Inertia should pass the store data

    const [formData, setFormData] = useState({
        name: store?.name || "",
        category_ids: store?.categories?.map(c => c.id) || [],
        store_phone: store?.store_phone || "",
        address: store?.address || "",
        zone: store?.zone || "",
        latitude: store?.latitude || "",
        longitude: store?.longitude || "",
        description: store?.description || "",
        delivery_charge: store?.delivery_charge || "",
        min_delivery_charge: store?.min_delivery_charge || "",
        min_delivery_km: store?.min_delivery_km || "",
        active: store?.active || false,
        dine_in: store?.dine_in || false,
        special_discount: store?.special_discount || false,
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
                if (Array.isArray(value)) {
                    value.forEach(v => payload.append(`${key}[]`, v));
                } else {
                    payload.append(key, value);
                }
            }
        });

        axios
            .post(`/store/update/${store.id}`, payload)
            .then((res) => {
                alert("Store updated successfully!");
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Error updating store:", err);
                alert("Failed to update store.");
            });
    };

    return (
        <Sidebar>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Store</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Store Details */}
                    <div>
                        <label className="block font-medium">Store Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Insert Store Name"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Phone</label>
                        <input
                            type="text"
                            name="store_phone"
                            value={formData.store_phone}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Insert Phone Number"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Insert Address"
                        />
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            placeholder="Zone"
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            placeholder="Latitude"
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            placeholder="Longitude"
                            className="border px-3 py-2 rounded"
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
                            placeholder="Enter store description"
                        />
                    </div>

                    {/* Delivery Charges */}
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="number"
                            name="delivery_charge"
                            value={formData.delivery_charge}
                            onChange={handleChange}
                            placeholder="Delivery Charge per km"
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            type="number"
                            name="min_delivery_charge"
                            value={formData.min_delivery_charge}
                            onChange={handleChange}
                            placeholder="Minimum Delivery Charge"
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            type="number"
                            name="min_delivery_km"
                            value={formData.min_delivery_km}
                            onChange={handleChange}
                            placeholder="Minimum Delivery Km"
                            className="border px-3 py-2 rounded"
                        />
                    </div>

                    {/* Toggles */}
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                            />
                            <span>Active</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="dine_in"
                                checked={formData.dine_in}
                                onChange={handleChange}
                            />
                            <span>Dine-In</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="special_discount"
                                checked={formData.special_discount}
                                onChange={handleChange}
                            />
                            <span>Special Discount</span>
                        </label>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block font-medium mb-1">Store Image</label>
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
                            Save Store
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

export default EditStore;
