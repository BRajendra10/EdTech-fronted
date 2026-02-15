import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchCourseById } from "../features/slice/courseSlice"
import { enrollInCourse } from "../features/slice/enrollmentSlice"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const CourseDetail = () => {
    const dispatch = useDispatch()
    const { courseId } = useParams()
    const { selectedCourse, status, error } = useSelector(
        (state) => state.courses
    )
    const {
        status: enrollStatus,
    } = useSelector((state) => state.enrollments)

    useEffect(() => {
        if (courseId) dispatch(fetchCourseById(courseId))
    }, [courseId, dispatch])

    const [openModules, setOpenModules] = useState({})

    const toggleModule = (id) => {
        setOpenModules((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }


    const formatDuration = (seconds = 0) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    const handleEnroll = () => {
        if (!courseId) return
        dispatch(enrollInCourse(courseId))

        if (enrollStatus === "fullfilled") toast.success("enrolled into course successfully")
    }

    if (status === "loading") {
        return (
            <div className="p-6 max-w-6xl mx-auto space-y-4">
                <div className="h-60 bg-muted animate-pulse rounded-xl" />
            </div>
        )
    }

    if (status === "failed") {
        return (
            <div className="p-6 text-destructive max-w-6xl mx-auto">
                {error}
            </div>
        )
    }

    if (!selectedCourse) return null

    return (
        <div>
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">

                    {/* Thumbnail */}
                    <div className="rounded-xl overflow-hidden border">
                        <img
                            src={selectedCourse.thumbnail}
                            alt={selectedCourse.title}
                            className="w-full h-75 object-cover"
                        />
                    </div>

                    {/* Basic Info Card */}
                    <div className="border rounded-xl p-5 space-y-4">

                        <h1 className="text-xl font-semibold">
                            {selectedCourse.title}
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            {selectedCourse.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                {selectedCourse.isFree
                                    ? "Free"
                                    : `₹${selectedCourse.price}`}
                            </span>

                            <Badge
                                className={
                                    selectedCourse.status === "PUBLISHED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }
                            >
                                {selectedCourse.status}
                            </Badge>
                        </div>

                        <Separator />

                        {/* Instructor */}
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={
                                        selectedCourse.assignedTo?.avatar ||
                                        selectedCourse.createdBy?.avatar
                                    }
                                />
                                <AvatarFallback>
                                    {(selectedCourse.assignedTo?.fullName ||
                                        selectedCourse.createdBy?.fullName)?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Instructor
                                </p>
                                <p className="text-sm font-medium">
                                    {selectedCourse.assignedTo?.fullName ||
                                        selectedCourse.createdBy?.fullName}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleEnroll}
                            className="w-full mt-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                        >
                            Enroll Now
                        </button>

                    </div>
                </div>

                <div className="lg:col-span-8">

                    <div className="border rounded-xl overflow-hidden">

                        {/* Header */}
                        <div className="bg-muted px-4 py-3 text-sm font-medium grid grid-cols-12">
                            <div className="col-span-1">No.</div>
                            <div className="col-span-6">Topics</div>
                            <div className="col-span-3">Duration</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {/* Rows */}
                        {selectedCourse.modules.map((module) => {
                            const sortedLessons = [...(module.lessons || [])].sort(
                                (a, b) => a.order - b.order
                            )

                            return (
                                <div key={module._id} className="border-t">

                                    <div
                                        onClick={() => toggleModule(module._id)}
                                        className="grid grid-cols-12 px-4 py-3 font-medium bg-muted/30 cursor-pointer hover:bg-muted/50 transition"
                                    >
                                        <div className="col-span-1">
                                            {module.order}
                                        </div>

                                        <div className="col-span-5">
                                            {module.title}
                                        </div>

                                        <div className="col-span-2 text-sm text-muted-foreground">
                                            {sortedLessons.length} Lessons
                                        </div>

                                        <div className="col-span-2 text-sm text-muted-foreground">
                                            {formatDuration(
                                                sortedLessons.reduce((acc, l) => acc + (l.duration || 0), 0)
                                            )}
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <ChevronDown
                                                className={`h-4 w-4 ml-auto transition-transform ${openModules[module._id] ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {openModules[module._id] &&
                                        sortedLessons.map((lesson) => (

                                            <div
                                                key={lesson._id}
                                                className="grid grid-cols-12 px-4 py-2 text-sm hover:bg-muted/40"
                                            >
                                                <div className="col-span-1">
                                                    {module.order}.{lesson.order}
                                                </div>

                                                <div className="col-span-6">
                                                    {lesson.title}
                                                </div>

                                                <div className="col-span-3 text-muted-foreground">
                                                    {formatDuration(lesson.duration)}
                                                </div>

                                                <div className="col-span-2 text-right">
                                                    -
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )
                        })}

                    </div>

                </div>
            </div>
        </div>
    )
}

export default CourseDetail
