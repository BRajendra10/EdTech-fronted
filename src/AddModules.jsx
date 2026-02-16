import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { addModule } from "./features/slice/courseSlice.js";
import { useLocation } from "react-router-dom"


const AddModule = () => {
    const { courseId } = useParams()
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const order = location.state?.order || 1

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
            navigate(-1) // go back after success
        } catch (error) {
            console.error("Module creation failed:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Add Module</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Module Title</label>
                            <Field
                                name="title"
                                type="text"
                                className="w-full border rounded-md p-2"
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
                            <label className="text-sm font-medium">Description</label>
                            <Field
                                name="description"
                                as="textarea"
                                className="w-full border rounded-md p-2"
                                placeholder="Enter module description"
                            />
                            <ErrorMessage
                                name="description"
                                component="p"
                                className="text-sm text-red-500"
                            />
                        </div>

                        {/* Order */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Order</label>
                            <input
                                value={order}
                                disabled
                                className="w-full border rounded-md p-2 bg-gray-100"
                            />
                        </div>


                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? "Creating..." : "Create Module"}
                        </Button>

                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddModule
