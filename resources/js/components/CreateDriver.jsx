import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";

const CreateDriver = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        zone: "",
        latitude: "",
        longitude: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = new FormData();

        // Combine first and last name into one 'name' field
        const fullName = `${formData.first_name} ${formData.last_name}`.trim();
        payload.append("name", fullName);

        // Append other fields
        payload.append("email", formData.email);
        payload.append("password", formData.password);
        payload.append("phone", formData.phone);
        payload.append("zone", formData.zone);
        payload.append("latitude", formData.latitude);
        payload.append("longitude", formData.longitude);
        payload.append("active", true); // optional default
        payload.append("online", false); // optional default
        payload.append("total_orders", 0); // optional default

        if (formData.image) {
            payload.append("image", formData.image);
        }

        axios.post("/api/creat-drivers", payload)
            .then((res) => {
                alert("Driver created successfully!");
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Error creating driver:", err);
                alert("Failed to create driver.");
            });
    };


    return (
        <Sidebar>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Create Driver</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Zone</label>
                        <select
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Select Zone</option>
                            <option value="North">World Wide</option>
                        </select>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block font-medium">Latitude</label>
                            <input
                                type="text"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block font-medium">Longitude</label>
                            <input
                                type="text"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        If you do not know your coordinates: Use Latitude and Longitude Finder.
                    </p>

                    <div>
                        <label className="block font-medium mb-1">Profile Image</label>
                        <div className="flex items-center space-x-4">
                            {formData.image && (
                                <img
                                    src={URL.createObjectURL(formData.image)}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border"
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


                    <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded">
                        Save Driver
                    </button>
                </form>
            </div>
        </Sidebar>
    );
};

export default CreateDriver;
