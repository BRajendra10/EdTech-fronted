import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
    return (
        <SidebarProvider className="w-full h-screen bg-slate-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <Topbar />

                {/* Page content */}
                <main className="p-6 flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    )
}