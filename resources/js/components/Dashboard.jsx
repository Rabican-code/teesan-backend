import Sidebar from "./Sidebar";

export default function Dashboard() {
    return (
        <Sidebar>
            <div className="text-black">
                <h1 className="text-2xl font-bold">Dashboard Content</h1>
                <p>Welcome to your dashboard!</p>
            </div>
        </Sidebar>
    );
}
