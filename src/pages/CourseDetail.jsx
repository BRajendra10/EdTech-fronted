import { useEffect, useMemo, useState } from "react"
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
import AddLessonDrawer from "./AddLessonPage"
import AddModuleModal from "./AddModules"

const CourseDetail = () => {
    const [isLessonOpen, setIsLessonOpen] = useState(false)
    const [selectedModuleId, setSelectedModuleId] = useState(null)
    const [isModuleOpen, setIsModuleOpen] = useState(false)

    const dispatch = useDispatch()
    const { courseId } = useParams()
    const { selectedCourse, status, error } = useSelector(
        (state) => state.courses
    )
    const { currentUser } = useSelector(state => state.users);

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

    const handleEnroll = async () => {
        if (!courseId) return

        const result = await dispatch(enrollInCourse(courseId))

        if (enrollInCourse.fulfilled.match(result)) {
            toast.success("Enrolled successfully")
        } else {
            toast.error("Enrollment failed")
        }
    }

    const nextModuleOrder = useMemo(() => {
        if (!selectedCourse?.modules?.length) return 1
        const max = Math.max(...selectedCourse.modules.map(m => m.order))
        return max + 1
    }, [selectedCourse])



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
    const instructor =
        selectedCourse.assignedTo || selectedCourse.createdBy;

    return (
        <div>
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="border rounded-2xl overflow-hidden bg-background shadow-sm">

                        {/* Thumbnail */}
                        <div className="aspect-video overflow-hidden">
                            <img
                                src={selectedCourse.thumbnail}
                                alt={selectedCourse.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-6 space-y-6">

                            {/* Title + Description */}
                            <div className="space-y-2">
                                <h1 className="text-xl font-semibold leading-tight">
                                    {selectedCourse.title}
                                </h1>

                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {selectedCourse.description}
                                </p>
                            </div>

                            {/* Price + Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">
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

                            {/* Instructor */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={instructor?.avatar} />
                                    <AvatarFallback>
                                        {instructor?.fullName?.charAt(0) || "?"}
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

                            {/* Actions */}
                            <div className="space-y-3">

                                <button
                                    onClick={handleEnroll}
                                    disabled={selectedCourse.status !== "PUBLISHED"}
                                    className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition hover:opacity-90"
                                >
                                    Enroll Now
                                </button>

                                {currentUser.role !== "STUDENT" && (
                                    <button
                                        onClick={() => setIsModuleOpen(true)}
                                        className="w-full py-2.5 rounded-lg border text-sm font-medium hover:bg-muted transition"
                                    >
                                        + Add Module
                                    </button>
                                )}

                            </div>

                        </div>
                    </div>
                </div>


                <div className="lg:col-span-8">
                    <div className="border rounded-xl overflow-hidden bg-background">

                        {/* Header */}
                        <div className="bg-muted px-4 py-3 text-sm font-semibold grid grid-cols-12">
                            <div className="col-span-1">No.</div>
                            <div className="col-span-6">Topics</div>
                            <div className="col-span-3">Duration</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {/* Empty Modules State */}
                        {(selectedCourse.modules || []).length === 0 ? (
                            <div className="p-8 text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
                                <p>No modules added yet.</p>
                            </div>
                        ) : (
                            selectedCourse.modules.map((module) => {
                                const sortedLessons = [...(module.lessons || [])].sort(
                                    (a, b) => a.order - b.order
                                )

                                return (
                                    <div key={module._id} className="border-t">

                                        {/* Module Header */}
                                        <div
                                            onClick={() => toggleModule(module._id)}
                                            className="grid grid-cols-12 px-4 py-3 font-medium bg-muted/30 cursor-pointer hover:bg-muted/50 transition items-center"
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

                                            <div className="col-span-2 flex justify-end items-center gap-3">
                                                {currentUser.role !== "STUDENT" && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setSelectedModuleId(module._id)
                                                            setIsLessonOpen(true)
                                                        }}
                                                        className="text-xs px-2 py-1 border rounded-md hover:bg-muted transition"
                                                    >
                                                        + Add Lesson
                                                    </button>
                                                )}

                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${openModules[module._id] ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {openModules[module._id] && (
                                            <div className="bg-background">

                                                {sortedLessons.length === 0 ? (
                                                    <div className="px-8 py-4 text-xs text-muted-foreground">
                                                        No lessons yet. Click “Add Lesson” to get started.
                                                    </div>
                                                ) : (
                                                    sortedLessons.map((lesson) => (
                                                        <div
                                                            key={lesson._id}
                                                            className="grid grid-cols-12 px-8 py-2 text-sm hover:bg-muted/40 transition items-center"
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

                                                            <div className="col-span-2 text-right text-muted-foreground">
                                                                Draft
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

            </div>

            <AddLessonDrawer
                isOpen={isLessonOpen}
                onClose={() => setIsLessonOpen(false)}
                moduleId={selectedModuleId}
            />

            <AddModuleModal
                isOpen={isModuleOpen}
                onClose={() => setIsModuleOpen(false)}
                courseId={selectedCourse._id}
                order={nextModuleOrder}
            />

        </div>
    )
}

export default CourseDetail
