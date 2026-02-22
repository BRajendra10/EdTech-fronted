import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { verifyResetOtp } from "../../features/slice/userSlice"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "./AuthLayout"

export default function VerifyResetOtp() {

    const { state } = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const email = state?.email

    const formik = useFormik({
        initialValues: { otp: "" },
        validationSchema: Yup.object({
            otp: Yup.string()
                .length(6, "OTP must be 6 digits")
                .required("OTP is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await dispatch(
                    verifyResetOtp({ email, otp: values.otp })
                ).unwrap()

                toast.success("OTP verified")
                navigate("/reset-password", {
                    state: { email }
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
            title="Verify OTP"
            subtitle="Enter the OTP sent to your email"
        >
            <form onSubmit={formik.handleSubmit} className="space-y-6">

                <div className="space-y-2">
                    <Label>OTP Code</Label>
                    <Input
                        name="otp"
                        type="text"
                        maxLength={6}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.otp}
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
                    {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
                </Button>

            </form>
        </AuthLayout>
    )
}