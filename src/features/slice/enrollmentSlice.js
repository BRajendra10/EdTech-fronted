import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import api from "../axios.js";

export const enrollInCourse = createAsyncThunk(
    "enrollment/enrollInCourse",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/enrollments/enroll/${courseId}`
            );

            return response.data.data; // ApiResponse -> data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Enrollment failed"
            );
        }
    }
);

const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState: {
        enrollment: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Enroll into course
            .addCase(enrollInCourse.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.enrollment = action.payload;
            })
            
            // Handle ALL pending states
            .addMatcher(isPending(enrollInCourse), (state) => {
                state.status = "pending";
                state.error = null;
            })

            // Handle ALL rejected states
            .addMatcher(isRejected(enrollInCourse), (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            })
    },
});

export default enrollmentSlice.reducer;
