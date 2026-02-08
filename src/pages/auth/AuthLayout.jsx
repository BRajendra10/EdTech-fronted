import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AuthLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const isLogin = location.pathname.includes("login");

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT SECTION (Branding) */}
            <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-primary-foreground">
                {/* Logo */}
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15">
                        🎓
                    </span>
                    EduPlatform
                </div>

                {/* Content */}
                <div>
                    <h2 className="text-4xl font-bold leading-tight">
                        Transforming education through
                        <br />
                        digital innovation.
                    </h2>
                    <p className="mt-4 max-w-md text-white/90">
                        Manage courses, track student progress, and streamline
                        administrative tasks with our comprehensive dashboard solution.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-sm text-white/70">
                    © 2024 EduPlatform Inc. All rights reserved.
                </p>
            </div>

            {/* RIGHT SECTION (Auth) */}
            <div className="flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-foreground">
                            Welcome back
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    {/* Switch buttons */}
                    <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => navigate("/auth/login")}
                            className={`w-1/2 py-2 text-sm font-medium rounded-md transition
                                ${isLogin
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/auth/register")}
                            className={`w-1/2 py-2 text-sm font-medium rounded-md transition
                                ${!isLogin
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Card */}
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
