import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import api from "../axios.js";

/* =========================================================
   FETCH ENROLLMENTS (Student: own | Admin: all)
========================================================= */
export const fetchEnrollments = createAsyncThunk(
    "enrollments/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/enrollments");
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch enrollments"
            );
        }
    }
);

/* =========================================================
   ENROLL INTO COURSE (Student)
========================================================= */
export const enrollInCourse = createAsyncThunk(
    "enrollments/enroll",
    async (courseId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/enrollments/enroll/${courseId}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Enrollment failed"
            );
        }
    }
);

/* =========================================================
   COMPLETE COURSE (Student)
========================================================= */
export const completeEnrollment = createAsyncThunk(
    "enrollments/complete",
    async (courseId, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(
                `/enrollments/complete/${courseId}`
            );
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to complete course"
            );
        }
    }
);

/* =========================================================
   UPDATE ENROLLED STUDENTS (Admin / Instructor)
========================================================= */
export const updateEnrollmentStatus = createAsyncThunk(
    "enrollments/updateStatus",
    async ({ courseId, userId, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(
                `/enrollments/status/`,
                { courseId, userId, status }
            );

            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update status"
            );
        }
    }
);

/* =========================================================
   FETCH ENROLLED STUDENTS (Admin / Instructor)
========================================================= */
export const fetchEnrolledStudents = createAsyncThunk(
    "enrollments/fetchStudents",
    async (courseId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `/enrollments/course/${courseId}/students`
            );
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch enrolled students"
            );
        }
    }
);

/* =========================================================
   SLICE
========================================================= */

const enrollmentSlice = createSlice({
    name: "enrollments",
    initialState: {
        enrollments: [],
        enrolledStudents: [],
        enrollmentCourses: [],

        status: "idle",
        error: null,
    },

    reducers: {
        resetEnrollmentState: (state) => {
            state.loading = false;
            state.actionLoading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* ================= FETCH ENROLLMENTS ================= */
            .addCase(fetchEnrollments.fulfilled, (state, action) => {
                state.status = "fulfilled";

                state.enrollments = action.payload.enrollments;
                state.enrollmentCourses = action.payload.courses;
            })

            /* ================= ENROLL ================= */
            .addCase(enrollInCourse.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.enrollments.unshift(action.payload);
            })

            /* ================= COMPLETE COURSE ================= */
            .addCase(completeEnrollment.fulfilled, (state, action) => {
                state.status = "fulfilled";

                const updated = action.payload;
                const index = state.enrollments.findIndex(
                    (e) => e._id === updated._id
                );

                if (index !== -1) {
                    state.enrollments[index] = updated;
                }
            })

            /* ================= CANCEL (ADMIN) ================= */
            .addCase(updateEnrollmentStatus.fulfilled, (state, action) => {
                state.status = "fulfilled";

                const updated = action.payload;

                const index = state.enrollments.findIndex(
                    (e) => e._id === updated._id
                );

                if (index !== -1) {
                    state.enrollments[index] = updated;
                }
            })

            /* ================= FETCH STUDENTS ================= */
            .addCase(fetchEnrolledStudents.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.enrolledStudents = action.payload;
            })

            // Handle ALL pending states
            .addMatcher(isPending(fetchEnrollments, enrollInCourse, completeEnrollment, updateEnrollmentStatus, fetchEnrolledStudents), (state) => {
                state.status = "pending";
                state.error = null;
            })

            // Handle ALL rejected states
            .addMatcher(isRejected(fetchEnrollments, enrollInCourse, completeEnrollment, updateEnrollmentStatus, fetchEnrolledStudents), (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            })
    },
});

export const { resetEnrollmentState } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;