import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addLesson } from "../features/slice/courseSlice"
import { useFormik } from "formik"
import * as Yup from "yup"

const AddLessonModal = ({ isOpen, onClose, moduleId }) => {
    const dispatch = useDispatch()

    const { selectedCourse, lessonStatus, lessonError } = useSelector(
        (state) => state.courses
    )

    // Auto-calc order
    const nextOrder = useMemo(() => {
        const module = selectedCourse?.modules?.find(
            (m) => m._id === moduleId
        )

        if (!module || !module.lessons?.length) return 0

        const maxOrder = Math.max(...module.lessons.map((l) => l.order))
        return maxOrder + 1
    }, [selectedCourse, moduleId])

    // ESC close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && lessonStatus !== "pending") {
                onClose()
            }
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [lessonStatus, onClose])

    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Lesson title is required")
            .min(3, "Minimum 3 characters"),
        videoFile: Yup.mixed().required("Video file is required"),
    })

    const formik = useFormik({
        initialValues: {
            title: "",
            videoFile: null,
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(
                addLesson({
                    moduleId,
                    lessonData: {
                        title: values.title,
                        order: nextOrder,
                        videoFile: values.videoFile,
                    },
                })
            )

            formik.resetForm();
        },
    })

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => {
                if (lessonStatus !== "pending") onClose()
            }}
        >
            {/* Modal */}
            <div
                className="bg-white w-full max-w-lg rounded-xl shadow-xl p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Add New Lesson
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Lesson will be added as #{nextOrder}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={lessonStatus === "pending"}
                        className="text-sm hover:opacity-60"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-5">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Lesson Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="text-xs text-red-500">
                                {formik.errors.title}
                            </p>
                        )}
                    </div>

                    {/* Video */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Video File
                        </label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                                formik.setFieldValue(
                                    "videoFile",
                                    e.currentTarget.files[0]
                                )
                            }
                        />
                        {formik.errors.videoFile && (
                            <p className="text-xs text-red-500">
                                {formik.errors.videoFile}
                            </p>
                        )}
                    </div>

                    {lessonError && (
                        <p className="text-sm text-red-500">
                            {lessonError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={lessonStatus === "pending"}
                        className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                        {lessonStatus === "pending"
                            ? "Uploading..."
                            : "Create Lesson"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddLessonModal
