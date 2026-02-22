import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
    return (
        <SidebarProvider className="w-full h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 flex flex-col border-0">
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