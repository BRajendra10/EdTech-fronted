import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../features/slice/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const loginSchema = Yup.object({
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required"),
});

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={async (values, { resetForm }) => {
                const result = await dispatch(login(values));
                // console.log(result);

                if (login.fulfilled.match(result)) {
                    toast.success(result.payload.message);

                    localStorage.setItem("currentUser", JSON.stringify(result.payload.data))

                    resetForm();
                    navigate("/");
                }
            }}
        >
            <Form className="space-y-4">
                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-1"
                    >
                        Email address
                    </label>
                    <Field
                        name="email"
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <ErrorMessage
                        name="email"
                        component="p"
                        className="mt-1 text-xs text-red-500"
                    />
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <Field
                        name="password"
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <ErrorMessage
                        name="password"
                        component="p"
                        className="mt-1 text-xs text-red-500"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full rounded-lg bg-primary text-primary-foreground hover:opacity-90 py-2.5 text-sm font-medium transition disabled:opacity-50"
                >
                    Sign in
                </button>
            </Form>
        </Formik>
    );
}