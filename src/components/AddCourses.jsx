import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { createCourse, fetchCourses } from "../features/slice/courseSlice"

const CreateCourseModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch()

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            window.addEventListener("keydown", handleEsc)
        }

        return () => {
            window.removeEventListener("keydown", handleEsc)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const initialValues = {
        title: "",
        description: "",
        price: "",
        status: "DRAFT",
        isFree: false,
        thumbnail: null,
    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Title is required")
            .min(3, "Minimum 3 characters"),

        description: Yup.string()
            .required("Description is required")
            .min(10, "Minimum 10 characters"),

        price: Yup.number().when("isFree", {
            is: false,
            then: (schema) =>
                schema
                    .typeError("Price must be a number")
                    .required("Price is required")
                    .min(1, "Must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
        }),

        thumbnail: Yup.mixed().required("Thumbnail is required"),
    })

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(createCourse(values)).unwrap()

            await dispatch(fetchCourses()) // refresh list

            resetForm()
            onClose()
        } catch (error) {
            console.error("Course creation failed:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Create New Course
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Fill in course details below
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-sm hover:opacity-60"
                    >
                        ✕
                    </button>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className="space-y-5">

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Course Title
                                </label>
                                <Field
                                    name="title"
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="Enter course title"
                                />
                                <ErrorMessage
                                    name="title"
                                    component="p"
                                    className="text-sm text-red-500"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Description
                                </label>
                                <Field
                                    name="description"
                                    as="textarea"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="Enter course description"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="p"
                                    className="text-sm text-red-500"
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Price
                                </label>
                                <Field
                                    name="price"
                                    type="number"
                                    disabled={values.isFree}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                                <ErrorMessage
                                    name="price"
                                    component="p"
                                    className="text-sm text-red-500"
                                />
                            </div>

                            {/* Free Checkbox */}
                            <div className="flex items-center gap-2">
                                <Field
                                    type="checkbox"
                                    name="isFree"
                                />
                                <span className="text-sm">
                                    This is a free course
                                </span>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Status
                                </label>
                                <Field
                                    as="select"
                                    name="status"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="UNPUBLISHED">Unpublished</option>
                                </Field>
                            </div>

                            {/* Thumbnail */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Thumbnail
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        setFieldValue(
                                            "thumbnail",
                                            event.currentTarget.files[0]
                                        )
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                                <ErrorMessage
                                    name="thumbnail"
                                    component="p"
                                    className="text-sm text-red-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Course"}
                            </button>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default CreateCourseModal
