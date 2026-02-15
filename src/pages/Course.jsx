import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MoreVertical, Eye, Pencil } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    fetchCourses,
    setStatusFilter,
    setSearchFilter,
    setPage,
} from "../features/slice/courseSlice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function CoursesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const debounceRef = useRef(null);

    const { courses, filters, pagination, status } = useSelector(
        (state) => state.courses
    );

    useEffect(() => {
        dispatch(fetchCourses());
    }, [filters.page, filters.status, filters.search, dispatch]);

    function handleSearch(value) {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            dispatch(setSearchFilter(value));
        }, 400);
    }

    function handleStatusChange(value) {
        dispatch(setStatusFilter(value));
    }

    function handleCourseClick(courseId) {
        navigate(`/course/${courseId}`);
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <Card>
                <CardHeader>
                    <CardTitle>Courses</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Search courses..."
                            className="sm:max-w-xs"
                            onChange={(e) => handleSearch(e.target.value)}
                        />

                        <Select
                            value={filters.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="sm:max-w-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PUBLISHED">Published</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Loading */}
                    {status === "pending" && (
                        <p className="text-muted-foreground text-sm">
                            Loading courses...
                        </p>
                    )}

                    {/* Empty State */}
                    {status === "fulfilled" && courses.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            No courses found.
                        </p>
                    )}

                    {/* Courses Grid */}
                    {status === "fulfilled" && courses.length > 0 && (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

                                {courses.map((course) => (
                                    <Card
                                        key={course._id}
                                        className="group overflow-hidden border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-0 gap-0"
                                    >

                                        {/* Thumbnail */}
                                        <div>
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="h-36 w-full object-cover"
                                            />
                                        </div>

                                        <CardContent className="p-4 space-y-4">

                                            {/* Top Row */}
                                            <div className="flex items-start justify-between gap-3">

                                                <div className="space-y-1">
                                                    <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition">
                                                        {course.title}
                                                    </h3>

                                                    <p className="text-xs text-muted-foreground">
                                                        {course.createdBy?.fullName}
                                                    </p>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-1 rounded-md hover:bg-muted transition">
                                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                        </button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem
                                                            onClick={() => handleCourseClick(course._id)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                            <span>View</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {course.description}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t text-sm">

                                                <div className="flex items-center gap-2">
                                                    {course.isFree ? (
                                                        <span className="text-green-600 font-medium">Free</span>
                                                    ) : (
                                                        <span className="font-medium">₹{course.price}</span>
                                                    )}

                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {course.status}
                                                    </Badge>
                                                </div>

                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(course.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                        </CardContent>
                                    </Card>

                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-end gap-3 mt-4">
                                <button
                                    variant="outline"
                                    size="icon"
                                    disabled={!pagination?.hasPrevPage}
                                    onClick={() => dispatch(setPage(filters.page - 1))}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                <span className="text-sm">
                                    Page {pagination?.page} of {pagination?.totalPages}
                                </span>

                                <button
                                    variant="outline"
                                    size="icon"
                                    disabled={!pagination?.hasNextPage}
                                    onClick={() => dispatch(setPage(filters.page + 1))}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default CoursesPage;
