import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../../features/slice/userSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import AuthLayout from "./AuthLayout"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Validation Schema
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await dispatch(login(values)).unwrap()
                toast.success("Login successful")
                navigate("/")
            } catch (error) {
                if (error === "Please verify your email first") {
                    navigate("/verify-otp", {
                        state: { email: values.email },
                    })
                } else {
                    toast.error(error || "Login failed")
                }
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Login to continue your learning journey"
        >
            <form onSubmit={formik.handleSubmit} className="space-y-6">

                {/* Email */}
                <div className="space-y-2">
                    <Label className="text-[#1E1E2C] font-medium">
                        Email
                    </Label>
                    <Input
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-[#F29F67]"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">
                            {formik.errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label className="text-[#1E1E2C] font-medium">
                        Password
                    </Label>

                    <div className="relative">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className="h-11 rounded-xl pr-10 focus-visible:ring-2 focus-visible:ring-[#F29F67]"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1E1E2C]"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">
                            {formik.errors.password}
                        </p>
                    )}
                </div>

                {/* Forgot Password */}
                <div className="text-right text-sm">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-[#3B8FF3] hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Button */}
                <Button
                    disabled={formik.isSubmitting}
                    className="w-full h-11 rounded-xl text-white font-medium transition-all duration-300 hover:opacity-90"
                    style={{
                        background: "linear-gradient(135deg, #F29F67, #E0B50F)",
                    }}
                >
                    {formik.isSubmitting ? "Logging in..." : "Login"}
                </Button>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 pt-2">
                    Don’t have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-medium text-[#3B8FF3] hover:underline"
                    >
                        Register
                    </button>
                </div>

            </form>
        </AuthLayout>
    )
}