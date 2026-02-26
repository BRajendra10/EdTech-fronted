import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
// Ensure you have this action in your slice
import { fetchEnrollments, updateEnrollmentStatus } from "../features/slice/enrollmentSlice";

export default function EnrollmentsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [courseFilter, setCourseFilter] = useState("ALL");

    // Fallback to empty array/idle status if slice isn't fully set up yet
    const { enrollments = [], enrollmentCourses, status } = useSelector((state) => state.enrollments || {});
    const { currentUser } = useSelector((state) => state.users);

    useEffect(() => {
        // Dispatch action to fetch enrollments when page loads
        if (dispatch && fetchEnrollments) {
            dispatch(fetchEnrollments());
        }
    }, [dispatch]);

    // Filter logic
    const filteredEnrollments = enrollments.filter((item) => {
        const matchesStatus =
            statusFilter === "ALL" || item.status === statusFilter;

        const matchesCourse =
            courseFilter === "ALL" ||
            item.courseId?._id === courseFilter;

        const searchLower = searchTerm.toLowerCase();
        const courseTitle = item.courseId?.title?.toLowerCase() || "";
        const studentName = item.userId?.fullName?.toLowerCase() || "";

        const matchesSearch =
            courseTitle.includes(searchLower) ||
            studentName.includes(searchLower);

        return matchesStatus && matchesSearch && matchesCourse;
    });

    const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "INSTRUCTOR";

    return (
        <div className="space-y-6 animate-in fade-in">
            <Card className="border-none shadow-none bg-transparent">
                {/* <CardHeader className="px-0">
                    <CardTitle>My Enrollments</CardTitle>
                    <CardDescription>
                        {isAdmin
                            ? "Monitor student enrollment status and progress."
                            : "Track your learning progress and continue where you left off."}
                    </CardDescription>
                </CardHeader> */}
                <CardContent className="px-0 space-y-6">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 sm:max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={isAdmin ? "Search student or course..." : "Search courses..."}
                                className="pl-9 bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] bg-background">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={courseFilter} onValueChange={setCourseFilter}>
                            <SelectTrigger className="w-[220px] bg-background">
                                <SelectValue placeholder="Filter by course" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="ALL">All Courses</SelectItem>

                                {enrollmentCourses?.map((course) => (
                                    <SelectItem key={course._id} value={course._id}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Loading / Empty States */}
                    {status === "loading" ? (
                        <div className="h-40 flex items-center justify-center text-muted-foreground">
                            Loading enrollments...
                        </div>
                    ) : filteredEnrollments.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                            <BookOpen className="h-8 w-8 mb-2 opacity-50" />
                            <p>No enrollments found.</p>
                        </div>
                    ) : isAdmin ? (
                        <AdminEnrollmentTable data={filteredEnrollments} />
                    ) : (
                        <StudentEnrollmentGrid data={filteredEnrollments} navigate={navigate} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StudentEnrollmentGrid({ data, navigate }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((enrollment) => (
                <Card key={enrollment._id} className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-border/60">
                    <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                        {enrollment.courseId?.thumbnail ? (
                            <img
                                src={enrollment.courseId.thumbnail}
                                alt={enrollment.courseId.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                <BookOpen className="h-10 w-10" />
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <Badge variant={enrollment.status === "COMPLETED" ? "default" : "secondary"} className="shadow-sm">
                                {enrollment.status}
                            </Badge>
                        </div>
                    </div>
                    <CardContent className="flex flex-col flex-1 p-5 gap-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold line-clamp-1" title={enrollment.courseId?.title}>
                                {enrollment.courseId?.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{Math.round(enrollment.progress || 0)}%</span>
                            </div>
                        </div>
                        <Progress value={enrollment.progress || 0} className="h-2" />
                        <Button
                            className="w-full mt-auto"
                            onClick={() => navigate(`/course/${enrollment.courseId?._id}`)}
                        >
                            {enrollment.progress > 0 ? "Continue Learning" : "Start Course"}
                        </Button>
                    </CardContent>
                </Card>
            ))
            }
        </div >
    );
}

function AdminEnrollmentTable({ data }) {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.enrollments);

    const handleStatusToggle = (enrollment) => {
        const newStatus =
            enrollment.status === "ACTIVE" ? "CANCELLED" : "ACTIVE";

        console.log(newStatus, enrollment.courseId)

        dispatch(
            updateEnrollmentStatus({
                courseId: enrollment.courseId?._id,
                userId: enrollment.userId?._id,
                status: newStatus,
            })
        );
    };



    return (
        <div className="rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Enrolled Date</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((enrollment) => (
                        <TableRow key={enrollment._id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                                        {enrollment.userId?.avatar ? (
                                            <img
                                                src={enrollment.userId.avatar}
                                                alt={enrollment.userId?.fullName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-primary">
                                                {enrollment.userId?.fullName?.[0] || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{enrollment.userId?.fullName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {enrollment.userId?.email}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell className="max-w-[200px] truncate">
                                {enrollment.courseId?.title}
                            </TableCell>

                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        enrollment.status === "COMPLETED"
                                            ? "text-green-600 bg-green-50 border-green-200"
                                            : enrollment.status === "ACTIVE"
                                                ? "text-blue-600 bg-blue-50 border-blue-200"
                                                : "text-red-600 bg-red-50 border-red-200"
                                    }
                                >
                                    {enrollment.status}
                                </Badge>
                            </TableCell>

                            <TableCell className="w-[180px]">
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={enrollment.progress || 0}
                                        className="h-2 w-20"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {Math.round(enrollment.progress || 0)}%
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(
                                    enrollment.createdAt
                                ).toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                                {enrollment.status !== "COMPLETED" && (
                                    <Button
                                        size="sm"
                                        variant={
                                            enrollment.status === "ACTIVE"
                                                ? "destructive"
                                                : "secondary"
                                        }
                                        disabled={status === "pending"}
                                        onClick={() =>
                                            handleStatusToggle(enrollment)
                                        }
                                    >
                                        {enrollment.status === "ACTIVE"
                                            ? "Cancel"
                                            : "Activate"}
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}