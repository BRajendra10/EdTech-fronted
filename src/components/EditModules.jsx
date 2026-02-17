import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field } from "formik"
import { X } from "lucide-react"
import { updateModule } from "../features/slice/courseSlice"

const EditModules = ({ isOpen, onClose, module }) => {
    const dispatch = useDispatch()
    const { status } = useSelector((state) => state.courses)

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEsc)
        }

        return () => {
            document.removeEventListener("keydown", handleEsc)
        }
    }, [isOpen, onClose])

    if (!isOpen || !module) return null

    const initialValues = {
        title: module.title || "",
        description: module.description || "",
    }

    const handleSubmit = async (values) => {
        const updatedFields = {}

        if (values.title !== module.title)
            updatedFields.title = values.title.trim()

        if (values.description !== module.description)
            updatedFields.description = values.description.trim()

        if (Object.keys(updatedFields).length === 0) {
            onClose()
            return
        }

        await dispatch(
            updateModule({
                moduleId: module._id,
                formDataValues: updatedFields,
            })
        )

        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-background w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">
                        Edit Module
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ dirty }) => (
                        <Form className="space-y-4">
                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">
                                    Title
                                </label>
                                <Field
                                    name="title"
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">
                                    Description
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="4"
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
                                    disabled={!dirty || status === "loading"}
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {status === "loading"
                                        ? "Updating..."
                                        : "Update Module"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default EditModules