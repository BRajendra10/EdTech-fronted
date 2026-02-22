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

import { NavUser } from "../navUser";
import { useSelector } from "react-redux";

const menu = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/", roles: ["ADMIN", "INSTRUCTOR", "STUDENT"] },
    { label: "Users", icon: Users, to: "/users", roles: ["ADMIN", "INSTRUCTOR"] },
    { label: "Courses", icon: BookOpen, to: "/courses", roles: ["ADMIN", "INSTRUCTOR", "STUDENT"] },
    { label: "Enrollments", icon: GraduationCap, to: "/enrollment", roles: ["ADMIN", "INSTRUCTOR", "STUDENT"] },
];

export default function Sidebar() {
    const { currentUser } = useSelector(state => state.users)

    const filteredMenu = menu.filter(item =>
        item.roles.includes(currentUser?.role)
    )

    return (
        <Aside className="w-64 bg-background text-foreground border-r-2 flex flex-col">
            {/* Logo */}
            <SidebarHeader className="flex flex-row justify-start gap-3 p-4">
                <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    <GraduationCap size={20} />
                </div>
                <div>
                    <h1 className="font-semibold leading-tight">LMS Admin</h1>
                    <p className="text-xs text-muted-foreground">
                        Learning Platform
                    </p>
                </div>
            </SidebarHeader>

            {/* Menu */}
            <SidebarContent className="flex-1 flex flex-col justify-between px-3 py-4 space-y-1">
                <div>
                    <p className="px-3 text-xs uppercase text-muted-foreground mb-2">
                        Main Menu
                    </p>

                    <SidebarMenu>
                        {filteredMenu.map(({ label, icon: Icon, to }, index) => (
                            <SidebarMenuItem key={index}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all duration-200 hover:text-foreground hover:bg-primary/60
                                        ${isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground"
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    {label}
                                </NavLink>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>

                <div>
                    <p className="px-3 text-xs uppercase text-muted-foreground mb-2">
                        Settings
                    </p>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:text-foreground hover:bg-primary/60
                            ${isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
                            }`
                        }
                    >
                        <Settings size={18} />
                        Settings
                    </NavLink>
                </div>
            </SidebarContent>

            {/* Bottom */}
            <SidebarFooter className="p-2 space-y-3">
                <NavUser user={currentUser} />
            </SidebarFooter>
        </Aside>
    );
}