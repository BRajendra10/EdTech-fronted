import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signup } from "../../features/slice/userSlice";

const registerSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    role: Yup.string().required("Role is required"),
    avatar: Yup.mixed().required("Avatar is required"),
});


export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                fullName: "",
                email: "",
                password: "",
                role: "",
                avatar: null
            }}
            validationSchema={registerSchema}
            onSubmit={async (values) => {
                const formData = new FormData();
                formData.append("fullName", values.fullName);
                formData.append("email", values.email);
                formData.append("password", values.password);
                formData.append("role", values.role);


                if (values.avatar) {
                    formData.append("avatar", values.avatar);
                }

                const result = await dispatch(signup(formData));

                if (signup.fulfilled.match(result)) {
                    const userId = result.payload?.data?._id;

                    // store temporarily for OTP verification
                    localStorage.setItem("verifyUserId", userId);

                    navigate("/verify-otp");
                }
            }}
        >
            {({ setFieldValue }) => (
                <Form className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm text-foreground font-medium mb-1"
                        >
                            Full name
                        </label>
                        <Field
                            name="fullName"
                            id="fullName"
                            placeholder="Jhon doe"
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <ErrorMessage
                            name="fullName"
                            component="p"
                            className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm text-foreground font-medium mb-1"
                        >
                            Email address
                        </label>
                        <Field
                            name="email"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <ErrorMessage
                            name="email"
                            component="p"
                            className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm text-foreground font-medium mb-1"
                        >
                            Password
                        </label>
                        <Field
                            name="password"
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <ErrorMessage
                            name="password"
                            component="p"
                            className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* Avatar */}
                    <div>
                        <label className="block text-sm text-foreground font-medium mb-1">
                            Profile Avatar
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                setFieldValue("avatar", event.currentTarget.files?.[0]);
                            }}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <ErrorMessage
                            name="avatar"
                            component="p"
                            className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm text-foreground font-medium mb-1"
                        >
                            Role
                        </label>
                        <Field
                            as="select"
                            name="role"
                            id="role"
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select role</option>
                            <option value="STUDENT">Student</option>
                            <option value="INSTRUCTOR">Instructor</option>
                        </Field>
                        <ErrorMessage
                            name="role"
                            component="p"
                            className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-primary text-primary-foreground hover:opacity-90 py-2.5 text-sm font-medium transition disabled:opacity-50"
                    >
                        Create account
                    </button>
                </Form>
            )}
        </Formik>
    );
}
