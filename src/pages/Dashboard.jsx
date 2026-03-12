import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    Users,
    Layers,
    TrendingUp,
    BookOpen,
} from "lucide-react";

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
} from "recharts";

/* ---------------- INITIAL STATE ---------------- */

const initialState = {
    totalUsers: 0,
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    unpublishedCourses: 0,
    publishingRate: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    recentEnrollments: [],
    monthlyEnrollments: [],
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(initialState);

    /* ---------------- SSE CONNECTION ---------------- */

    useEffect(() => {
        const eventSource = new EventSource(
            "http://localhost:4000/api/v1/stream/admin/stream",
            { withCredentials: true }
        );

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStats(data);
        };

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    /* ---------------- MONTH FORMATTER ---------------- */

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyData = monthNames.map((month, index) => {
        const found = stats.monthlyEnrollments.find(
            (item) => item._id === index + 1
        );

        return {
            name: month,
            enrollments: found ? found.enrollments : 0,
        };
    });

    const courseStatusData = [
        { name: "Published", value: stats.publishedCourses },
        { name: "Draft", value: stats.draftCourses },
        { name: "Unpublished", value: stats.unpublishedCourses },
    ];

    const COLORS = [
        "var(--primary)",
        "var(--destructive)",
        "var(--secondary)",
    ];

    return (
        <div className="space-y-8">

            {/* ================= KPI CARDS ================= */}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
                <StatCard title="Total Courses" value={stats.totalCourses} icon={Layers} />
                <StatCard title="Total Enrollments" value={stats.totalEnrollments} icon={TrendingUp} />
                <StatCard title="Publishing Rate" value={`${stats.publishingRate}%`} icon={BookOpen} />
            </div>

            {/* ================= CHARTS ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ---- LINE CHART ---- */}

                <Card className="col-span-2 border shadow-sm">
                    <CardHeader>
                        <CardTitle>Monthly Enrollments</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
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
                    </CardContent>
                </Card>
            </div>

            {/* ================= RECENT ENROLLMENTS ================= */}

            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Enrollments</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {stats.recentEnrollments.length > 0 ? (
                        stats.recentEnrollments.map((item) => {
                            const initials = item.userId?.fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("");

                            return (
                                <div
                                    key={item._id}
                                    className="flex items-start justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                            {initials}
                                        </div>

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
                                                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className="text-blue-600 bg-blue-50 border-blue-200"
                                    >
                                        {item.status}
                                    </Badge>
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
    );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({ title, value, icon: Icon }) {
    return (
        <Card className="border shadow-sm hover:shadow-md transition">
            <CardContent className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-xl font-bold mt-1">
                        {value?.toLocaleString()}
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
            </CardContent>
        </Card>
    );
}