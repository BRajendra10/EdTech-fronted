import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, DollarSign, ShoppingCart } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const revenueData = [
    { name: "Mon", value: 1200 },
    { name: "Tue", value: 2100 },
    { name: "Wed", value: 1800 },
    { name: "Thu", value: 2600 },
    { name: "Fri", value: 3000 },
    { name: "Sat", value: 2800 },
    { name: "Sun", value: 3400 },
];

const ordersData = [
    { name: "Mon", value: 32 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 38 },
    { name: "Thu", value: 52 },
    { name: "Fri", value: 61 },
    { name: "Sat", value: 49 },
    { name: "Sun", value: 70 },
];

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="1230" icon={Users} />
                <StatCard title="Total Courses" value="120" icon={Users} />
                <StatCard title="Revenue" value="₹3,84,320" icon={DollarSign} />
                <StatCard title="Total Enrollment" value="800" icon={ShoppingCart} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Weekly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Orders */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Weekly Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ordersData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>



            {/* Activity Table */}
            <div className="grid gridl-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>System Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Log text="Admin logged in" />
                        <Log text="Course React Basics published" />
                        <Log text="User enrolled in JavaScript Bootcamp" />
                        <Log text="Backup completed successfully" />
                    </CardContent>
                </Card>

                <Card className="col-span-2 border shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b text-muted-foreground">
                                <tr>
                                    <th className="py-3 text-left">User</th>
                                    <th className="py-3 text-left">Action</th>
                                    <th className="py-3 text-left">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow user="Rajendra" action="Created new course" time="2 min ago" />
                                <TableRow user="Admin" action="Updated pricing" time="10 min ago" />
                                <TableRow user="Moderator" action="Blocked user" time="1 hr ago" />
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}

function StatCard({ title, value, icon: Icon }) {
    return (
        <Card className="shadow-sm border-0 py-4">
            <CardContent className="flex justify-between items-center px-6 space-y-2">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
            </CardContent>
        </Card>
    );
}

function Log({ text }) {
    return (
        <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>{text}</span>
        </div>
    );
}

function TableRow({ user, action, time }) {
    return (
        <tr className="border-b last:border-0">
            <td className="py-2">{user}</td>
            <td className="py-2">{action}</td>
            <td className="py-2 text-muted-foreground">{time}</td>
        </tr>
    );
}