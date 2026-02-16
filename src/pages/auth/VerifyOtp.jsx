import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resendVerificationOtp, verifyOtp } from "../../features/slice/userSlice";
import { toast } from "sonner";

const otpSchema = Yup.object({
    otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
});

export default function VerifyOtp() {
    const inputsRef = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = localStorage.getItem("verifyUserId");

    console.log(userId);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        ✉️
                    </div>
                    <h1 className="text-lg font-semibold">Check your email</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        We sent a 6-digit verification code
                    </p>
                </div>

                <Formik
                    initialValues={{ otp: "" }}
                    validationSchema={otpSchema}
                    onSubmit={async (values) => {
                        console.log(values);

                        const result = await dispatch(verifyOtp({ userId: userId, verificationCode: values.otp }))

                        if (verifyOtp.fulfilled.match(result)) {
                            toast.success(result.payload.message);
                            navigate("/");
                        }
                    }}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="mt-6">
                            {/* OTP Boxes */}
                            <div className="flex justify-center gap-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={values.otp[index] || ""}
                                        ref={(el) => {
                                            if (el) inputsRef.current[index] = el;
                                        }}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            const otpArr = values.otp.split("");
                                            otpArr[index] = val;
                                            setFieldValue("otp", otpArr.join(""));

                                            if (val && inputsRef.current[index + 1]) {
                                                inputsRef.current[index + 1].focus();
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Backspace" &&
                                                !values.otp[index] &&
                                                inputsRef.current[index - 1]
                                            ) {
                                                inputsRef.current[index - 1].focus();
                                            }
                                        }}
                                        className="h-12 w-12 rounded-lg border text-center text-lg font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                    />
                                ))}
                            </div>

                            <ErrorMessage
                                name="otp"
                                component="p"
                                className="mt-2 text-center text-xs text-red-500"
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                className="mt-6 w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition"
                            >
                                Verify Email
                            </button>
                        </Form>
                    )}
                </Formik>

                {/* Resend */}
                <div className="mt-4 text-center text-sm">
                    Didn’t receive the code?{" "}
                    <button
                        className="font-medium text-purple-600 hover:underline"
                        onClick={async () => {
                            const result = await dispatch(
                                resendVerificationOtp({ userId })
                            );

                            if (resendVerificationOtp.fulfilled.match(result)) {
                                console.log("OTP resent");
                            }
                        }}
                    >
                        Resend
                    </button>
                </div>
            </div>
        </div>
    );
}
