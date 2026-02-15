import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice.js";
import courseReducer from "./slice/courseSlice.js";
import enrollmentReducer from "./slice/enrollmentSlice.js";

export const store = configureStore({
    reducer: {
        users: userReducer,
        courses: courseReducer,
        enrollments: enrollmentReducer,
    }
})