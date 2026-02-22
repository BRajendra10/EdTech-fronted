import { Bell } from "lucide-react"
import { Badge } from "../ui/badge"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { useLocation } from "react-router-dom"

const PAGE_CONFIG = {
    "/": {
        heading: "Dashboard",
        message: "Overview of system activity and key metrics.",
    },
    "/courses": {
        heading: "Courses",
        message: "Create, manage, and monitor all courses.",
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
}

export default function Topbar() {
    const location = useLocation()

    const getPageConfig = (pathname) => {
        if (pathname.startsWith("/course/")) {
            return {
                heading: "Course Details",
                message: "View course structure, modules, and lessons.",
            }
        }

        return (
            PAGE_CONFIG[pathname] ?? {
                heading: "Dashboard",
                message: "",
            }
        )
    }

    const currentPage = getPageConfig(location.pathname)

    return (
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md">
            <div className="flex h-full items-center justify-between px-4">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="h-9 w-9 rounded-lg hover:bg-primary/20 transition" />

                    <Separator orientation="vertical" className="h-8" />

                    <div className="leading-tight">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                            {currentPage.heading}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {currentPage.message}
                        </p>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-4">

                    {/* NOTIFICATIONS */}
                    <button
                        className="relative rounded-lg p-2 hover:bg-secondary/20 transition"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5 text-secondary" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[11px] flex items-center justify-center bg-destructive text-destructive-foreground">
                            3
                        </Badge>
                    </button>
                </div>
            </div>
        </header>
    )
}