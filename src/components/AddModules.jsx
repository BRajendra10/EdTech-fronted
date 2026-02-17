import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { addModule } from "../features/slice/courseSlice.js"

const AddModuleModal = ({ isOpen, onClose, courseId, order }) => {
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
        description: ""
    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Module title is required")
            .min(3, "Minimum 3 characters"),
        description: Yup.string()
            .required("Description is required")
            .min(5, "Minimum 5 characters"),
    })

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(
                addModule({
                    courseId,
                    formData: {
                        ...values,
                        order
                    }
                })
            ).unwrap()

            resetForm()
            onClose() // close modal after success
        } catch (error) {
            console.error("Module creation failed:", error)
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
                className="bg-white w-full max-w-lg rounded-xl shadow-xl p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Add New Module
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Module will be added as #{order}
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
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Module Title
                                </label>
                                <Field
                                    name="title"
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="Enter module title"
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
                                    placeholder="Enter module description"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="p"
                                    className="text-sm text-red-500"
                                />
                            </div>

                            {/* Order (readonly) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Order
                                </label>
                                <input
                                    value={order}
                                    disabled
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Module"}
                            </button>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AddModuleModal
