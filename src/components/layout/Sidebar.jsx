import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Layers,
    Settings,
} from "lucide-react";

import {
    Sidebar as Aside,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
} from "../ui/sidebar";

import { NavUser } from "../custom/navUser";

const menu = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { label: "Users", icon: Users, to: "/users" },
    { label: "Courses", icon: BookOpen, to: "/courses" },
    { label: "Enrollments", icon: GraduationCap, to: "/enrollments" },
];

export default function Sidebar() {
    const currentUser = {
        _id: "6980048560f14573647c98c6",
        fullName: "Rajendra Behera",
        email: "rajendrabehera8116@gmail.com",
        role: "ADMIN",
        isEmailVerified: true,
        status: "ACTIVE",
        avatar: "https://res.cloudinary.com/ddgpr2qfa/image/upload/v1769953421/avatar_backend_image_mxniew.jpg",
        isBlocked: false,
        createdAt: "2026-02-02T01:57:25.350+00:00",
        updatedAt: "2026-02-03T03:04:26.311+00:00"
    }


    return (
        <Aside className="w-64 bg-slate-50 text-slate-900 flex flex-col">
            {/* Logo */}
            <SidebarHeader className="flex flex-row justify-start gap-3 p-4 border-b">
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-slate-100 flex items-center justify-center font-bold">
                    <GraduationCap />
                </div>
                <div>
                    <h1 className="font-semibold leading-tight">LMS Admin</h1>
                    <p className="text-xs text-slate-400">Learning Platform</p>
                </div>
            </SidebarHeader>

            {/* Menu */}
            <SidebarContent className="flex-1 flex flex-col justify-between px-3 py-4 space-y-1">
                <div>
                    <p className="px-3 text-xs uppercase text-slate-400 mb-2">
                        Main Menu
                    </p>

                    <SidebarMenu>
                        {menu.map(({ label, icon: Icon, to }, index) => (
                            <SidebarMenuItem key={index}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                                        ${isActive
                                            ? "bg-blue-700 text-slate-100"
                                            : "text-slate-700 hover:text-slate-100 hover:bg-blue-700/70"
                                        }`
                                    }
                                >
                                    {/* <SidebarMenuButton> */}
                                    <Icon size={18} />
                                    {label}
                                    {/* </SidebarMenuButton> */}
                                </NavLink>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>

                <div>
                    <p className="px-3 text-xs uppercase text-slate-400 mb-2">
                        Settings
                    </p>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
              ${isActive
                                ? "bg-blue-700 text-slate-100"
                                : "text-slate-700 hover:text-slate-100 hover:bg-blue-700/70"
                            }`
                        }
                    >
                        <Settings size={18} />
                        Settings
                    </NavLink>
                </div>
            </SidebarContent>

            {/* Bottom */}
            <SidebarFooter className="border-t  p-2 space-y-3">
                <NavUser user={currentUser} />
            </SidebarFooter>
        </Aside>
    );
}
