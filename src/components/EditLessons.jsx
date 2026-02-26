import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik"
import { X } from "lucide-react"
import { updateLesson } from "../features/slice/courseSlice"

const EditLesson = ({ isOpen, onClose, lesson }) => {
    const dispatch = useDispatch()
    const { status } = useSelector((state) => state.courses)

    // Close modal on ESC key
    // useEffect(() => {
    //     const handleEsc = (e) => {
    //         if (e.key === "Escape") onClose()
    //     }

    //     if (isOpen) document.addEventListener("keydown", handleEsc)
    //     return () => document.removeEventListener("keydown", handleEsc)
    // }, [isOpen, onClose])

    // Formik setup
    const formik = useFormik({
        initialValues: {
            title: lesson?.title || "",
            videoFile: null,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log(values, lesson)
            if (!lesson) return

            const formData = new FormData()
            if (values.title !== lesson.title) formData.append("title", values.title)
            if (values.videoFile) formData.append("videoFile", values.videoFile)

            await dispatch(
                updateLesson({
                    lessonId: lesson._id,
                    formData,
                })
            )

            onClose()
        },
    })

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative bg-background w-full max-w-lg rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Edit Lesson</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Video File */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Video File</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                                formik.setFieldValue("videoFile", e.target.files[0])
                            }
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border hover:bg-muted transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                        >
                            {status === "loading" ? "Updating..." : "Update Lesson"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditLesson
