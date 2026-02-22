import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { createCourse, fetchCourses } from "../features/slice/courseSlice"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>Fill in course details below to create a new course.</DialogDescription>
                </DialogHeader>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, setFieldValue, values, handleChange, handleBlur, touched, errors }) => (
                        <Form className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. Introduction to React"
                                />
                                {touched.title && errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="A brief summary of the course"
                                />
                                {touched.description && errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={values.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={values.isFree}
                                        placeholder="e.g. 499"
                                    />
                                    {touched.price && errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" value={values.status} onValueChange={(value) => setFieldValue("status", value)}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DRAFT">Draft</SelectItem>
                                            <SelectItem value="PUBLISHED">Published</SelectItem>
                                            <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isFree"
                                    name="isFree"
                                    checked={values.isFree}
                                    onCheckedChange={(checked) => setFieldValue("isFree", checked)}
                                />
                                <Label htmlFor="isFree" className="text-sm font-normal">
                                    This is a free course
                                </Label>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <Input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => setFieldValue("thumbnail", event.currentTarget.files[0])}
                                />
                                {touched.thumbnail && errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail}</p>}
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Course"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCourseModal
