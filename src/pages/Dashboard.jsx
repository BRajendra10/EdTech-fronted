import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "../components/ui/card"

import { Badge } from "@/components/ui/badge"
import {
    Users,
    BookOpen,
    IndianRupee,
    TrendingUp,
    Layers,
    ArrowUpRight,
    GraduationCap,
    Clock
} from "lucide-react"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import api from "../features/axios"

/* ---------------- MOCK DATA ---------------- */

const mockData = {
    totalUsers: 1240,
    totalStudents: 980,
    totalInstructors: 40,
    totalCourses: 120,
    publishedCourses: 95,
    draftCourses: 25,
    unpublishedCourses: 10,
    totalEnrollments: 3200,
    totalRevenue: 384320,
    monthlyEnrollments: [
        { name: "Jan", enrollments: 400, revenue: 50000 },
        { name: "Feb", enrollments: 300, revenue: 42000 },
        { name: "Mar", enrollments: 600, revenue: 60000 },
        { name: "Apr", enrollments: 450, revenue: 55000 },
        { name: "May", enrollments: 700, revenue: 72000 },
        { name: "Jun", enrollments: 500, revenue: 65000 },
        { name: "July", enrollments: 400, revenue: 50000 },
        { name: "Aug", enrollments: 300, revenue: 42000 },
        { name: "Sep", enrollments: 680, revenue: 60000 },
        { name: "Oct", enrollments: 450, revenue: 55000 },
        { name: "Nuv", enrollments: 740, revenue: 72000 },
        { name: "Des", enrollments: 550, revenue: 65000 },
    ],
    recentEnrollments: [
        {
            id: 1,
            user: "Rajendra Behera",
            course: "React Mastery",
            date: "2026-02-20",
            status: "Active",
            price: "Free",
        },
        {
            id: 2,
            user: "Amit Sharma",
            course: "Node Bootcamp",
            date: "2026-02-18",
            status: "Active",
            price: "Free",
        },
        {
            id: 3,
            user: "Riya Patel",
            course: "UI/UX Design",
            date: "2026-02-16",
            status: "Active",
            price: "Free",
        },
    ],
}

export default function Dashboard() {
    const { currentUser } = useSelector((state) => state.users);
    const [stats, setStats] = useState(mockData);
    const role = currentUser?.role || "STUDENT";

    const publishRate = (
        (stats.publishedCourses / stats.totalCourses) *
        100
    ).toFixed(1)

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyEnrollments = monthNames.map((month, index) => {
        const found = stats.monthlyEnrollments.find(
            (item) => item._id === index + 1
        );

        return {
            name: month,
            enrollments: found ? found.enrollments : 0
        };
    });

    const courseStatusData = [
        { name: "Published", value: stats.publishedCourses },
        { name: "Draft", value: stats.draftCourses },
        { name: "Unpubslished", value: stats.unpublishedCourses }
    ]

    const COLORS = [
        "var(--primary)",
        "var(--destructive)",
        "var(--secondary)",
    ]

    useEffect(() => {
        let eventSource;

        const rolePath = role === "ADMIN" ? "admin" : role === "INSTRUCTOR" ? "instructor" : "student";

        const connect = () => {
            eventSource = new EventSource(
                `http://localhost:4000/api/v1/users/${rolePath}/stream`,
                { withCredentials: true }
            );

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setStats(data);
            };

            eventSource.onerror = async (err) => {
                console.error("SSE error:", err);
                console.log(err);
                eventSource.close();
            };
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        }
    }, [role]);

    if (role === "STUDENT") {
        return <StudentDashboardView stats={stats} />;
    }

    return (
        <div className="space-y-8">

            {/* ================= KPI CARDS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard
                    title={role === "ADMIN" ? "Total Users" : "My Students"}
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                />
                <StatCard
                    title={role === "ADMIN" ? "Total Courses" : "My Courses"}
                    value={stats.totalCourses}
                    icon={Layers}
                />
                <StatCard
                    title={role === "ADMIN" ? "Total Enrollments" : "Course Enrollments"}
                    value={stats.totalEnrollments.toLocaleString()}
                    icon={TrendingUp}
                />
                <StatCard
                    title={role === "ADMIN" ? "Publish Rate" : "Total Revenue"}
                    value={role === "ADMIN" ? `${publishRate}%` : `₹${stats.totalRevenue.toLocaleString()}`}
                    icon={role === "ADMIN" ? BookOpen : IndianRupee}
                />
            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ---- LINE CHART ---- */}
                <Card className="col-span-2 border shadow-sm">
                    <CardHeader>
                        <CardTitle>Monthly Enrollments</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyEnrollments}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="enrollments"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* ---- DONUT CHART ---- */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Course Status</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[350px]">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={courseStatusData}
                                    dataKey="value"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={4}
                                >
                                    {courseStatusData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="flex justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-primary"></span>
                                Published
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-destructive"></span>
                                Draft
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                                Unpublished
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* ================= RECENT ENROLLMENTS ================= */}
            <Card className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Enrollments</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Latest student activity
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {stats?.recentEnrollments?.length > 0 ? (
                        stats.recentEnrollments.map((item) => {
                            const initials = item.userId?.fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("");

                            return (
                                <div
                                    key={item._id}
                                    className="flex items-start justify-between gap-4 "
                                >
                                    {/* LEFT SECTION */}
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                            {initials}
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    {item.userId?.fullName}
                                                </span>{" "}
                                                enrolled in{" "}
                                                <span className="font-medium">
                                                    {item.courseId?.title}
                                                </span>
                                            </p>

                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>
                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString("en-IN")}
                                                </span>
                                                <span>•</span>
                                                <span>{item.progress}% progress</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SECTION */}
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant="outline"
                                            className={
                                                item.status === "ACTIVE"
                                                    ? "text-blue-600 bg-blue-50 border-blue-200"
                                                    : "text-green-600 bg-green-50 border-green-200"
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No recent enrollments yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function StudentDashboardView({ stats }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard
                    title="Enrolled Courses"
                    value={stats.totalEnrollments || 12}
                    icon={BookOpen}
                />
                <StatCard
                    title="Active Courses"
                    value={stats.publishedCourses || 4}
                    icon={Layers}
                />
                <StatCard
                    title="Completed"
                    value={stats.draftCourses || 8}
                    icon={GraduationCap}
                />
                <StatCard
                    title="Learning Hours"
                    value="124h"
                    icon={Clock}
                />
            </div>

            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle>My Learning Activity</CardTitle>
                    <CardDescription>Keep up the good work!</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Activity Chart Placeholder
                </CardContent>
            </Card>
        </div>
    );
}

/* ---------------- SUB COMPONENT ---------------- */

function StatCard({ title, value, icon: Icon }) {
    return (
        <Card className="border shadow-sm hover:shadow-md transition">
            <CardContent className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-xl font-bold mt-1">{value}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
            </CardContent>
        </Card>
    )
}