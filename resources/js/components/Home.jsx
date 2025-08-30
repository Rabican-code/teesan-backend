import { useState } from "react";
import {
    Menu,
    User,
    Home as HomeIcon,
    Eye,
    Store,
    Users,
    Package,
    PlusSquare,
    FileText,
    Bell,
} from "lucide-react";

import Driver from "./Driver";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState("dashboard"); // ✅ Page state

    return (
        <div className="flex h-screen bg-white text-white">
            {/* Sidebar */}
            <div
                className={`bg-red-900 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
                    } flex flex-col`}
            >
                <div className="flex items-center justify-between px-4 py-4 bg-red-800">
                    <h1 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
                        TEESAN
                    </h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar Menu */}
                <nav className="flex-1 space-y-2 mt-4">
                    <NavItem
                        icon={<HomeIcon />}
                        label="Dashboard"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("dashboard")}
                    />
                    <NavItem
                        icon={<Eye />}
                        label="God's Eye"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("godseye")}
                    />
                    <NavItem
                        icon={<Store />}
                        label="Store"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("store")}
                    />
                    <NavItem
                        icon={<Users />}
                        label="Drivers"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("drivers")}
                    />
                    <NavItem
                        icon={<Package />}
                        label="Products"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("products")}
                    />
                    <NavItem
                        icon={<PlusSquare />}
                        label="Attributes"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("attributes")}
                    />
                    <NavItem
                        icon={<FileText />}
                        label="Orders"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("orders")}
                    />
                    <NavItem
                        icon={<Bell />}
                        label="Notifications"
                        open={isSidebarOpen}
                        onClick={() => setActivePage("notifications")}
                    />
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <div className="flex items-center justify-between px-6 py-4 bg-red-800">
                    <h2 className="text-xl font-bold">Business Analytics</h2>
                    <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 text-black">
                    {activePage === "dashboard" && <p>📊 Month Orders completed</p>}
                    {activePage === "drivers" && (
                        <Driver
                            drivers={[
                                {
                                    image: "driver1.jpg",
                                    name: "John Doe",
                                    email: "john@example.com",
                                    date: "2025-08-30",
                                    documents: "License.pdf",
                                    active: true,
                                    online: false,
                                    wallet_history: "₹2000",
                                    total_orders: 15,
                                },
                                {
                                    image: "driver2.jpg",
                                    name: "Jane Smith",
                                    email: "jane@example.com",
                                    date: "2025-08-20",
                                    documents: "Aadhar.pdf",
                                    active: false,
                                    online: true,
                                    wallet_history: "₹1500",
                                    total_orders: 10,
                                },
                            ]}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function NavItem({ icon, label, open, onClick }) {
    return (
        <div
            className="flex items-center px-4 py-2 hover:bg-red-800 cursor-pointer"
            onClick={onClick}
        >
            <div className="w-6 h-6">{icon}</div>
            {open && <span className="ml-3">{label}</span>}
        </div>
    );
}
