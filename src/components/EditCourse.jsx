import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { updateCourse } from "../features/slice/courseSlice"

const EditCourse = ({ isOpen, onClose, course }) => {
    const dispatch = useDispatch()
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [isOpen, onClose])

    useEffect(() => {
        if (course?.thumbnail) {
            setPreview(course.thumbnail)
        }
    }, [course])

    if (!isOpen || !course) return null

    console.log(course)

    const initialValues = {
        title: course.title || "",
        description: course.description || "",
        thumbnail: null,
    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .min(3, "Title must be at least 3 characters")
            .required("Title is required"),
        description: Yup.string()
            .min(10, "Description must be at least 10 characters")
            .required("Description is required"),
    })

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = new FormData()
            // MUST be first
            formData.append("courseId", course._id)

            if (values.title !== course.title) {
                formData.append("title", values.title)
            }

            if (values.description !== course.description) {
                formData.append("description", values.description)
            }

            if (values.thumbnail) {
                formData.append("thumbnail", values.thumbnail)
            }

            await dispatch(updateCourse(formData)).unwrap()
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold mb-6">
                    Edit Course
                </h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="space-y-6">

                            {/* Title */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Course Title
                                </label>
                                <Field
                                    name="title"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                />
                                <ErrorMessage
                                    name="title"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Course Description
                                </label>
                                <Field
                                    name="description"
                                    as="textarea"
                                    rows="4"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Thumbnail
                                </label>

                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full"
                                    onChange={(e) => {
                                        const file = e.currentTarget.files[0]
                                        if (file) {
                                            setFieldValue("thumbnail", file)
                                            setPreview(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition"
                                >
                                    {isSubmitting
                                        ? "Updating..."
                                        : "Update Course"}
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default EditCourse
