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
import { Routes, Route, Link, useLocation, Outlet } from "react-router-dom";
import Driver from "./Driver";

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-white text-white">
            {/* Sidebar */}
            <div className={`bg-red-900 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} flex flex-col`}>
                <div className="flex items-center justify-between px-4 py-4 bg-red-800">
                    <h1 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>TEESAN</h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 mt-4">
                    <NavItem to="/" icon={<HomeIcon />} label="Dashboard" open={isSidebarOpen} />
                    <NavItem to="/eye" icon={<Eye />} label="God's Eye" open={isSidebarOpen} />
                    <NavItem to="/store" icon={<Store />} label="Store" open={isSidebarOpen} />
                    <NavItem to="/drivers" icon={<Users />} label="Drivers" open={isSidebarOpen} />
                    <NavItem to="/products" icon={<Package />} label="Products" open={isSidebarOpen} />
                    <NavItem to="/attributes" icon={<PlusSquare />} label="Attributes" open={isSidebarOpen} />
                    <NavItem to="/orders" icon={<FileText />} label="Orders" open={isSidebarOpen} />
                    <NavItem to="/notifications" icon={<Bell />} label="Notifications" open={isSidebarOpen} />
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

                {/* Content area (renders child pages) */}
                <div className="flex-1 p-6 text-black">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

// NavItem with active highlight
function NavItem({ to, icon, label, open }) {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-2 cursor-pointer transition-colors
                        ${active ? "bg-red-700" : "hover:bg-red-800"}`}
        >
            <div className="w-6 h-6">{icon}</div>
            {open && <span className="ml-3">{label}</span>}
        </Link>
    );
}
