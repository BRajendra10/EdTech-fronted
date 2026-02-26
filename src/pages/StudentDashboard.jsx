import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    BookOpen,
    Clock,
    GraduationCap,
    TrendingUp,
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
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    recentEnrollments: [],
    monthlyEnrollments: [],
};

export default function StudentDashboard() {
    const [stats, setStats] = useState(initialState);

    /* ---------------- SSE CONNECTION ---------------- */

    useEffect(() => {
        const eventSource = new EventSource(
            "http://localhost:4000/api/v1/users/user/stream",
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

    /* ---------------- PIE DATA ---------------- */

    const progressData = [
        { name: "Active", value: stats.activeEnrollments },
        { name: "Completed", value: stats.completedEnrollments },
    ];

    const COLORS = [
        "var(--primary)",
        "var(--secondary)",
    ];

    return (
        <div className="space-y-8">

            {/* ================= KPI CARDS ================= */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Enrollments"
                    value={stats.totalEnrollments}
                    icon={BookOpen}
                />

                <StatCard
                    title="Active Courses"
                    value={stats.activeEnrollments}
                    icon={Clock}
                />

                <StatCard
                    title="Completed Courses"
                    value={stats.completedEnrollments}
                    icon={GraduationCap}
                />

                <StatCard
                    title="This Year Activity"
                    value={monthlyData.reduce((sum, m) => sum + m.enrollments, 0)}
                    icon={TrendingUp}
                />
            </div>

            {/* ================= CHARTS ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ---- LINE CHART ---- */}

                <Card className="col-span-2 border shadow-sm">
                    <CardHeader>
                        <CardTitle>Monthly Learning Activity</CardTitle>
                        <CardDescription>
                            Enrollments this year
                        </CardDescription>
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

                {/* ---- PIE CHART ---- */}

                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Course Progress</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[350px]">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={progressData}
                                    dataKey="value"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={4}
                                >
                                    {progressData.map((_, index) => (
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
                    <CardTitle>Recent Courses</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {stats.recentEnrollments.length > 0 ? (
                        stats.recentEnrollments.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-start justify-between gap-4"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {item.courseId?.title}
                                    </p>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>
                                            {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                        </span>
                                    </div>
                                </div>

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
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No enrollments yet.
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