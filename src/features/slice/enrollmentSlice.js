import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios.js";

// Fetch all enrollments (for student, their own, for admin, all)
export const fetchEnrollments = createAsyncThunk(
    "enrollments/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/enrollments");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch enrollments");
        }
    }
);

// Enroll in a specific course
export const enrollInCourse = createAsyncThunk(
    "enrollments/enroll",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/enrollments/enroll/${courseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Enrollment failed");
        }
    }
);

// Update progress (e.g., mark lesson as complete)
export const updateProgress = createAsyncThunk(
    "enrollments/updateProgress",
    async ({ courseId, lessonId }, { rejectWithValue }) => {
        try {
            // NOTE: Assuming a new endpoint for progress. You will need to create this.
            const response = await api.put(`/enrollments/progress/${courseId}`, { lessonId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update progress");
        }
    }
);
// Cancel enrollment (for admins/instructors)
export const cancelEnrollmentByAdmin = createAsyncThunk(
    "enrollments/cancelByAdmin",
    async ({ userId, courseId }, { rejectWithValue }) => {
        try {
            const response = await api.patch("/enrollments/cancel", {
                userId,
                courseId,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to cancel enrollment");
        }
    }
);
const enrollmentSlice = createSlice({
    name: "enrollments",
    initialState: {
        enrollments: [],
        status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Enrollments ---
            .addCase(fetchEnrollments.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchEnrollments.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Assuming API returns { data: [...] } or just [...]
                state.enrollments = action.payload.data || action.payload;
            })
            .addCase(fetchEnrollments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // --- Enroll in Course ---
            .addCase(enrollInCourse.pending, (state) => {
                state.status = "loading";
            })
            .addCase(enrollInCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Optionally push to state if API returns the new enrollment
                // const newEnrollment = action.payload.data || action.payload;
                // state.enrollments.push(newEnrollment);
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // --- Update Progress ---
            .addCase(updateProgress.fulfilled, (state, action) => {
                const updatedEnrollment = action.payload.data || action.payload;
                const index = state.enrollments.findIndex(e => e._id === updatedEnrollment._id);
                if (index !== -1) {
                    state.enrollments[index] = updatedEnrollment;
                }
            })

            // --- Cancel Enrollment (Admin) ---
            .addCase(cancelEnrollmentByAdmin.fulfilled, (state, action) => {
                state.status = "succeeded";
                const cancelledEnrollment = action.payload.data || action.payload;
                const index = state.enrollments.findIndex(
                    (e) => e._id === cancelledEnrollment._id
                );
                if (index !== -1) {
                    // Update the status of the specific enrollment in the list
                    state.enrollments[index].status = "CANCELLED";
                }
            });;
    },
});

export const { resetStatus } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
