import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { resetPassword } from "../../features/slice/userSlice"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "./AuthLayout"

export default function ResetPassword() {

    const { state } = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const email = state?.email

    const formik = useFormik({
        initialValues: { newPassword: "" },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(6, "Minimum 6 characters")
                .required("Password required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await dispatch(
                    resetPassword({ email, newPassword: values.newPassword })
                ).unwrap()

                toast.success("Password reset successful")
                navigate("/login")

            } catch (err) {
                toast.error(err)
            } finally {
                setSubmitting(false)
            }
        }
    })

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Set your new password"
        >
            <form onSubmit={formik.handleSubmit} className="space-y-6">

                <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                        name="newPassword"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newPassword}
                        className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-[#F29F67]"
                    />
                </div>

                <Button
                    disabled={formik.isSubmitting}
                    className="w-full h-11 rounded-xl text-white"
                    style={{
                        background: "linear-gradient(135deg, #F29F67, #E0B50F)",
                    }}
                >
                    {formik.isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>

            </form>
        </AuthLayout>
    )
}