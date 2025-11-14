import {
    Menu,
    Home as HomeIcon,
    Eye,
    Store,
    Users,
    Package,
    PlusSquare,
    FileText,
    Bell,
    User
} from "lucide-react";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Sidebar({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { url } = usePage();

    // Page titles for the header
    const pageTitles = {
        "/": "Dashboard",
        "/godseye": "God's Eye",
        "/store": "Store",
        "/drivers": "Drivers",
        "/products": "Products",
        "/attributes": "Attributes",
        "/orders": "Orders",
        "/notifications": "Notifications",
    };

    const currentTitle =
        Object.entries(pageTitles).find(([path]) => url.startsWith(path))?.[1] || "";

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-red-900 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
                    } flex flex-col fixed h-screen`}
            >
                <div className="flex items-center justify-between px-4 py-4 bg-red-800">
                    <h1 className={`font-bold text-white text-xl ${!isSidebarOpen && "hidden"}`}>
                        TEESAN
                    </h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Sidebar Menu */}
                <nav className="flex-1 space-y-2 mt-4">
                    <NavItem to="/" icon={<HomeIcon />} label="Dashboard" open={isSidebarOpen} active={url === "/"} />
                    <NavItem to="/godseye" icon={<Eye />} label="God's Eye" open={isSidebarOpen} active={url.startsWith("/godseye")} />
                    <NavItem to="/stores" icon={<Store />} label="Store" open={isSidebarOpen} active={url.startsWith("/store")} />
                    <NavItem to="/drivers" icon={<Users />} label="Drivers" open={isSidebarOpen} active={url.startsWith("/drivers")} />
                    <NavItem to="/products" icon={<Package />} label="Products" open={isSidebarOpen} active={url.startsWith("/products")} />
                    <NavItem to="/attributes" icon={<PlusSquare />} label="Attributes" open={isSidebarOpen} active={url.startsWith("/attributes")} />
                    <NavItem to="/orders" icon={<FileText />} label="Orders" open={isSidebarOpen} active={url.startsWith("/orders")} />
                    <NavItem to="/notifications" icon={<Bell />} label="Notifications" open={isSidebarOpen} active={url.startsWith("/notifications")} />
                </nav>
            </div>

            {/* Main Section */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"
                    }`}
            >
                {/* Top Bar */}
                <header className="h-14 bg-red-800 flex items-center justify-between px-6 shadow">
                    <h2 className="text-white font-bold text-lg"></h2>
                    <button className="flex items-center gap-2 text-white">
                        <User className="w-6 h-6" />
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-white overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

function NavItem({ to, icon, label, open, active }) {
    return (
        <Link
            href={to}
            className={`flex items-center px-4 py-2 transition-colors duration-200 ${active ? "bg-red-700 text-white" : "hover:bg-red-800 text-gray-200"
                }`}
        >
            <div className="w-6 h-6">{icon}</div>
            {open && <span className="ml-3">{label}</span>}
        </Link>
    );
}
