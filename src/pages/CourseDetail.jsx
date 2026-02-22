import { useEffect, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import AddLessonDrawer from "../components/AddLessons"
import AddModuleModal from "../components/AddModules"
import EditModules from "../components/EditModules"
import EditLesson from "../components/EditLessons"

const CourseDetail = () => {
    const [isLessonOpen, setIsLessonOpen] = useState(false)
    const [selectedModuleId, setSelectedModuleId] = useState(null)
    const [isModuleOpen, setIsModuleOpen] = useState(false)
    const [editingModule, setEditingModule] = useState(null)
    const [editingLesson, setEditingLesson] = useState(null)

    const dispatch = useDispatch()
    const { courseId } = useParams()
    const { selectedCourse, status, error } = useSelector(
        (state) => state.courses
    )
    const { currentUser } = useSelector(state => state.users);

    useEffect(() => {
        if (courseId) dispatch(fetchCourseById(courseId))
    }, [courseId, dispatch])


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

                                <Button
                                    onClick={handleEnroll}
                                    disabled={selectedCourse.status !== "PUBLISHED"}
                                    className="w-full"
                                >
                                    Enroll Now
                                </Button>

                                {currentUser.role !== "STUDENT" && (
                                    <Button
                                        onClick={() => setIsModuleOpen(true)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        + Add Module
                                    </Button>
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
                            <Accordion type="multiple" className="w-full">
                                {selectedCourse.modules.map((module) => {
                                    const sortedLessons = [...(module.lessons || [])].sort(
                                        (a, b) => a.order - b.order
                                    )

                                    return (
                                        <AccordionItem value={module._id} key={module._id} className="border-t data-[state=open]:bg-muted/20">
                                            <AccordionTrigger className="px-4 py-3 font-medium hover:bg-muted/50 transition hover:no-underline data-[state=open]:bg-muted/60">
                                                <div className="grid grid-cols-12 w-full text-left items-center gap-x-4">
                                                    <div className="col-span-1">{module.order}</div>
                                                    <div className="col-span-5">{module.title}</div>
                                                    <div className="col-span-2 text-sm text-muted-foreground">{sortedLessons.length} Lessons</div>
                                                    <div className="col-span-2 text-sm text-muted-foreground">
                                                        {formatDuration(
                                                            sortedLessons.reduce((acc, l) => acc + (l.duration || 0), 0)
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 flex justify-end items-center gap-3">
                                                        {currentUser.role !== "STUDENT" && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setEditingModule(module)
                                                                    }}
                                                                    className="text-xs px-2 py-1 h-auto"
                                                                >
                                                                    Edit
                                                                </Button>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setSelectedModuleId(module._id)
                                                                        setIsLessonOpen(true)
                                                                    }}
                                                                    className="text-xs px-2 py-1 h-auto"
                                                                >
                                                                    + Add Lesson
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="bg-background">
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

                                                            <div className="col-span-2 flex justify-end items-center gap-2">
                                                                <span className="text-xs text-muted-foreground">
                                                                    Draft
                                                                </span>

                                                                {currentUser.role !== "STUDENT" && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setEditingLesson(lesson)}
                                                                        className="text-xs px-2 py-1 h-auto"
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                )}
                                                            </div>

                                                        </div>
                                                    ))
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
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

            <EditModules
                isOpen={editingModule}
                onClose={() => setEditingModule(null)}
                module={editingModule}
            />

            <EditLesson
                isOpen={!!editingLesson}
                onClose={() => setEditingLesson(null)}
                lesson={editingLesson}
            />
        </div>
    )
}

export default CourseDetail