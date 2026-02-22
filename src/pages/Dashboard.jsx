import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card"

import {
    IndianRupee,
    TrendingUp,
    BookOpen,
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// import { RechartsDevtools } from "recharts/devtools"

/* ---------------- MOCK DATA ---------------- */

const mockData = {
    totalUsers: 1240,
    totalStudents: 980,
    totalInstructors: 40,
    totalCourses: 120,
    publishedCourses: 95,
    draftCourses: 25,
    totalEnrollments: 3200,
    totalRevenue: 384320,
    monthlyEnrollments: [
        { name: "Jan", enrollments: 400, revenue: 50000 },
        { name: "Feb", enrollments: 300, revenue: 42000 },
        { name: "Mar", enrollments: 600, revenue: 60000 },
        { name: "Apr", enrollments: 450, revenue: 55000 },
        { name: "May", enrollments: 700, revenue: 72000 },
        { name: "Jun", enrollments: 550, revenue: 65000 },
    ],
    recentEnrollments: [
        { id: 1, user: "Rajendra", course: "React Mastery" },
        { id: 2, user: "Amit", course: "Node Bootcamp" },
        { id: 3, user: "Riya", course: "UI/UX Design" },
    ],
}

export default function AdminDashboard() {
    const [stats] = useState(mockData)

    useEffect(() => { }, [])

    const publishRate = (
        (stats.publishedCourses / stats.totalCourses) *
        100
    ).toFixed(1)

    const revenuePerUser = Math.floor(
        stats.totalRevenue / stats.totalUsers
    )

    const enrollmentsPerCourse = Math.floor(
        stats.totalEnrollments / stats.totalCourses
    )

    const innerUserData = [
        { name: "Students", value: stats.totalStudents },
        { name: "Instructors", value: stats.totalInstructors },
    ]

    const outerCourseData = [
        { name: "Published", value: stats.publishedCourses },
        { name: "Draft", value: stats.draftCourses },
    ]

    return (
        <div className="space-y-7">

            {/* ================= KPI GRID ================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard
                    title="Enrollments"
                    value={stats.totalEnrollments.toLocaleString()}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
                    icon={IndianRupee}
                />
                <StatCard
                    title="Publish Rate"
                    value={`${publishRate}%`}
                    icon={BookOpen}
                />
                <StatCard
                    title="Revenue / User"
                    value={`₹${revenuePerUser.toLocaleString("en-IN")}`}
                    icon={IndianRupee}
                />
            </div>

            {/* ================= CHART SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ---------- LINE CHART ---------- */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue & Enrollments (Monthly)</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={stats.monthlyEnrollments}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="enrollments"
                                    stroke="#82ca9d"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* ---------- TWO LEVEL PIE ---------- */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Users & Courses Distribution</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[400px]">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={innerUserData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                >
                                    <Cell fill="#6366f1" />
                                    <Cell fill="#a855f7" />
                                </Pie>

                                <Pie
                                    data={outerCourseData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={95}
                                    outerRadius={130}
                                    label
                                >
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#ef4444" />
                                </Pie>

                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>

            {/* ================= LOWER SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats.recentEnrollments.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.user}</span>
                                <span className="text-muted-foreground">
                                    {item.course}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Insight
                            label="Avg Enrollments / Course"
                            value={enrollmentsPerCourse}
                        />
                        <Insight
                            label="Revenue / User"
                            value={`₹${revenuePerUser.toLocaleString("en-IN")}`}
                        />
                        <Insight
                            label="Publish Rate"
                            value={`${publishRate}%`}
                        />
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

/* ---------------- SUB COMPONENTS ---------------- */

function StatCard({ title, value, icon: Icon }) {
    return (
        <Card className="border shadow-sm hover:shadow-md transition">
            <CardContent className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-xl font-bold">{value}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
            </CardContent>
        </Card>
    )
}

function Insight({ label, value }) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>
            <span className="font-medium text-secondary">{value}</span>
        </div>
    )
}