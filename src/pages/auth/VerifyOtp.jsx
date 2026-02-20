import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import api from "../../features/axios"
import AuthLayout from "./AuthLayout"

export default function VerifyOtp() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    useEffect(() => {
        if (!email){
            navigate("/login");
            toast.message("Email is required");
        }
    }, [email, navigate])

    const validationSchema = Yup.object({
        otp: Yup.string()
            .length(6, "OTP must be 6 digits")
            .required("OTP is required"),
    })

    return (
        <AuthLayout
            title="Verify your email"
            subtitle={`Enter the 6-digit code sent to ${email}`}
        >
            <Formik
                initialValues={{ otp: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await api.post("/verify-otp", {
                            email,
                            verificationCode: values.otp,
                        })

                        toast.success("Email verified successfully")
                        navigate("/login")
                    } catch (error) {
                        toast.error(
                            error.response?.data?.message || "Invalid OTP"
                        )
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">

                        <div className="space-y-2 text-center">
                            <Label>OTP Code</Label>
                            <Field
                                as={Input}
                                name="otp"
                                maxLength={6}
                                className="h-12 text-center text-xl tracking-widest rounded-xl focus-visible:ring-2 focus-visible:ring-[#F29F67]"
                            />
                            <ErrorMessage name="otp" component="p" className="text-red-500 text-sm" />
                        </div>

                        <Button
                            disabled={isSubmitting}
                            className="w-full h-11 rounded-xl text-white"
                            style={{
                                background: "linear-gradient(135deg, #F29F67, #E0B50F)",
                            }}
                        >
                            {isSubmitting ? "Verifying..." : "Verify"}
                        </Button>

                        <div className="text-center text-sm text-gray-500">
                            Didn’t receive the code?{" "}
                            <button
                                type="button"
                                className="text-[#3B8FF3] font-medium hover:underline"
                            >
                                Resend OTP
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </AuthLayout>
    )
}