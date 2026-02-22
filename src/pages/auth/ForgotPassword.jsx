import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { forgotPassword } from "../../features/slice/userSlice"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "./AuthLayout"

export default function ForgotPassword() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await dispatch(forgotPassword(values.email)).unwrap()

                toast.success("OTP sent to your email")
                navigate("/verify-reset-otp", {
                    state: { email: values.email }
                })
            } catch (err) {
                toast.error(err)
            } finally {
                setSubmitting(false)
            }
        }
    })

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email to receive OTP"
        >
            <form onSubmit={formik.handleSubmit} className="space-y-6">

                <div className="space-y-2">
                    <Label>Email</Label>
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

                <Button
                    disabled={formik.isSubmitting}
                    className="w-full h-11 rounded-xl text-white"
                    style={{
                        background: "linear-gradient(135deg, #F29F67, #E0B50F)",
                    }}
                >
                    {formik.isSubmitting ? "Sending..." : "Send OTP"}
                </Button>

            </form>
        </AuthLayout>
    )
}