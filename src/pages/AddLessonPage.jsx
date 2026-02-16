import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { addLesson } from "../features/slice/courseSlice"
import { useFormik } from "formik"
import * as Yup from "yup"

const AddLessonPage = () => {
    const { moduleId, courseId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { selectedCourse, lessonStatus, lessonError } = useSelector(
        (state) => state.courses
    )

    // 🔥 Auto-calculate next order
    const nextOrder = useMemo(() => {
        const module = selectedCourse?.modules?.find(
            (m) => m._id === moduleId
        )

        if (!module || !module.lessons?.length) return 0

        const maxOrder = Math.max(...module.lessons.map((l) => l.order))
        return maxOrder + 1
    }, [selectedCourse, moduleId])

    useEffect(() => {
        if (lessonStatus === "fulfilled") {
            navigate(`/courses/${courseId}`)
        }
    }, [lessonStatus, navigate, courseId])

    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Lesson title is required")
            .min(3, "Title must be at least 3 characters"),
        videoFile: Yup.mixed()
            .required("Video file is required"),
        thumbnail: Yup.mixed().nullable(),
    })

    const formik = useFormik({
        initialValues: {
            title: "",
            videoFile: null,
            thumbnail: null,
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
                        thumbnail: values.thumbnail,
                    },
                })
            )
        },
    })

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <div className="border rounded-xl p-8 space-y-6 bg-background shadow-sm">

                <div>
                    <h1 className="text-2xl font-semibold">Add New Lesson</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Lesson will be added as #{nextOrder}
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lesson Title</label>
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

                    {/* Video Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Video File</label>
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
                        {formik.touched.videoFile && formik.errors.videoFile && (
                            <p className="text-xs text-red-500">
                                {formik.errors.videoFile}
                            </p>
                        )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Thumbnail (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                formik.setFieldValue(
                                    "thumbnail",
                                    e.currentTarget.files[0]
                                )
                            }
                        />
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

export default AddLessonPage
