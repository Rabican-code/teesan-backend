import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";

const CreateStore = () => {
    const [formData, setFormData] = useState({
        // Admin Config
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        image: null,

        // Store Details
        name: "",
        category: "",
        store_phone: "",
        address: "",

        // Location
        zone: "",
        latitude: "",
        longitude: "",
        description: "",

        // Options
        services: {
            wifi: false,
            breakfast: false,
            dinner: false,
            live_music: false,
            outdoor: false,
            reservations: false,
            vegetarian: false,
        },

        // Delivery
        delivery_charge: 2,
        min_delivery_charge: "",
        min_delivery_km: "",

        // Toggles
        active: true,
        dine_in: false,
        special_discount: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name in formData.services) {
            setFormData((prev) => ({
                ...prev,
                services: { ...prev.services, [name]: checked },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
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
            if (key === "services") {
                Object.entries(value).forEach(([sKey, sVal]) =>
                    payload.append(`services[${sKey}]`, sVal)
                );
            } else {
                payload.append(key, value);
            }
        });

        axios
            .post("/api/create-stores", payload)
            .then((res) => {
                alert("Store created successfully!");
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Error creating store:", err);
                alert("Failed to create store.");
            });
    };

    return (
        <Sidebar>
            <div className="p-6 space-y-8">
                <h1 className="text-2xl font-bold">Create Store</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Admin Configurations */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Admin Configurations</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="first_name" placeholder="First Name" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input name="last_name" placeholder="Last Name" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input name="phone" placeholder="Phone" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input type="file" name="image" onChange={handleFileChange} className="border px-3 py-2 rounded" />
                        </div>
                    </section>

                    {/* Store Details */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Store Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="name" placeholder="Store Name" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input name="category" placeholder="Category" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input name="store_phone" placeholder="Store Phone" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input name="address" placeholder="Address" onChange={handleChange} className="border px-3 py-2 rounded col-span-2" />
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Location</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <input name="zone" placeholder="Zone" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input name="latitude" placeholder="Latitude" onChange={handleChange} className="border px-3 py-2 rounded" />
                            <input name="longitude" placeholder="Longitude" onChange={handleChange} className="border px-3 py-2 rounded" />
                        </div>
                        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border px-3 py-2 rounded mt-4" />
                    </section>

                    {/* Services */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Services</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(formData.services).map((service) => (
                                <label key={service} className="flex items-center space-x-2">
                                    <input type="checkbox" name={service} checked={formData.services[service]} onChange={handleChange} />
                                    <span className="capitalize">{service.replace("_", " ")}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Delivery Charges */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Delivery Charges</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="number" name="delivery_charge" value={formData.delivery_charge} onChange={handleChange} placeholder="Per km" className="border px-3 py-2 rounded" />
                            <input type="number" name="min_delivery_charge" onChange={handleChange} placeholder="Minimum Charge" className="border px-3 py-2 rounded" />
                            <input type="number" name="min_delivery_km" onChange={handleChange} placeholder="Within Km" className="border px-3 py-2 rounded" />
                        </div>
                    </section>

                    {/* Toggles */}
                    <section className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                            <span>Active</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="dine_in" checked={formData.dine_in} onChange={handleChange} />
                            <span>Enable Dine-In</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="special_discount" checked={formData.special_discount} onChange={handleChange} />
                            <span>Enable Special Discount</span>
                        </label>
                    </section>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded">
                            Save
                        </button>
                        <button type="button" className="bg-gray-500 text-white px-6 py-2 rounded">
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </Sidebar>
    );
};

export default CreateStore;
