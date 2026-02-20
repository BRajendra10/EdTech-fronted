import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signup } from "../../features/slice/userSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import AuthLayout from "./AuthLayout"

export default function Register() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const validationSchema = Yup.object({
        fullName: Yup.string().required("Full name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
        role: Yup.string().required("Role is required"),
        avatar: Yup.mixed().required("Avatar is required"),
    })

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start your journey with our LMS"
        >
            <Formik
                initialValues={{
                    fullName: "",
                    email: "",
                    password: "",
                    role: "",
                    avatar: null,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const formData = new FormData()
                        Object.keys(values).forEach((key) => {
                            formData.append(key, values[key])
                        })

                        await dispatch(signup(formData)).unwrap()

                        toast.success("OTP sent to your email")

                        navigate("/verify-otp", {
                            state: { email: values.email },
                        })
                    } catch (error) {
                        toast.error(error || "Signup failed")
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Field
                                as={Input}
                                name="fullName"
                                className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-[#F29F67]"
                            />
                            <ErrorMessage name="fullName" component="p" className="text-red-500 text-sm" />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Field
                                as={Input}
                                name="email"
                                type="email"
                                className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-[#F29F67]"
                            />
                            <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Field
                                as={Input}
                                name="password"
                                type="password"
                                className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-[#F29F67]"
                            />
                            <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                onValueChange={(value) =>
                                    setFieldValue("role", value)
                                }
                            >
                                <SelectTrigger className="h-11 rounded-xl focus:ring-2 focus:ring-[#F29F67]">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                </SelectContent>
                            </Select>
                            <ErrorMessage name="role" component="p" className="text-red-500 text-sm" />
                        </div>

                        {/* Avatar */}
                        <div className="space-y-2">
                            <Label>Avatar</Label>
                            <Input
                                type="file"
                                onChange={(e) =>
                                    setFieldValue("avatar", e.currentTarget.files[0])
                                }
                                className="h-11 rounded-xl cursor-pointer file:bg-[#F29F67] file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                            />
                            <ErrorMessage name="avatar" component="p" className="text-red-500 text-sm" />
                        </div>

                        <Button
                            disabled={isSubmitting}
                            className="w-full h-11 rounded-xl text-white"
                            style={{
                                background: "linear-gradient(135deg, #F29F67, #E0B50F)",
                            }}
                        >
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </Button>

                        <div className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-[#3B8FF3] font-medium hover:underline"
                            >
                                Login
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </AuthLayout>
    )
}