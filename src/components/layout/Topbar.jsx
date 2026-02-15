import { Bell } from "lucide-react"
import { Badge } from "../ui/badge"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { useLocation } from 'react-router-dom';

const PAGE_CONFIG = {
    "/": {
        heading: "Dashboard",
        message: "Overview of system activity and key metrics.",
    },

    "/courses": {
        heading: "Courses",
        message: "Create, manage, and monitor all courses.",
    },

    "/course/:courseId": {
        heading: "Course Details",
        message: "View course structure, modules, and lessons.",
    },

    "/users": {
        heading: "Users",
        message: "Manage instructors and students.",
    },

    "/enrollment": {
        heading: "Enrollments",
        message: "Track and manage course enrollments.",
    },

    "/settings": {
        heading: "Settings",
        message: "Configure system preferences and account options.",
    },

    "/modules": {
        heading: "Modules",
        message: "Manage course modules and content structure.",
    },
};

export default function Topbar() {
    const location = useLocation();
    const getPageConfig = (pathname) => {
        if (pathname.startsWith("/course/")) {
            return {
                heading: "Course Details",
                message: "View course structure, modules, and lessons.",
            };
        }

        return (
            PAGE_CONFIG[pathname] || {
                heading: "Not found",
                message: "",
            }
        );
    };

    const currentPage = getPageConfig(location.pathname);


    return (
        <header className="sticky top-0 z-30 h-16 border-b bg-slate-50 text-slate-900">
            <div className="flex h-full items-center justify-between px-4">

                {/* Left section */}
                <div className="flex items-center gap-1">
                    <SidebarTrigger className="h-9 w-9 rounded-md hover:bg-slate-100 transition" />

                    <Separator
                        orientation="vertical"
                        className="h-8"
                    />

                    <div className="leading-tight">
                        <h2 className="text-base font-semibold">{currentPage.heading}</h2>
                        <p className="text-xs text-slate-500">{currentPage.message}</p>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    <div className="relative cursor-pointer rounded-md p-2 hover:bg-blue-700 hover:text-slate-100 transition">
                        <Bell className="h-5 w-5" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[12px] flex items-center justify-center bg-red-700 text-slate-100">
                            3
                        </Badge>
                    </div>
                </div>

            </div>
        </header>
    )
}
