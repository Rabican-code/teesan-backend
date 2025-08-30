import React, { useEffect } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-dt";

const Driver = ({ drivers }) => {
    useEffect(() => {
        if ($.fn.DataTable.isDataTable("#driverTable")) {
            $("#driverTable").DataTable().destroy();
        }
        $("#driverTable").DataTable();
    }, [drivers]);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Drivers</h1>
            </div>

            {/* Button Group */}
            <div className="flex space-x-2 mb-6">
                <button className="bg-red-600 text-white px-4 py-2 rounded">
                    <i className="fa fa-list mr-2"></i> Drivers List
                </button>
                <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
                    <i className="fa fa-plus mr-2"></i> Create Driver
                </button>
            </div>

            {/* DataTable */}
            <table id="driverTable" className="display w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Documents</th>
                        <th>Active</th>
                        <th>Online</th>
                        <th>Wallet History</th>
                        <th>Total Orders</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver, index) => (
                        <tr key={index}>
                            <td>
                                <img
                                    src={`/storage/${driver.image}`}
                                    alt="driver"
                                    className="w-12 h-12 rounded-full"
                                />
                            </td>
                            <td>{driver.name}</td>
                            <td>{driver.email}</td>
                            <td>{driver.date}</td>
                            <td>{driver.documents}</td>
                            <td>{driver.active ? "Yes" : "No"}</td>
                            <td>{driver.online ? "Yes" : "No"}</td>
                            <td>{driver.wallet_history}</td>
                            <td>{driver.total_orders}</td>
                            <td>
                                <button className="px-2 py-1 bg-blue-500 text-white rounded">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Driver;
