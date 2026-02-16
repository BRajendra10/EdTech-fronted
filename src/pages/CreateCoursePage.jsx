import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { createCourse } from "../features/slice/courseSlice";

function CreateCoursePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        title: Yup.string()
            .min(3, "Title must be at least 3 characters")
            .required("Title is required"),

        description: Yup.string()
            .min(10, "Description must be at least 10 characters")
            .required("Description is required"),

        price: Yup.number()
            .when("isFree", {
                is: false,
                then: (schema) =>
                    schema
                        .typeError("Price must be a number")
                        .required("Price is required")
                        .min(1, "Price must be greater than 0"),
                otherwise: (schema) => schema.notRequired(),
            }),

        status: Yup.string().required(),

        thumbnail: Yup.mixed().required("Thumbnail is required"),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            price: "",
            status: "DRAFT",
            isFree: false,
            thumbnail: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            const result = await dispatch(createCourse(values));

            if (createCourse.fulfilled.match(result)) {
                navigate("/courses");
            }
        }

    });

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Course</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={formik.handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Course Title</label>
                            <Input
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <p className="text-sm text-red-500">
                                    {formik.errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                name="description"
                                rows={4}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-sm text-red-500">
                                    {formik.errors.description}
                                </p>
                            )}
                        </div>

                        {/* Price + Status */}
                        <div className="grid sm:grid-cols-2 gap-4">

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price</label>
                                <Input
                                    type="number"
                                    name="price"
                                    disabled={formik.values.isFree}
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.price && formik.errors.price && (
                                    <p className="text-sm text-red-500">
                                        {formik.errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    value={formik.values.status}
                                    onValueChange={(value) =>
                                        formik.setFieldValue("status", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                        <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Free Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isFree"
                                checked={formik.values.isFree}
                                onChange={formik.handleChange}
                            />
                            <span className="text-sm">This is a free course</span>
                        </div>

                        {/* Thumbnail */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Thumbnail</label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                    formik.setFieldValue(
                                        "thumbnail",
                                        event.currentTarget.files[0]
                                    )
                                }
                            />
                            {formik.touched.thumbnail && formik.errors.thumbnail && (
                                <p className="text-sm text-red-500">
                                    {formik.errors.thumbnail}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/courses")}
                            >
                                Cancel
                            </Button>

                            <Button type="submit">
                                Create Course
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateCoursePage;
